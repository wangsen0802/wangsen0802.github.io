<script setup lang="ts">
import type { TrendItem } from '~/types'

// SEO
useHead({
  title: '网站统计 - wanGISen',
  meta: [{ name: 'description', content: 'wanGISen 个人博客网站访问统计' }],
})

// 概览数据
const { overview } = useStats()

// 趋势数据
const currentPeriod = ref<'day' | 'week' | 'month'>('day')
const periodDays = computed(() => {
  if (currentPeriod.value === 'day') return 30
  if (currentPeriod.value === 'week') return 12
  return 6
})

const trendData = ref<TrendItem[]>([])
const loadingTrend = ref(false)

const loadTrend = async () => {
  loadingTrend.value = true
  try {
    const res = await $fetch<{ period: string; data: TrendItem[] }>('/api/stats/trending', {
      params: { period: currentPeriod.value, days: periodDays.value },
    })
    trendData.value = res.data
  } catch {
    trendData.value = []
  } finally {
    loadingTrend.value = false
  }
}

watch(currentPeriod, loadTrend, { immediate: true })

// 页面加载动画
const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => (isLoaded.value = true), 100)
})
</script>

<template>
  <div class="stats-page" :class="{ loaded: isLoaded }">
    <div class="stats-container">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="page-title">网站统计</h1>
        <p class="page-desc">wanGISen 博客访问数据概览</p>
      </header>

      <!-- 统计卡片 -->
      <section class="stats-cards" v-if="overview.data.value">
        <StatsStatCard
          icon="eye"
          label="总浏览量"
          :value="overview.data.value.totalViews"
          :today-value="overview.data.value.todayViews"
        />
        <StatsStatCard
          icon="users"
          label="独立访客"
          :value="overview.data.value.totalUV"
          :today-value="overview.data.value.todayUV"
        />
        <StatsStatCard icon="file" label="页面数" :value="overview.data.value.totalPages" />
      </section>

      <!-- 趋势图 -->
      <section class="trend-section">
        <div class="section-header">
          <h2 class="section-title">访问趋势</h2>
          <div class="period-tabs">
            <button
              v-for="p in (['day', 'week', 'month'] as const)"
              :key="p"
              class="period-tab"
              :class="{ active: currentPeriod === p }"
              @click="currentPeriod = p"
            >
              {{ p === 'day' ? '日' : p === 'week' ? '周' : '月' }}
            </button>
          </div>
        </div>
        <div class="chart-wrapper">
          <div v-if="loadingTrend" class="chart-loading">加载中...</div>
          <StatsTrendChart v-else-if="trendData.length" :data="trendData" />
          <div v-else class="chart-empty">暂无趋势数据</div>
        </div>
      </section>

      <!-- 热门页面 -->
      <section class="top-pages-section" v-if="overview.data.value?.topPages?.length">
        <StatsTopPagesList :pages="overview.data.value.topPages" />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-page {
  min-height: 100vh;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s var(--ease-out-expo);

  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-container {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
}

.page-header {
  margin-bottom: var(--space-2xl);

  .page-title {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }

  .page-desc {
    font-size: 1rem;
    color: var(--text-tertiary);
  }
}

/* 统计卡片 */
.stats-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: var(--space-2xl);
}

/* 趋势区域 */
.trend-section {
  margin-bottom: var(--space-2xl);
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.period-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-tertiary);
  padding: 3px;
  border-radius: 8px;
}

.period-tab {
  padding: 4px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.chart-wrapper {
  position: relative;
  min-height: 300px;
}

.chart-loading,
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

/* 热门页面区域 */
.top-pages-section {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-container {
    padding: var(--space-lg);
  }

  .stats-cards {
    flex-direction: column;
  }
}
</style>
