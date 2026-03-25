<template>
  <a-button
    :type="isDark ? 'primary' : 'default'"
    :icon="isDark ? h(BulbOutlined) : h(BulbOutlined)"
    @click="toggleTheme"
    class="theme-toggle"
    :title="isDark ? '切换到亮色主题' : '切换到暗色主题'"
  >
    {{ isDark ? '亮色' : '暗色' }}
  </a-button>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { BulbOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const isDark = computed(() => appStore.currentTheme === 'dark')

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<style scoped lang="scss">
.theme-toggle {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>