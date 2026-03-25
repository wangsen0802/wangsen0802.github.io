<template>
  <a-button
    type="text"
    class="theme-toggle"
    :title="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    @click="toggleTheme"
  >
    <template #icon>
      <span v-if="isDark">🌙</span>
      <span v-else>☀️</span>
    </template>
  </a-button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped lang="scss">
.theme-toggle {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
