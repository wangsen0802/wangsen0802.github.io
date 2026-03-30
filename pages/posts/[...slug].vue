<script setup lang="ts">
import { ArrowLeft, Eye } from 'lucide-vue-next'

const route = useRoute()
const path = route.params.slug as string[]

// 构建文章路径
const postPath = `/${path.join('/')}`

// 获取文章内容
const { data: post, error } = await useAsyncData(`post-${postPath}`, () =>
  queryCollection('content')
    .where('path', '=', postPath)
    .first()
)

// 404 处理
if (error.value || !post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章不存在',
  })
}

// SEO
useArticleSeo({
  title: post.value?.title || '',
  description: post.value?.description || '',
  date: post.value?.date,
  updated: post.value?.updated,
  author: post.value?.author || '王森',
  tags: post.value?.tags || [],
  cover: post.value?.cover,
  category: post.value?.category,
})

// 文章浏览量
const { data: pageStats } = await useFetch<{ viewCount: number; uniqueVisitors: number }>(
  '/api/stats/page',
  {
    params: { path: postPath },
    server: false,
    key: `page-stats-${postPath}`,
  },
)

// 目录导航数据
const tocLinks = computed(() => {
  const toc = (post.value as any)?.body?.toc
  return toc?.links || []
})
const hasToc = computed(() => tocLinks.value.length > 0)

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 阅读进度
const readingProgress = ref(0)
const articleRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const handleScroll = () => {
    if (!articleRef.value) return
    const rect = articleRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const contentHeight = articleRef.value.scrollHeight
    const scrolled = -rect.top
    const total = contentHeight - windowHeight
    readingProgress.value = Math.min(100, Math.max(0, (scrolled / total) * 100))
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// 页面加载动画
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <article ref="articleRef" class="post-detail" :class="{ loaded: isLoaded }">
    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="{ width: `${readingProgress}%` }" />

    <!-- 返回导航 -->
    <nav class="back-nav">
      <NuxtLink to="/posts" class="nav-link">
        <ArrowLeft :size="16" />
        <span>返回文章列表</span>
      </NuxtLink>
    </nav>

    <!-- 文章头部 -->
    <header class="post-header">
      <div class="header-inner">
        <div class="post-meta">
          <span class="post-category">{{ post?.category }}</span>
          <span class="meta-dot">·</span>
          <time class="post-date">{{ formatDate(post?.date || '') }}</time>
        </div>

        <h1 class="post-title">{{ post?.title }}</h1>

        <p class="post-description">{{ post?.description }}</p>

        <div class="post-tags" v-if="post?.tags?.length">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>

        <div class="post-views" v-if="pageStats?.viewCount">
          <Eye :size="14" />
          <span>{{ pageStats.viewCount }} 次浏览</span>
        </div>
      </div>
    </header>

    <!-- 分隔线 -->
    <div class="section-divider">
      <svg viewBox="0 0 400 20" class="divider-svg">
        <line x1="150" y1="10" x2="250" y2="10" stroke="var(--border-primary)" stroke-width="0.5" />
      </svg>
    </div>

    <!-- 文章内容 + 目录 -->
    <div class="post-body">
      <!-- 文章内容 -->
      <div class="post-content prose markdown-content">
        <ContentRenderer :value="post" v-if="post" />
      </div>

      <!-- 右侧目录导航 -->
      <aside class="post-toc" v-if="hasToc">
        <TableOfContents :links="tocLinks" />
      </aside>
    </div>

    <!-- 文章底部 -->
    <footer class="post-footer">
      <!-- 作者信息 -->
      <div class="footer-content">
        <div class="author-info">
          <div class="author-avatar">
            <SvgLogo :animated="false" :size="28" />
          </div>
          <div class="author-text">
            <span class="author-name">{{ post?.author || '王森' }}</span>
            <span class="author-role">作者</span>
          </div>
        </div>

        <div class="post-meta-footer" v-if="post?.updated">
          <span>更新于 {{ formatDate(post.updated) }}</span>
        </div>
      </div>

      <!-- 底部分隔线 -->
      <SvgDivider variant="zen" />

      <!-- 返回导航 -->
      <div class="footer-nav">
        <NuxtLink to="/posts" class="nav-link">
          <ArrowLeft :size="16" />
          <span>查看更多文章</span>
        </NuxtLink>
      </div>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.post-detail {
  max-width: var(--container-xl);
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
   阅读进度条
   ============================================ */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  z-index: 1000;
  transition: width 0.1s ease;
  box-shadow: 0 0 8px var(--accent-subtle);
}

/* ============================================
   返回导航
   ============================================ */
.back-nav {
  margin-bottom: var(--space-xl);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: all var(--duration-fast) ease;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);

    svg {
      transform: translateX(-4px);
    }
  }

  svg {
    transition: transform var(--duration-fast) ease;
  }
}

/* ============================================
   文章头部
   ============================================ */
.post-header {
  margin-bottom: var(--space-xl);
}

.header-inner {
  max-width: 640px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  margin-bottom: var(--space-lg);
}

.post-category {
  color: var(--accent-primary);
  font-weight: 500;
}

.meta-dot {
  color: var(--text-muted);
}

.post-date {
  color: var(--text-tertiary);
}

.post-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: var(--space-lg);
}

.post-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);

  .tag {
    font-size: 0.8125rem;
    padding: var(--space-xs) var(--space-md);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
  }
}

.post-views {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-md);
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

/* ============================================
   分隔线
   ============================================ */
.section-divider {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2xl);

  .divider-svg {
    width: 200px;
    height: 20px;
  }
}

/* ============================================
   文章内容 + 目录布局
   ============================================ */
.post-body {
  display: grid;
  grid-template-columns: 1fr minmax(0, var(--container-md)) 180px 1fr;
  column-gap: var(--space-2xl);
}

.post-content {
  grid-column: 2;
  padding: 0 0 var(--space-3xl);
  min-height: 400px;
}

.post-toc {
  grid-column: 3;
  padding-top: var(--space-lg);
  position: sticky;
  top: 100px;
  align-self: start;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

/* ============================================
   文章底部
   ============================================ */
.post-footer {
  margin-top: var(--space-2xl);
  border-top: 1px solid var(--border-primary);
  padding-top: var(--space-2xl);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-text {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: var(--text-primary);
}

.author-role {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.post-meta-footer {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.footer-nav {
  display: flex;
  justify-content: center;

  .nav-link {
    padding: var(--space-md) var(--space-xl);
    background: var(--bg-secondary);
    font-weight: 500;
    color: var(--text-primary);

    &:hover {
      background: var(--bg-tertiary);
    }
  }
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 1280px) {
  .post-body {
    grid-template-columns: 1fr minmax(0, var(--container-md)) 1fr;
  }

  .post-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .post-body {
    grid-template-columns: 1fr;
  }

  .post-detail {
    padding: var(--space-lg);
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-description {
    font-size: 1rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .footer-nav .nav-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
