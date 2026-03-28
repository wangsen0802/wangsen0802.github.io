<script setup lang="ts">
import { Eye, Users, FileText } from 'lucide-vue-next'

const props = defineProps<{
  label: string
  value: number
  todayValue?: number
  icon: 'eye' | 'users' | 'file'
}>()

const iconMap = {
  eye: Eye,
  users: Users,
  file: FileText,
}

const iconComponent = computed(() => iconMap[props.icon])

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toLocaleString()
}
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon">
      <component :is="iconComponent" :size="20" />
    </div>
    <div class="stat-info">
      <div class="stat-value">{{ formatNumber(value) }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
    <div v-if="todayValue !== undefined" class="stat-today">
      <span class="today-arrow">↑</span>
      {{ todayValue }} 今日
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  flex: 1;
  min-width: 160px;
  position: relative;

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--bg-tertiary);
    color: var(--accent-primary);
    flex-shrink: 0;
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
      margin-top: 2px;
    }
  }

  .stat-today {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 0.6875rem;
    color: var(--accent-primary);
    background: rgba(var(--accent-primary-rgb, 59, 130, 246), 0.1);
    padding: 2px 8px;
    border-radius: 99px;

    .today-arrow {
      font-weight: 600;
    }
  }
}

@media (max-width: 768px) {
  .stat-card {
    min-width: 100%;
  }
}
</style>
