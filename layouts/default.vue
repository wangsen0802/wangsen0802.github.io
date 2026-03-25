<script setup lang="ts">
// 导航菜单
const navItems = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/posts' },
  { name: '关于', path: '/about' },
]

// 当前路由
const route = useRoute()

// 当前选中的导航
const selectedNav = computed(() => {
  const path = route.path
  if (path === '/') return '/'
  if (path.startsWith('/posts')) return '/posts'
  if (path === '/about') return '/about'
  return path
})
</script>

<template>
  <!-- Three.js 背景 -->
  <ClientOnly>
    <ThreeBackground />
  </ClientOnly>

  <a-layout class="layout">
    <!-- 导航栏 -->
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/">wanGISen</NuxtLink>
        </div>

        <a-menu
          mode="horizontal"
          :selected-keys="[selectedNav]"
          class="nav-menu"
        >
          <a-menu-item v-for="item in navItems" :key="item.path">
            <NuxtLink :to="item.path">{{ item.name }}</NuxtLink>
          </a-menu-item>
        </a-menu>

        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </a-layout-header>

    <!-- 主内容区 -->
    <a-layout-content class="content">
      <div class="content-wrapper">
        <slot />
      </div>
    </a-layout-content>

    <!-- 页脚 -->
    <a-layout-footer class="footer">
      <div class="footer-content">
        <p>© 2026 wanGISen. All rights reserved.</p>
        <p>
          Built with
          <a href="https://nuxt.com" target="_blank" rel="noopener">Nuxt 3</a>
          &
          <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a>
        </p>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  background: transparent !important;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 2rem;
  height: 64px;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;

    a {
      color: var(--text-primary);
      text-decoration: none;

      &:hover {
        color: var(--accent-primary);
      }
    }
  }

  .nav-menu {
    flex: 1;
    justify-content: center;
    background: transparent;
    border: none;

    :deep(.ant-menu-item) {
      a {
        color: var(--text-primary);
        text-decoration: none;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.content {
  padding: 2rem;
  min-height: calc(100vh - 64px - 80px);
  background: transparent !important;

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.footer {
  text-align: center;
  padding: 1.5rem 2rem;
  background: transparent !important;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;

    p {
      margin: 0.25rem 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    a {
      color: var(--accent-primary);
      text-decoration: none;

      &:hover {
        color: var(--accent-secondary);
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 1rem;

    .nav-menu {
      display: none;
    }
  }

  .content {
    padding: 1rem;
  }
}
</style>
