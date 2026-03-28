<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import type { TopPage } from '~/types'

defineProps<{
  pages: TopPage[]
}>()

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toLocaleString()
}

const formatPath = (path: string) => {
  if (path === '/') return '首页'
  if (path.startsWith('/posts/')) return path.replace('/posts/', '文章: ')
  return path
}
</script>

<template>
  <div class="top-pages">
    <h3 class="section-title">热门页面</h3>
    <ul class="top-pages-list">
      <li v-for="(page, index) in pages" :key="page.pagePath" class="top-page-item">
        <span class="page-rank" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</span>
        <NuxtLink :to="page.pagePath" class="page-path">
          {{ formatPath(page.pagePath) }}
        </NuxtLink>
        <span class="page-views">
          <Eye :size="14" />
          {{ formatNumber(page.viewCount) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.top-pages-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .top-page-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-secondary);

    &:last-child {
      border-bottom: none;
    }
  }
}

.page-rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  flex-shrink: 0;

  &.rank-top {
    background: var(--accent-primary);
    color: white;
  }
}

.page-path {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: var(--accent-primary);
  }
}

.page-views {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 500;
  flex-shrink: 0;
}
</style>
