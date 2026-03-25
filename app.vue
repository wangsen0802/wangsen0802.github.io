<script setup lang="ts">
// 主题状态
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 切换主题
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 提供给子组件
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* 全局样式将在 assets/styles/main.scss 中定义 */
</style>
