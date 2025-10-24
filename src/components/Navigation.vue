<template>
  <nav class="navigation">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-link"
      :class="{ 'has-dropdown': item.children }"
      @mouseenter="showDropdown(item.path)"
      @mouseleave="hideDropdown"
    >
      {{ item.name }}
      <span v-if="item.children" class="dropdown-arrow">▼</span>
    </router-link>

    <!-- 下拉菜单 -->
    <div
      v-for="item in navItems"
      :key="`dropdown-${item.path}`"
      v-show="activeDropdown === item.path && item.children"
      class="dropdown-menu"
      @mouseenter="keepDropdown(item.path)"
      @mouseleave="hideDropdown"
    >
      <router-link
        v-for="child in item.children"
        :key="child.path"
        :to="child.path"
        class="dropdown-item"
      >
        <span v-if="child.icon" class="item-icon">{{ child.icon }}</span>
        {{ child.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  path: string
  name: string
  children?: Array<{
    path: string
    name: string
    icon?: string
  }>
}

const navItems: NavItem[] = [
  {
    path: '/',
    name: '首页',
  },
  {
    path: '/notes',
    name: '技术笔记',
    children: [
      {
        path: '/notes/mapbox',
        name: 'Mapbox',
        icon: '📍'
      },
      {
        path: '/notes/openlayers',
        name: 'OpenLayers',
        icon: '🗺️'
      },
      {
        path: '/notes/leaflet',
        name: 'Leaflet',
        icon: '🍃'
      },
      {
        path: '/notes/webgl',
        name: 'WebGL',
        icon: '🎮'
      },
      {
        path: '/notes/gis-theory',
        name: 'GIS理论',
        icon: '📚'
      }
    ]
  },
  {
    path: '/demos',
    name: '在线示例',
    children: [
      {
        path: '/demos/mapbox',
        name: 'Mapbox示例',
        icon: '📍'
      },
      {
        path: '/demos/openlayers',
        name: 'OpenLayers示例',
        icon: '🗺️'
      },
      {
        path: '/demos/leaflet',
        name: 'Leaflet示例',
        icon: '🍃'
      }
    ]
  },
  {
    path: '/projects',
    name: '项目展示',
  },
  {
    path: '/mapbox',
    name: 'Mapbox',
  },
  {
    path: '/about',
    name: '关于',
  }
]

const activeDropdown = ref<string | null>(null)
let dropdownTimeout: NodeJS.Timeout | null = null

const showDropdown = (path: string) => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
  activeDropdown.value = path
}

const hideDropdown = () => {
  dropdownTimeout = setTimeout(() => {
    activeDropdown.value = null
  }, 200)
}

const keepDropdown = (path: string) => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
  activeDropdown.value = path
}
</script>

<style scoped lang="scss">
.navigation {
  display: flex;
  gap: 2rem;
  position: relative;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: rgba(42, 222, 130, 0.1);
    color: #0ae448;
  }

  &.router-link-active {
    background-color: rgba(42, 222, 130, 0.2);
    color: #0ae448;
  }

  &.has-dropdown {
    position: relative;
  }

  .dropdown-arrow {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  &:hover .dropdown-arrow {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  border: 1px solid #e1e5e9;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #5f6368;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }

  &.router-link-active {
    background: #e8f0fe;
    color: #4264FB;
    font-weight: 500;
  }

  .item-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.75rem 1rem;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    margin-top: 0;
    margin-left: 1rem;
  }

  .dropdown-item {
    padding: 0.5rem 0.75rem;
  }
}
</style>

