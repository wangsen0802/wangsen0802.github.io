<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

// SEO
useSeo({
  title: 'wanGISen - 技术博客',
  description: '个人技术博客，专注于前端开发和 GIS 技术',
  keywords: [
    'Vue.js',
    'Nuxt 3',
    'TypeScript',
    'GIS',
    'Mapbox GL',
    '前端开发',
    '技术博客',
  ],
  type: 'website',
})

// 页面加载动画控制
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 300)
})
</script>

<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-container">
        <!-- 装饰线条 SVG -->
        <div class="hero-decoration">
          <svg viewBox="0 0 200 200" class="deco-svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border-primary)" stroke-width="0.5" class="deco-circle" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--accent-primary)" stroke-width="0.5" opacity="0.3" class="deco-circle-inner" />
            <circle cx="100" cy="100" r="4" fill="var(--accent-primary)" class="deco-dot" />
          </svg>
        </div>

        <!-- 主内容 -->
        <div class="hero-content" :class="{ loaded: isLoaded }">
          <h1 class="hero-title animate-item">
            <span class="name">王森</span>
            <span class="separator">/</span>
            <span class="alias">wanGISen</span>
          </h1>

          <p class="hero-role animate-item">前端开发工程师</p>

          <div class="hero-actions animate-item">
            <NuxtLink to="/posts" class="action-btn primary">
              <span>浏览文章</span>
              <ArrowRight :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
}

/* ============================================
   Hero 区域
   ============================================ */
.hero {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--space-2xl);
}

.hero-container {
  width: 100%;
  max-width: var(--container-lg);
  margin: 0 auto;
  position: relative;
}

.hero-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  opacity: 0.4;
  pointer-events: none;

  .deco-svg {
    width: 100%;
    height: 100%;
  }

  .deco-circle {
    stroke-dasharray: 502;
    stroke-dashoffset: 502;
    animation: drawCircle 3s ease-out forwards;
  }

  .deco-circle-inner {
    stroke-dasharray: 377;
    stroke-dashoffset: 377;
    animation: drawCircle 2s ease-out 0.5s forwards;
  }

  .deco-dot {
    opacity: 0;
    animation: dotAppear 0.5s ease-out 1s forwards;
  }
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes dotAppear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s var(--ease-out-expo);

  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-item {
  opacity: 0;
  transform: translateY(15px);
  animation: itemReveal 0.6s var(--ease-out-expo) forwards;

  @for $i from 1 through 3 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 0.1 + 0.3}s;
    }
  }
}

@keyframes itemReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-md);
  flex-wrap: wrap;

  .name {
    color: var(--text-primary);
  }

  .separator {
    color: var(--accent-primary);
    opacity: 0.5;
    font-weight: 300;
  }

  .alias {
    font-size: 0.6em;
    color: var(--text-tertiary);
    font-weight: 400;
    font-style: italic;
  }
}

.hero-role {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  color: var(--accent-primary);
  margin-bottom: var(--space-2xl);
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all var(--duration-normal) var(--ease-out-quart);
  text-decoration: none;

  svg {
    transition: transform var(--duration-fast) ease;
  }

  &.primary {
    background: var(--accent-primary);
    color: white;
    border: 1px solid var(--accent-primary);

    &:hover {
      background: var(--accent-secondary);
      border-color: var(--accent-secondary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);

      svg {
        transform: translateX(4px);
      }
    }
  }
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-xl);
    min-height: calc(100vh - 72px - 60px);
  }

  .hero-decoration {
    width: 280px;
    height: 280px;
  }

  .hero-title {
    flex-direction: column;
    gap: var(--space-xs);

    .separator {
      display: none;
    }

    .alias {
      font-size: 0.8em;
    }
  }

  .hero-actions {
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
