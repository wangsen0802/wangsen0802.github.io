<template>
  <div class="navigation">
    <div class="nav-menu">
      <a-menu mode="horizontal" :selected-keys="selectedKeys">
        <a-menu-item key="home" @click="navigateTo('/')">
          <HomeOutlined /> 首页
        </a-menu-item>

        <a-menu-item key="posts" @click="navigateTo('/posts')">
          <BookOutlined /> 文章
        </a-menu-item>

        <a-menu-item key="mapbox" @click="navigateTo('/mapbox')">
          <EnvironmentOutlined /> Mapbox
        </a-menu-item>

        <a-menu-item key="about" @click="navigateTo('/about')">
          <UserOutlined /> 关于
        </a-menu-item>
      </a-menu>
    </div>

    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeOutlined,
  BookOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => {
  const path = route.path
  if (path === '/') return ['home']
  if (path.startsWith('/posts')) return ['posts']
  if (path === '/mapbox') return ['mapbox']
  if (path === '/about') return ['about']
  return []
})

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border-bottom: none;
  padding: 0 24px;
  height: 64px;

  .nav-menu {
    flex: 1;
  }

  :deep(.ant-menu) {
    background-color: transparent;
    border-bottom: none;
    line-height: 64px;
  }

  :deep(.ant-menu-item) {
    color: var(--text-primary);
    border-bottom: 2px solid transparent;

    &:hover {
      color: var(--accent-primary);
      background-color: var(--bg-tertiary);
    }

    &.ant-menu-item-selected {
      color: var(--accent-primary);
      border-bottom-color: var(--accent-primary);
      background-color: var(--bg-tertiary);
    }

    .anticon {
      margin-right: 8px;
    }
  }

  .theme-toggle-wrapper {
    margin-left: 16px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .navigation {
    padding: 0 16px;

    :deep(.ant-menu) {
      font-size: 14px;
    }

    .theme-toggle-wrapper {
      margin-left: 12px;
    }
  }
}
</style>