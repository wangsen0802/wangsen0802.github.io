<script setup lang="ts">
interface Stats {
  totalViews: number
  totalUniqueVisitors: number
  totalPages: number
  topPages: Array<{
    page_path: string
    view_count: number
    unique_visitors: number
  }>
  timestamp: string
}

const { data: stats } = await useFetch<Stats>('/api/stats/overview', {
  // 客户端获取，缓存 5 分钟
  server: false,
  key: 'stats-overview',
  transform: (data) => data,
})

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化路径
const formatPath = (path: string) => {
  if (path === '/') return '首页'
  if (path.startsWith('/posts/')) {
    return path.replace('/posts/', '文章: ')
  }
  return path
}
</script>

<template>
  <div class="stats-overview" v-if="stats">
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatNumber(stats.totalViews) }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatNumber(stats.totalUniqueVisitors) }}</div>
          <div class="stat-label">独立访客</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📄</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalPages }}</div>
          <div class="stat-label">页面数</div>
        </div>
      </div>
    </div>

    <div class="top-pages" v-if="stats.topPages?.length">
      <h3>热门页面</h3>
      <ul class="top-pages-list">
        <li v-for="page in stats.topPages" :key="page.page_path" class="top-page-item">
          <span class="page-path">{{ formatPath(page.page_path) }}</span>
          <span class="page-views">{{ formatNumber(page.view_count) }} 次</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-overview {
  padding: 1rem;

  .stats-cards {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: 12px;
      flex: 1;
      min-width: 140px;

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-info {
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
      }
    }
  }

  .top-pages {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .top-pages-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .top-page-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-secondary);

        &:last-child {
          border-bottom: none;
        }

        .page-path {
          font-size: 0.875rem;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }

        .page-views {
          font-size: 0.75rem;
          color: var(--accent-primary);
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .stats-overview {
    .stats-cards {
      .stat-card {
        min-width: 100%;
      }
    }
  }
}
</style>
