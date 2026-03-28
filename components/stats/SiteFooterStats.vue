<script setup lang="ts">
import { Eye, Users } from 'lucide-vue-next'
import type { StatsOverview } from '~/types'

const { data: stats } = await useFetch<StatsOverview>('/api/stats/overview', {
  server: false,
  key: 'footer-stats',
})

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toLocaleString()
}
</script>

<template>
  <span v-if="stats" class="footer-stats">
    <span class="stat-item">
      <Eye :size="14" />
      {{ formatNumber(stats.totalViews) }} 次浏览
    </span>
    <span class="stat-divider">·</span>
    <span class="stat-item">
      <Users :size="14" />
      {{ formatNumber(stats.totalUV) }} 位访客
    </span>
  </span>
</template>

<style scoped lang="scss">
.footer-stats {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  .stat-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .stat-divider {
    color: var(--text-muted);
  }
}
</style>
