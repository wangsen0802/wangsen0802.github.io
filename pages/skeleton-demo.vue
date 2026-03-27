<script setup lang="ts">
// SEO
useHead({
  title: '骨架屏演示 - wanGISen',
  meta: [
    { name: 'description', content: '骨架屏加载组件演示' },
  ],
})

// 模拟加载状态
const showSkeleton = ref(true)

// 3秒后隐藏骨架屏
onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 3000)
})
</script>

<template>
  <div class="skeleton-demo">
    <div class="demo-header">
      <h1 class="demo-title">骨架屏组件演示</h1>
      <p class="demo-description">
        此页面展示骨架屏加载效果。骨架屏将显示 3 秒钟。
      </p>
      <a-button type="primary" @click="showSkeleton = true">
        重新加载
      </a-button>
    </div>

    <!-- 文章卡片骨架屏演示 -->
    <section class="demo-section">
      <h2 class="section-title">文章卡片骨架屏 (PostCardSkeleton)</h2>
      <div class="posts-grid">
        <!-- 显示骨架屏 -->
        <template v-if="showSkeleton">
          <PostCardSkeleton v-for="i in 6" :key="`card-skeleton-${i}`" />
        </template>

        <!-- 显示实际内容 -->
        <template v-else>
          <article v-for="i in 6" :key="`card-${i}`" class="post-card">
            <NuxtLink to="/posts">
              <div class="post-cover">
                <img
                  src="https://via.placeholder.com/400x200/1890ff/ffffff?text=Cover+Image"
                  alt="封面图"
                />
              </div>
              <div class="post-content">
                <div class="post-meta">
                  <span class="post-category">前端开发</span>
                  <span class="post-date">2026-03-28</span>
                </div>
                <h2 class="post-title">Vue 3 组合式 API 完全指南</h2>
                <p class="post-description">
                  深入了解 Vue 3 Composition API 的使用方法和最佳实践...
                </p>
                <div class="post-tags">
                  <span v-for="tag in ['Vue', 'TypeScript', '前端']" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </template>
      </div>
    </section>

    <!-- 文章详情骨架屏演示 -->
    <section class="demo-section">
      <h2 class="section-title">文章详情骨架屏 (PostDetailSkeleton)</h2>
      <div class="post-detail-wrapper">
        <!-- 显示骨架屏 -->
        <PostDetailSkeleton v-if="showSkeleton" />

        <!-- 显示实际内容 -->
        <article v-else class="post-detail">
          <header class="post-header">
            <div class="post-meta">
              <span class="post-category">GIS 技术</span>
              <span class="post-date">2026-03-28</span>
            </div>
            <h1 class="post-title">Mapbox GL JS 高级可视化技术</h1>
            <p class="post-description">
              探索 Mapbox GL JS 的高级特性，包括自定义图层、数据可视化和性能优化技巧。
              本文将带你深入了解如何构建复杂的地理信息应用。
            </p>
            <div class="post-tags">
              <span v-for="tag in ['Mapbox', 'WebGIS', '可视化', 'JavaScript']" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </header>

          <div class="post-content markdown-content">
            <h2>引言</h2>
            <p>
              Mapbox GL JS 是一个强大的 JavaScript 庽数据，用于在 Web 浏览器中渲染交互式地图。
              它使用 WebGL 来加速渲染，可以轻松处理大量的地理数据。
            </p>

            <h2>核心特性</h2>
            <p>Mapbox GL JS 提供了以下核心特性：</p>
            <ul>
              <li>高性能的 WebGL 渲染</li>
              <li>丰富的地图样式自定义</li>
              <li>强大的数据可视化能力</li>
              <li>完善的移动端支持</li>
            </ul>

            <h2>代码示例</h2>
            <pre><code>// 初始化地图
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [116.397, 39.918],
  zoom: 12
})</code></pre>

            <h2>最佳实践</h2>
            <p>
              在使用 Mapbox GL JS 开发时，需要注意以下最佳实践：
              合理管理地图资源、优化图层性能、处理用户交互等。
            </p>
          </div>

          <footer class="post-footer">
            <div class="author-info">
              <span class="author">作者：王森</span>
              <span class="updated">更新于：2026-03-28</span>
            </div>
            <NuxtLink to="/posts" class="back-link">← 返回文章列表</NuxtLink>
          </footer>
        </article>
      </div>
    </section>

    <!-- 使用说明 -->
    <section class="demo-section">
      <h2 class="section-title">使用说明</h2>
      <div class="usage-info">
        <h3>在项目中使用骨架屏组件：</h3>
        <pre><code>&lt;!-- 文章卡片骨架屏 --&gt;
&lt;PostCardSkeleton v-if="pending" /&gt;

&lt;!-- 文章详情骨架屏 --&gt;
&lt;PostDetailSkeleton v-if="pending" /&gt;

&lt;script setup lang="ts"&gt;
const { data, pending } = await useAsyncData('key', () =&gt; {
  // 数据获取逻辑
})
&lt;/script&gt;</code></pre>

        <p>
          详细使用文档请查看：
          <NuxtLink to="/docs/SKELETON_USAGE.md" target="_blank">
            docs/SKELETON_USAGE.md
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.skeleton-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-primary);

  .demo-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .demo-description {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
}

.demo-section {
  margin-bottom: 3rem;

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--accent-primary);
  }
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
    }
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

.post-detail-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.post-detail {
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

    h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
      color: var(--text-primary);
      line-height: 1.8;
      margin-bottom: 1rem;
    }

    ul {
      padding-left: 2rem;
      margin-bottom: 1rem;

      li {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }
    }

    pre {
      background-color: var(--bg-tertiary);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;

      code {
        font-family: 'Fira Code', monospace;
        font-size: 0.875rem;
        color: var(--text-primary);
      }
    }
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

.usage-info {
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-primary);

  h3 {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  pre {
    background-color: var(--bg-tertiary);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      color: var(--text-primary);
    }
  }

  p {
    color: var(--text-secondary);
    margin-top: 1rem;

    a {
      color: var(--accent-primary);
      text-decoration: none;

      &:hover {
        color: var(--accent-secondary);
      }
    }
  }
}

@media (max-width: 768px) {
  .skeleton-demo {
    padding: 1rem 0;
  }

  .demo-header {
    padding: 1.5rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

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
