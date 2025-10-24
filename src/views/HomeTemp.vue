<template>
  <div class="home-temp">
    <div class="hero">
      <h1>你好，我是王森</h1>
      <p>专注于前端开发和GIS技术的个人博客</p>
      <a-button type="primary" @click="goToPosts">浏览文章</a-button>
    </div>
    <div class="content">
      <h2>技术栈</h2>
      <div class="features">
        <div class="feature">
          <h3>Vue.js</h3>
        </div>
        <div class="feature">
          <h3>GIS开发</h3>
        </div>
        <div class="feature">
          <h3>前端技术</h3>
        </div>
      </div>
      <h2>最新文章</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPosts = () => {
  router.push('/posts')
}
</script>

<style scoped lang="scss">
.home-temp {
  background-color: var(--bg-primary);
  min-height: 100vh;
  padding: 20px;
}

.hero {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 40px;
}

.feature {
  text-align: center;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  flex: 1;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}
</style>