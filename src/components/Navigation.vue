<template>

  <nav class="navigation">
     <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-link"
      > {{ item.name }} </router-link
    >
  </nav>

</template>

<script setup lang="ts">
interface NavItem {
  path: string
  name: string
}

const navItems: NavItem[] = [
  {
    path: '/',
    name: '首页',
  },
  {
    path: '/mapbox',
    name: 'mapbox',
  },
  {
    path: '/about',
    name: '关于',
  },
]
</script>

<style scoped lang="scss">
.navigation {
  display: flex;
  gap: 2rem;
  
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(42, 222, 130, 0.1);
    color: #0ae448;
  }

  &.router-link-active {
    background-color: rgba(42, 222, 130, 0.2);
    color: #0ae448;
  }
}
</style>

