<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next'

// SEO
useSeo({
  title: '关于',
  description: '关于王森，前端开发工程师',
  keywords: [
    '王森',
    '前端开发',
  ],
  type: 'website',
})

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
      </div>

      <div class="header-text">
        <span class="page-label">About</span>
        <h1 class="page-title">关于我</h1>
      </div>
    </header>

    <!-- 简介区域 -->
    <section class="intro-section">
      <p class="intro-text">
        <span class="highlight">王森</span>，前端开发工程师。
      </p>
    </section>

    <!-- 联系方式 -->
    <section class="contact-section">
      <div class="contact-links">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="contact-link"
        >
          <Github v-if="link.icon === 'github'" :size="20" class="link-icon" />
          <span class="link-text">{{ link.name }}</span>
          <ExternalLink :size="16" class="link-arrow" />
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

/* ============================================
   页面头部
   ============================================ */
.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-xl);
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
  margin-bottom: var(--space-2xl);
}

.intro-text {
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: var(--text-secondary);
  line-height: 1.8;

  .highlight {
    color: var(--accent-primary);
    font-weight: 500;
  }
}

/* ============================================
   联系方式
   ============================================ */
.contact-section {
  text-align: center;
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

  .contact-link {
    padding: var(--space-md) var(--space-lg);
  }
}
</style>
