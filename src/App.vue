<template>

  <div class="app">

    <header class="header">
      <Navigation />
    </header>

    <main class="main"> <router-view /> </main>

    <footer class="footer">

      <p>&copy; 2024 王森的个人网站. All rights reserved.</p>

    </footer>

  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'

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
  background-image: linear-gradient(114.41deg, #36a856 20.74%, #6b9c54 65.5%),
    url('./assets/images/texture.png');
  background-blend-mode: color-dodge;
}

.header {
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  .navigation {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
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

