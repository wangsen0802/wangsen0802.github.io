<script setup lang="ts">
// SEO
useSeo({
  title: 'wanGISen - 技术博客',
  description: '个人技术博客，专注于 Vue.js、Nuxt 3、TypeScript 和 Mapbox GL 等 GIS 技术开发',
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

// 技术栈数据 - 简化展示
const techStack = [
  { name: 'Vue 3', desc: '渐进式框架' },
  { name: 'TypeScript', desc: '类型安全' },
  { name: 'Nuxt 3', desc: '全栈框架' },
  { name: 'Mapbox GL', desc: '地理可视化' },
  { name: 'Three.js', desc: '3D 图形' },
  { name: 'Pinia', desc: '状态管理' },
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
  speed: 100,
  initialDelay: 800,
  loopDelay: 3000,
  loop: true,
})

// 页面加载动画控制
const isLoaded = ref(false)

onMounted(() => {
  start()
  // 延迟显示内容，配合 SVG 背景动画
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
          <p class="hero-greeting animate-item">你好，我是</p>

          <h1 class="hero-title animate-item">
            <span class="name">王森</span>
            <span class="separator">/</span>
            <span class="alias">wanGISen</span>
          </h1>

          <div class="hero-role animate-item">
            <span class="role-text">{{ displayText }}</span>
            <span class="cursor" :class="{ typing: isTyping }">|</span>
          </div>

          <p class="hero-desc animate-item">
            专注于 Vue.js 生态与地理信息系统开发<br>
            在代码与地图之间探索技术的边界
          </p>

          <div class="hero-actions animate-item">
            <NuxtLink to="/posts" class="action-btn primary">
              <span>浏览文章</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <NuxtLink to="/about" class="action-btn secondary">
              <span>了解更多</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="scroll-hint animate-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" opacity="0.5" />
          </svg>
          <span>向下滚动</span>
        </div>
      </div>
    </section>

    <!-- 分隔线 -->
    <SvgDivider variant="zen" />

    <!-- 技术栈展示 -->
    <section class="tech-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-label">Technologies</span>
          <h2 class="section-title">技术栈</h2>
        </div>

        <div class="tech-grid">
          <div
            v-for="(tech, index) in techStack"
            :key="tech.name"
            class="tech-item"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-desc">{{ tech.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 引言区域 -->
    <section class="quote-section">
      <div class="section-container">
        <blockquote class="quote">
          <svg class="quote-mark" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p class="quote-text">
            代码是诗，地图是画。<br>
            在像素与坐标之间，构建数字世界的经纬。
          </p>
        </blockquote>
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

  @for $i from 1 through 6 {
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

.hero-greeting {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
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
  margin-bottom: var(--space-xl);
  min-height: 1.8rem;

  .role-text {
    display: inline;
  }

  .cursor {
    display: inline-block;
    margin-left: 2px;
    color: var(--accent-primary);
    animation: blink 1s step-end infinite;

    &.typing {
      animation: none;
      opacity: 1;
    }
  }
}

@keyframes blink {
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 480px;
  margin: 0 auto var(--space-2xl);
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

  &.secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-primary);

    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
  }
}

.scroll-hint {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-tertiary);
  font-size: 0.75rem;
  animation: float 3s ease-in-out infinite;
  animation-delay: 1.5s;

  svg {
    opacity: 0.5;
  }
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ============================================
   技术栈区域
   ============================================ */
.tech-section {
  padding: var(--space-4xl) var(--space-2xl);
}

.section-container {
  max-width: var(--container-lg);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.section-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-primary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--text-primary);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-lg);
  max-width: var(--container-md);
  margin: 0 auto;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-out-quart);
  opacity: 0;
  transform: translateY(20px);
  animation: techReveal 0.6s var(--ease-out-expo) forwards;

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);

    .tech-name {
      color: var(--accent-primary);
    }
  }

  .tech-name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
    transition: color var(--duration-fast) ease;
  }

  .tech-desc {
    font-size: 0.8125rem;
    color: var(--text-tertiary);
  }
}

@keyframes techReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   引言区域
   ============================================ */
.quote-section {
  padding: var(--space-4xl) var(--space-2xl);
}

.quote {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.quote-mark {
  width: 48px;
  height: 48px;
  color: var(--accent-primary);
  opacity: 0.2;
  margin-bottom: var(--space-lg);
}

.quote-text {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.8;
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
    flex-direction: column;
    width: 100%;

    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .scroll-hint {
    display: none;
  }

  .tech-section {
    padding: var(--space-2xl) var(--space-lg);
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .tech-item {
    padding: var(--space-lg);
  }

  .quote-section {
    padding: var(--space-2xl) var(--space-lg);
  }

  .quote-mark {
    width: 36px;
    height: 36px;
  }
}
</style>
