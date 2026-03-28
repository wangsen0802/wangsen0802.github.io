<script setup lang="ts">
// 导航菜单
const navItems = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/posts' },
]

// 当前路由
const route = useRoute()

// 当前选中的导航
const selectedNav = computed(() => {
  const path = route.path
  if (path === '/') return '/'
  if (path.startsWith('/posts')) return '/posts'
  return path
})

// 滚动状态
const isScrolled = ref(false)
const scrollY = ref(0)

// 移动端菜单
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 页面统计
usePageStats()

// 搜索索引初始化
const { initSearchIndex, addDocuments } = useSearch()

onMounted(async () => {
  try {
    const { data, success } = await $fetch('/api/search.index')
    if (success && data) {
      initSearchIndex()
      addDocuments(data)
    }
  } catch (error) {
    console.error('初始化搜索索引失败:', error)
  }
})

// 关闭移动菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <!-- SVG 背景 -->
  <SvgBackground />

  <div class="layout" :class="{ scrolled: isScrolled }">
    <!-- 导航栏 -->
    <header class="header">
      <div class="header-inner">
        <!-- Logo -->
        <NuxtLink to="/" class="logo" @click="closeMobileMenu">
          <SvgLogo :animated="false" :size="32" />
          <span class="logo-text">wanGISen</span>
        </NuxtLink>

        <!-- 桌面导航 -->
        <nav class="nav-desktop">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: selectedNav === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- 右侧操作 -->
        <div class="header-actions">
          <SearchModal />
          <ThemeToggle />

          <!-- 移动端菜单按钮 -->
          <button
            class="mobile-menu-btn"
            :class="{ active: isMobileMenuOpen }"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="菜单"
          >
            <span class="menu-line" />
            <span class="menu-line" />
            <span class="menu-line" />
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="mobile-menu">
        <nav v-if="isMobileMenuOpen" class="nav-mobile">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link-mobile"
            :class="{ active: selectedNav === item.path }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>
      </Transition>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <!-- 装饰线 -->
        <div class="footer-divider">
          <svg viewBox="0 0 400 20" class="divider-svg">
            <line x1="150" y1="10" x2="250" y2="10" stroke="var(--border-primary)" stroke-width="0.5" />
          </svg>
        </div>

        <div class="footer-content">
          <p class="copyright">© 2026 wanGISen</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ============================================
   导航栏
   ============================================ */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  transition: all var(--duration-normal) var(--ease-out-quart);

  .layout.scrolled & {
    background: rgba(250, 250, 249, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--shadow-sm);
  }

  .dark .layout.scrolled & {
    background: rgba(12, 10, 9, 0.9);
  }
}

.header-inner {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-xl);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  transition: opacity var(--duration-fast) ease;

  &:hover {
    opacity: 0.8;
  }
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link {
  position: relative;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
  }

  &.active {
    color: var(--accent-primary);

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: var(--accent-primary);
      border-radius: var(--radius-full);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  padding: var(--space-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;

  .menu-line {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--text-primary);
    border-radius: var(--radius-full);
    transition: all var(--duration-fast) ease;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    &:nth-child(1) { top: 12px; }
    &:nth-child(2) { top: 50%; transform: translate(-50%, -50%); }
    &:nth-child(3) { bottom: 12px; }
  }

  &.active {
    .menu-line {
      &:nth-child(1) {
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        bottom: 50%;
        transform: translate(-50%, 50%) rotate(-45deg);
      }
    }
  }
}

/* 移动端菜单 */
.nav-mobile {
  display: none;
  flex-direction: column;
  padding: var(--space-md) var(--space-xl) var(--space-xl);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

.nav-link-mobile {
  padding: var(--space-md) 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px solid var(--border-secondary);
  transition: color var(--duration-fast) ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover,
  &.active {
    color: var(--accent-primary);
  }
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all var(--duration-normal) var(--ease-out-quart);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================
   主内容区
   ============================================ */
.main {
  flex: 1;
  width: 100%;
}

/* ============================================
   页脚
   ============================================ */
.footer {
  margin-top: auto;
  padding: var(--space-2xl) var(--space-xl);
  background: transparent;
}

.footer-inner {
  max-width: var(--container-xl);
  margin: 0 auto;
}

.footer-divider {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-xl);

  .divider-svg {
    width: 200px;
    height: 20px;
  }
}

.footer-content {
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 var(--space-lg);
    height: 64px;
  }

  .nav-desktop {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .nav-mobile {
    display: flex;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .footer {
    padding: var(--space-xl) var(--space-lg);
  }
}
</style>
