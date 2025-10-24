<template>

  <div class="app">

    <header class="header">

      <nav class="nav">
         <router-link to="/" class="nav-link">首页</router-link> <router-link
          to="/about"
          class="nav-link"
          >关于</router-link
        >
      </nav>

    </header>

    <main class="main"> <router-view /> </main>

    <footer class="footer">

      <p>&copy; 2024 王森的个人网站. All rights reserved.</p>

    </footer>

  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('应用已挂载')
  // 可以在这里初始化一些应用状态
})
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #0e100f;
  background-image: linear-gradient(114.41deg, #0ae448 20.74%, #abff84 65.5%),
    url('./assets/images/texture.png');
  background-blend-mode: color-dodge;
}

.header {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.footer {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem 0;
  text-align: center;
  backdrop-filter: blur(10px);

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
}
</style>

