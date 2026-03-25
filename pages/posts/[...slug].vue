<script setup lang="ts">
const route = useRoute()
const path = route.params.slug as string[]

// 构建文章路径
const postPath = `/posts/${path.join('/')}`

// 获取文章内容
const { data: post, error } = await useAsyncData(`post-${postPath}`, () =>
  queryCollection('content')
    .where('_path', '=', postPath)
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
useHead({
  title: `${post.value?.title} - wanGISen`,
  meta: [
    { name: 'description', content: post.value?.description },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: post.value?.description },
  ],
})
</script>

<template>
  <article class="post-detail">
    <!-- 文章头部 -->
    <header class="post-header">
      <div class="post-meta">
        <span class="post-category">{{ post?.category }}</span>
        <span class="post-date">{{ post?.date }}</span>
      </div>
      <h1 class="post-title">{{ post?.title }}</h1>
      <p class="post-description">{{ post?.description }}</p>
      <div class="post-tags" v-if="post?.tags?.length">
        <span v-for="tag in post.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- 文章内容 -->
    <div class="post-content markdown-content">
      <ContentRenderer :value="post" v-if="post" />
    </div>

    <!-- 文章底部 -->
    <footer class="post-footer">
      <div class="author-info">
        <span class="author">作者：{{ post?.author || '王森' }}</span>
        <span class="updated" v-if="post?.updated">
          更新于：{{ post.updated }}
        </span>
      </div>
      <NuxtLink to="/posts" class="back-link">← 返回文章列表</NuxtLink>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.post-detail {
  max-width: 800px;
  margin: 0 auto;

  .post-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-primary);

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
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
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
      margin-bottom: 1rem;
    }

    .post-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .tag {
        font-size: 0.875rem;
        padding: 0.25rem 0.75rem;
        background-color: var(--bg-tertiary);
        color: var(--text-secondary);
        border-radius: 16px;
      }
    }
  }

  .post-content {
    padding: 1rem 0;
    min-height: 300px;
  }

  .post-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .back-link {
      color: var(--accent-primary);
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        color: var(--accent-secondary);
      }
    }
  }
}

@media (max-width: 768px) {
  .post-detail {
    .post-header {
      .post-title {
        font-size: 1.75rem;
      }

      .post-description {
        font-size: 1rem;
      }
    }

    .post-footer {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
}
</style>
