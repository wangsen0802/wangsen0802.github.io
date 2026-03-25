<script setup lang="ts">
// SEO
useHead({
  title: '文章列表 - wanGISen',
  meta: [
    { name: 'description', content: '浏览所有技术文章' },
  ],
})

// 获取所有文章
const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('content')
    .order('date', 'DESC')
)

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
</script>

<template>
  <div class="posts-page">
    <h1 class="page-title">文章列表</h1>

    <!-- 分类筛选 -->
    <div class="categories">
      <a-button
        :type="selectedCategory === null ? 'primary' : 'default'"
        @click="selectCategory(null)"
      >
        全部 ({{ posts?.length || 0 }})
      </a-button>
      <a-button
        v-for="category in categories"
        :key="category.slug"
        :type="selectedCategory === category.name ? 'primary' : 'default'"
        @click="selectCategory(category.name)"
      >
        {{ category.name }} ({{ category.count }})
      </a-button>
    </div>

    <!-- 文章列表 -->
    <div class="posts-grid">
      <article v-for="post in filteredPosts" :key="post._path" class="post-card">
        <NuxtLink :to="post._path">
          <div class="post-cover" v-if="post.cover">
            <img :src="post.cover" :alt="post.title" />
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-category">{{ post.category }}</span>
              <span class="post-date">{{ post.date }}</span>
            </div>
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-description">{{ post.description }}</p>
            <div class="post-tags" v-if="post.tags?.length">
              <span v-for="tag in post.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-if="!filteredPosts?.length" class="empty-state">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.posts-page {
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .post-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .post-cover {
      height: 180px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    &:hover .post-cover img {
      transform: scale(1.05);
    }

    .post-content {
      padding: 1.25rem;

      .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;

        .post-category {
          color: var(--accent-primary);
          font-weight: 500;
        }

        .post-date {
          color: var(--text-tertiary);
        }
      }

      .post-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }

      .post-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 0.75rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          border-radius: 4px;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 0;
    color: var(--text-tertiary);
  }
}

@media (max-width: 768px) {
  .posts-page {
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
