<template>
  <a-tooltip :title="isDark ? '切换到亮色主题' : '切换到暗色主题'" placement="bottom">
    <a-button
      :type="isDark ? 'primary' : 'default'"
      shape="circle"
      :icon="h(isDark ? GlobalOutlined : BulbOutlined)"
      @click="toggleTheme"
      class="theme-toggle-nav"
      size="middle"
    />
  </a-tooltip>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { BulbOutlined, GlobalOutlined } from '@ant-design/icons-vue'

// 使用合适的图标表示月亮和太阳
// 月亮图标：使用 GlobalOutlined (地球图标) 在暗色主题下像月亮
// 太阳图标：使用 BulbOutlined (灯泡图标) 在亮色主题下像太阳
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const isDark = computed(() => appStore.currentTheme === 'dark')

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<style scoped lang="scss">
.theme-toggle-nav {
  transition: all 0.3s ease;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: var(--bg-tertiary) !important;
    border-color: var(--accent-primary);
    color: var(--accent-primary) !important;
  }

  &:active {
    transform: translateY(0);
  }

  // 暗色主题下的样式
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white !important;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: var(--accent-primary);
    }
  }

  // 亮色主题下的样式
  [data-theme="light"] &.ant-btn-primary {
    background: var(--accent-primary) !important;
    border-color: var(--accent-primary) !important;
    color: white !important;

    &:hover {
      background: var(--accent-secondary) !important;
      border-color: var(--accent-secondary) !important;
    }
  }

  :deep(.anticon) {
    font-size: 16px;
    transition: all 0.3s ease;
  }

  // 响应式设计
  @media (max-width: 768px) {
    :deep(.anticon) {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    :deep(.anticon) {
      font-size: 12px;
    }
  }
}

// 确保过渡效果
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>