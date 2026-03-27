<script setup lang="ts">
// SEO
useSeo({
  title: '关于',
  description: '了解王森，一名专注于 Vue.js 和 GIS 技术的前端开发工程师',
  keywords: [
    '王森',
    '前端开发',
    'Vue.js',
    'Nuxt 3',
    'TypeScript',
    'GIS',
    'Mapbox GL',
  ],
  type: 'website',
})

// 技能数据
const skills = [
  { name: 'Vue 3', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Nuxt 3', level: 80 },
  { name: 'Mapbox GL', level: 75 },
  { name: 'Three.js', level: 60 },
  { name: 'React', level: 55 },
]

// 社交链接
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/wangsen0802', icon: 'github' },
]

// 页面加载动画
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="about-page" :class="{ loaded: isLoaded }">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="avatar-wrapper">
        <div class="avatar">
          <SvgLogo :animated="true" :size="80" />
        </div>
        <div class="avatar-decoration">
          <svg viewBox="0 0 200 200" class="deco-ring">
            <circle cx="100" cy="100" r="95" fill="none" stroke="var(--border-primary)" stroke-width="0.5" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="var(--accent-primary)" stroke-width="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>

      <div class="header-text">
        <span class="page-label">About</span>
        <h1 class="page-title">关于我</h1>
      </div>
    </header>

    <!-- 简介区域 -->
    <section class="intro-section animate-section">
      <div class="intro-content">
        <p class="intro-text">
          你好，我是<span class="highlight">王森</span>，一名前端开发工程师。
        </p>
        <p class="intro-text">
          专注于 Vue.js 生态与地理信息系统开发，<br>
          在代码与地图之间探索技术的边界。
        </p>
      </div>
    </section>

    <!-- 分隔线 -->
    <SvgDivider variant="zen" />

    <!-- 技能区域 -->
    <section class="skills-section animate-section">
      <div class="section-header">
        <span class="section-label">Skills</span>
        <h2 class="section-title">技术栈</h2>
      </div>

      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="skill.name"
          class="skill-item"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="skill-info">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level">{{ skill.level }}%</span>
          </div>
          <div class="skill-bar">
            <div
              class="skill-progress"
              :style="{ width: `${skill.level}%`, animationDelay: `${index * 100 + 300}ms` }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 博客介绍 -->
    <section class="blog-section animate-section">
      <div class="section-header">
        <span class="section-label">Blog</span>
        <h2 class="section-title">博客内容</h2>
      </div>

      <div class="blog-topics">
        <div class="topic-item">
          <span class="topic-icon">◈</span>
          <span class="topic-text">Vue.js 和 Nuxt.js 最佳实践</span>
        </div>
        <div class="topic-item">
          <span class="topic-icon">◈</span>
          <span class="topic-text">TypeScript 类型技巧</span>
        </div>
        <div class="topic-item">
          <span class="topic-icon">◈</span>
          <span class="topic-text">地图可视化开发经验</span>
        </div>
        <div class="topic-item">
          <span class="topic-icon">◈</span>
          <span class="topic-text">3D 可视化技术应用</span>
        </div>
        <div class="topic-item">
          <span class="topic-icon">◈</span>
          <span class="topic-text">前端工程化和性能优化</span>
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="contact-section animate-section">
      <div class="section-header">
        <span class="section-label">Contact</span>
        <h2 class="section-title">联系方式</h2>
      </div>

      <div class="contact-links">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="contact-link"
        >
          <svg v-if="link.icon === 'github'" class="link-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span class="link-text">{{ link.name }}</span>
          <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  max-width: var(--container-md);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s var(--ease-out-expo);

  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-section {
  opacity: 0;
  transform: translateY(15px);
  animation: sectionReveal 0.6s var(--ease-out-expo) forwards;

  @for $i from 1 through 4 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 0.1 + 0.3}s;
    }
  }
}

@keyframes sectionReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   页面头部
   ============================================ */
.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-3xl);
  padding-top: var(--space-xl);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: var(--space-xl);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.avatar-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;

  .deco-ring {
    width: 100%;
    height: 100%;
    animation: rotate 30s linear infinite;
  }

  circle:first-child {
    stroke-dasharray: 597;
    stroke-dashoffset: 597;
    animation: drawCircle 3s ease-out forwards;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

.header-text {
  text-align: center;
}

.page-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-primary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: var(--text-primary);
}

/* ============================================
   简介区域
   ============================================ */
.intro-section {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.intro-content {
  max-width: 560px;
  margin: 0 auto;
}

.intro-text {
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-lg);

  .highlight {
    color: var(--accent-primary);
    font-weight: 500;
  }
}

/* ============================================
   技能区域
   ============================================ */
.skills-section {
  margin-bottom: var(--space-3xl);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
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
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--text-primary);
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 480px;
  margin: 0 auto;
}

.skill-item {
  opacity: 0;
  transform: translateX(-10px);
  animation: skillReveal 0.5s var(--ease-out-expo) forwards;
}

@keyframes skillReveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.skill-name {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

.skill-level {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.skill-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--radius-full);
  width: 0;
  animation: progressGrow 1s var(--ease-out-expo) forwards;
}

@keyframes progressGrow {
  from { width: 0; }
}

/* ============================================
   博客介绍
   ============================================ */
.blog-section {
  margin-bottom: var(--space-3xl);
}

.blog-topics {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 480px;
  margin: 0 auto;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;

  &:hover {
    border-color: var(--accent-primary);

    .topic-icon {
      color: var(--accent-primary);
    }
  }
}

.topic-icon {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  transition: color var(--duration-fast) ease;
}

.topic-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

/* ============================================
   联系方式
   ============================================ */
.contact-section {
  margin-bottom: var(--space-3xl);
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-out-quart);

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    .link-arrow {
      transform: translate(2px, -2px);
    }
  }
}

.link-icon {
  width: 20px;
  height: 20px;
  color: var(--text-primary);
}

.link-text {
  font-weight: 500;
  color: var(--text-primary);
}

.link-arrow {
  color: var(--text-tertiary);
  transition: transform var(--duration-fast) ease;
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 768px) {
  .about-page {
    padding: var(--space-lg);
  }

  .page-header {
    padding-top: var(--space-md);
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .avatar-decoration {
    width: 160px;
    height: 160px;
  }

  .contact-link {
    padding: var(--space-md) var(--space-lg);
  }
}
</style>
