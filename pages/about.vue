<script setup lang="ts">
useHead({
  title: '关于我 - wanGISen',
  meta: [
    { name: 'description', content: '了解更多关于王森的信息' },
  ],
})
</script>

<template>
  <div class="about-page">
    <h1 class="page-title">关于我</h1>

    <div class="about-content">
      <section class="about-section">
        <h2>👋 你好！</h2>
        <p>
          我是王森，一名前端开发工程师，同时对地理信息系统（GIS）充满热情。
        </p>
        <p>
          我热衷于使用现代 Web 技术解决实际问题，特别是 Vue.js 生态系统和地图可视化相关的开发工作。
        </p>
      </section>

      <section class="about-section">
        <h2>🛠️ 技术栈</h2>
        <ul class="tech-list">
          <li><strong>前端框架：</strong>Vue 3、Nuxt 3、React</li>
          <li><strong>编程语言：</strong>TypeScript、JavaScript</li>
          <li><strong>GIS 技术：</strong>Mapbox GL JS、Leaflet、Turf.js</li>
          <li><strong>3D 可视化：</strong>Three.js、Cesium</li>
          <li><strong>状态管理：</strong>Pinia、Vuex</li>
          <li><strong>构建工具：</strong>Vite、Webpack</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>📝 博客内容</h2>
        <p>
          这个博客主要分享我在前端开发和 GIS 领域的学习心得和技术实践，包括：
        </p>
        <ul>
          <li>Vue.js 和 Nuxt.js 的最佳实践</li>
          <li>TypeScript 类型技巧</li>
          <li>地图可视化开发经验</li>
          <li>3D 可视化技术应用</li>
          <li>前端工程化和性能优化</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>📬 联系方式</h2>
        <div class="contact-links">
          <a href="https://github.com/wangsen0802" target="_blank" rel="noopener">
            GitHub
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  max-width: 800px;
  margin: 0 auto;

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 2rem;
  }

  .about-content {
    .about-section {
      margin-bottom: 2.5rem;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: 12px;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 1rem;
      }

      p {
        color: var(--text-primary);
        line-height: 1.8;
        margin-bottom: 1rem;
      }

      ul {
        padding-left: 1.5rem;
        color: var(--text-primary);

        li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
      }

      .tech-list {
        list-style: none;
        padding-left: 0;

        li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-secondary);

          &:last-child {
            border-bottom: none;
          }
        }
      }

      .contact-links {
        display: flex;
        gap: 1rem;

        a {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background-color: var(--accent-primary);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            background-color: var(--accent-secondary);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about-page {
    .page-title {
      font-size: 2rem;
    }

    .about-content {
      .about-section {
        padding: 1rem;
      }
    }
  }
}
</style>
