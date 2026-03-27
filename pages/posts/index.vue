<script setup lang="ts">
// 获取所有文章
const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('content')
    .order('date', 'DESC')
    .all()
)

// SEO
const postCount = computed(() => posts.value?.length || 0)
useSeo({
  title: '文章',
  description: `浏览全部 ${postCount.value} 篇技术文章，涵盖 Vue.js、Nuxt 3、TypeScript、Mapbox GL、GIS 等前端开发技术领域`,
  keywords: ['技术文章', '前端开发', 'Vue.js', 'Nuxt 3', 'TypeScript', 'GIS', 'Mapbox'],
  type: 'website',
})

// 获取所有分类
const categories = computed(() => {
  if (!posts.value) return []
  const categoryMap = new Map<string, number>()
  posts.value.forEach((post: any) => {
    const category = post.category || 'other'
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: name,
    count,
  }))
})

// 当前选中的分类
const selectedCategory = ref<string | null>(null)

// 过滤后的文章
const filteredPosts = computed(() => {
  if (!posts.value) return []
  if (!selectedCategory.value) return posts.value
  return posts.value.filter((post: any) => post.category === selectedCategory.value)
})

// 选择分类
const selectCategory = (category: string | null) => {
  selectedCategory.value = category
}

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
</script>

<template>
  <div class="posts-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <span class="page-label">Articles</span>
        <h1 class="page-title">文章</h1>
        <p class="page-desc">
          共收录 {{ postCount }} 篇技术文章
        </p>
      </div>
    </header>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <div class="filter-inner">
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === null }"
          @click="selectCategory(null)"
        >
          <span class="btn-text">全部</span>
          <span class="btn-count">{{ posts?.length || 0 }}</span>
        </button>
        <button
          v-for="category in categories"
          :key="category.slug"
          class="filter-btn"
          :class="{ active: selectedCategory === category.name }"
          @click="selectCategory(category.name)"
        >
          <span class="btn-text">{{ category.name }}</span>
          <span class="btn-count">{{ category.count }}</span>
        </button>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="section-divider">
      <svg viewBox="0 0 400 20" class="divider-svg">
        <line x1="100" y1="10" x2="300" y2="10" stroke="var(--border-primary)" stroke-width="0.5" />
      </svg>
    </div>

    <!-- 文章列表 -->
    <div class="posts-container">
      <TransitionGroup name="post-list" tag="div" class="posts-list">
        <article
          v-for="(post, index) in filteredPosts"
          :key="post.path"
          class="post-item"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <NuxtLink :to="`/posts${post.path}`" class="post-link">
            <!-- 文章序号 -->
            <span class="post-index">{{ String(index + 1).padStart(2, '0') }}</span>

            <!-- 文章信息 -->
            <div class="post-main">
              <div class="post-meta">
                <span class="post-category">{{ post.category }}</span>
                <span class="meta-dot">·</span>
                <time class="post-date">{{ formatDate(post.date) }}</time>
              </div>

              <h2 class="post-title">{{ post.title }}</h2>

              <p class="post-description">{{ post.description }}</p>

              <div class="post-tags" v-if="post.tags?.length">
                <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 箭头指示 -->
            <div class="post-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </article>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="!filteredPosts?.length" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="empty-text">暂无文章</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.posts-page {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
}

/* ============================================
   页面头部
   ============================================ */
.page-header {
  text-align: center;
  margin-bottom: var(--space-3xl);
  padding-top: var(--space-xl);
}

.header-content {
  max-width: 480px;
  margin: 0 auto;
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
  margin-bottom: var(--space-md);
}

.page-desc {
  font-size: 1rem;
  color: var(--text-tertiary);
}

/* ============================================
   分类筛选
   ============================================ */
.filter-section {
  margin-bottom: var(--space-xl);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-inner {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  &.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;

    .btn-count {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .btn-count {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    min-width: 1.5rem;
    text-align: center;
  }
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
   文章列表
   ============================================ */
.posts-container {
  min-height: 300px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.post-item {
  background: var(--bg-primary);
  opacity: 0;
  transform: translateY(10px);
  animation: postReveal 0.5s var(--ease-out-expo) forwards;
}

@keyframes postReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-link {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  text-decoration: none;
  color: inherit;
  transition: all var(--duration-fast) ease;

  &:hover {
    background: var(--bg-secondary);

    .post-arrow {
      opacity: 1;
      transform: translateX(0);
      color: var(--accent-primary);
    }

    .post-title {
      color: var(--accent-primary);
    }
  }
}

.post-index {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-shrink: 0;
  width: 2rem;
  padding-top: 0.25rem;
}

.post-main {
  flex: 1;
  min-width: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.8125rem;
  margin-bottom: var(--space-sm);
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
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
  transition: color var(--duration-fast) ease;
}

.post-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);

  .tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
    border-radius: var(--radius-sm);
  }
}

.post-arrow {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-8px);
  transition: all var(--duration-fast) ease;
  color: var(--text-tertiary);
  padding-top: 0.25rem;
}

/* 列表过渡动画 */
.post-list-enter-active,
.post-list-leave-active {
  transition: all var(--duration-normal) var(--ease-out-quart);
}

.post-list-enter-from,
.post-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.post-list-move {
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

/* ============================================
   空状态
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl);
  color: var(--text-tertiary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.empty-text {
  font-size: 0.9375rem;
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 768px) {
  .posts-page {
    padding: var(--space-lg);
  }

  .page-header {
    margin-bottom: var(--space-2xl);
    padding-top: var(--space-md);
  }

  .filter-inner {
    justify-content: flex-start;
    padding-bottom: var(--space-sm);
  }

  .post-link {
    padding: var(--space-lg);
    gap: var(--space-md);
  }

  .post-index {
    display: none;
  }

  .post-arrow {
    display: none;
  }

  .post-title {
    font-size: 1.125rem;
  }
}
</style>
