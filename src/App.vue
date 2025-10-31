<template>
  <!-- 全局加载组件 -->
  <AppLoading v-if="appStore.isLoading" :progress="appStore.getInitializationProgress" />

  <!-- 主应用布局 -->
  <a-layout
    v-else
    class="app"
    :class="{ 'app--loaded': appStore.isAppInitialized }"
  >
    <a-layout-header class="header">
      <div class="header-content">
        <Navigation />
      </div>
    </a-layout-header>

    <a-layout-content class="main">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 王森的个人网站. All rights reserved.</p>

        <div class="footer-links">
          <a
            href="https://github.com/wangsen0802"
            target="_blank"
            rel="noopener"
          >
            <GithubOutlined />
          </a>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { GithubOutlined } from '@ant-design/icons-vue'
import Navigation from '@/components/Navigation.vue'
import AppLoading from '@/components/AppLoading.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

// 监听加载状态变化，添加相应的class到body
watch(
  () => appStore.isLoading,
  (isLoading) => {
    if (isLoading) {
      document.body.classList.add('app-loading')
      document.body.classList.remove('app-loaded')
    } else {
      document.body.classList.remove('app-loading')
      document.body.classList.add('app-loaded')
    }
  },
  { immediate: true }
)

// 监听主题变化
watch(
  () => appStore.currentTheme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  },
  { immediate: true }
)

// 组件挂载后的初始化
onMounted(() => {
  // 如果应用还没有完成初始化，触发初始化流程
  if (!appStore.isAppInitialized) {
    // 这里可以添加额外的初始化逻辑
    // 例如：获取用户信息、加载缓存数据等
  }

  // 移除可能存在的原生加载页面
  const nativeLoading = document.getElementById('native-loading')
  if (nativeLoading && !appStore.isLoading) {
    nativeLoading.classList.add('fade-out')
    setTimeout(() => {
      nativeLoading.remove()
    }, 500)
  }
})
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background-color: transparent;
  opacity: 0;
  transition: opacity 0.5s ease-in;

  &--loaded {
    opacity: 1;
  }
}

.header {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transform: translateY(-100%);
  transition: transform 0.5s ease-out;

  .app--loaded & {
    transform: translateY(0);
  }

  // 暗色主题下的透明效果
  [data-theme="dark"] & {
    background: rgba(0, 0, 0, 0.3) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
  }
}

.main {
  flex: 1;
  background-color: transparent;
  padding-top: 64px; /* 头部栏高度 */
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out 0.2s;

  .app--loaded & {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 100;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out 0.4s;

  .app--loaded & {
    opacity: 1;
    transform: translateY(0);
  }

  // 暗色主题下的透明效果
  [data-theme="dark"] & {
    background: rgba(0, 0, 0, 0.3) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .footer-links {
      display: flex;
      gap: 16px;

      a {
        color: var(--text-secondary);
        font-size: 18px;
        transition: color 0.3s ease;

        &:hover {
          color: var(--accent-primary);
          transform: translateY(-2px);
          display: inline-block;
        }
      }
    }
  }
}

// 全局样式增强
:global(body) {
  &.app-loading {
    overflow: hidden;
  }

  &.app-loaded {
    overflow: auto;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header .header-content {
    padding: 0 16px;
  }

  .footer .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 20px 16px;
  }
}

// 预加载动画优化
@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

