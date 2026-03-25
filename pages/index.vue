<script setup lang="ts">
// SEO
useHead({
  title: 'wanGISen - 技术博客',
  meta: [
    { name: 'description', content: '个人技术博客，专注于前端开发和 GIS 技术' },
  ],
})

// 技术栈数据
const techStack = [
  { name: 'Vue 3', category: '前端框架', icon: '💚' },
  { name: 'TypeScript', category: '编程语言', icon: '📘' },
  { name: 'Nuxt 3', category: '全栈框架', icon: '💚' },
  { name: 'Mapbox GL', category: 'GIS', icon: '🗺️' },
  { name: 'Three.js', category: '3D', icon: '🎮' },
  { name: 'Pinia', category: '状态管理', icon: '🍍' },
]

// 打字机效果
const roles = [
  '前端开发工程师',
  'GIS 技术爱好者',
  'Vue.js 开发者',
  '全栈学习者',
]

const { displayText, isTyping, start } = useTypewriter({
  text: roles,
  speed: 80,
  initialDelay: 500,
  loopDelay: 2000,
  loop: true,
})

// 页面加载后开始打字
onMounted(() => {
  start()
})
</script>

<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          你好，我是 <span class="highlight">王森</span>
        </h1>
        <p class="hero-subtitle">
          <span class="typewriter">{{ displayText }}</span>
          <span class="cursor" :class="{ blink: isTyping }">|</span>
        </p>
        <p class="hero-description">
          专注于 Vue.js 生态和地理信息系统开发，分享技术心得与最佳实践
        </p>
        <div class="hero-actions">
          <a-button type="primary" size="large">
            <NuxtLink to="/posts">浏览文章</NuxtLink>
          </a-button>
          <a-button size="large">
            <NuxtLink to="/about">关于我</NuxtLink>
          </a-button>
        </div>
      </div>
    </section>

    <!-- 技术栈展示 -->
    <section class="tech-section">
      <h2 class="section-title">技术栈</h2>
      <div class="tech-grid">
        <div v-for="tech in techStack" :key="tech.name" class="tech-card">
          <span class="tech-icon">{{ tech.icon }}</span>
          <h3 class="tech-name">{{ tech.name }}</h3>
          <p class="tech-category">{{ tech.category }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding-bottom: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;

    .highlight {
      color: var(--accent-primary);
    }
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    min-height: 2.25rem;

    .typewriter {
      display: inline;
    }

    .cursor {
      display: inline;
      font-weight: 100;
      color: var(--accent-primary);

      &.blink {
        animation: blink 1s infinite;
      }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  }

  .hero-description {
    font-size: 1.125rem;
    color: var(--text-tertiary);
    margin-bottom: 2rem;
    line-height: 1.8;
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
}

.tech-section {
  padding: 3rem 0;

  .section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .tech-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--accent-primary);
    }

    .tech-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .tech-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .tech-category {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }

    .hero-description {
      font-size: 1rem;
      padding: 0 1rem;
    }

    .hero-actions {
      flex-direction: column;
      padding: 0 1rem;
    }
  }

  .tech-section {
    .tech-grid {
      grid-template-columns: repeat(2, 1fr);
      padding: 0 1rem;
    }
  }
}
</style>
