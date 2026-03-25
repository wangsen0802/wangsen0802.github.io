<template>
  <div class="category-posts">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <div class="header-left">
            <a-button type="text" @click="goBack" class="back-btn">
              <ArrowLeftOutlined /> 返回
            </a-button>
            <div class="category-info">
              <h1>
                <AppstoreOutlined /> {{ getCategoryName(category) }}
              </h1>
              <p class="category-description">{{ getCategoryDescription(category) }}</p>
            </div>
          </div>
          <div class="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-wrapper">
          <a-spin :spinning="loading">
            <div class="posts-grid">
              <a-card
                v-for="post in posts"
                :key="`${post.category}-${post.id}`"
                :title="post.title"
                class="post-card"
                hoverable
                @click="navigateToPost(post)"
              >
                <template #cover>
                  <div class="post-cover">
                    <FileTextOutlined />
                  </div>
                </template>

                <template #actions>
                  <EyeOutlined key="view" title="查看" />
                  <CalendarOutlined key="date" :title="post.date" />
                </template>

                <a-card-meta>
                  <template #description>
                    <div class="post-description">
                      {{ post.description }}
                    </div>
                    <div class="post-meta">
                      <span class="post-date">{{ formatDate(post.date) }}</span>
                      <span class="post-author">{{ post.author }}</span>
                    </div>
                    <div class="post-tags" v-if="post.tags.length">
                      <a-tag
                        v-for="tag in post.tags.slice(0, 3)"
                        :key="tag"
                        color="green"
                        size="small"
                      >
                        {{ tag }}
                      </a-tag>
                      <span v-if="post.tags.length > 3" class="more-tags">
                        +{{ post.tags.length - 3 }}
                      </span>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </div>

            <!-- 空状态 -->
            <div class="empty-state" v-if="!loading && posts.length === 0">
              <div class="empty-content">
                <div class="empty-icon">
                  <FileTextOutlined />
                </div>
                <h2>该分类下暂无文章</h2>
                <p>{{ getCategoryDescription(category) || '这个分类还没有文章，请稍后再来看看' }}</p>
                <a-button type="primary" size="large" @click="$router.push('/posts')">
                  <BookOutlined /> 查看所有文章
                </a-button>
                <div class="empty-suggestions">
                  <h3>推荐分类：</h3>
                  <div class="suggestion-cards">
                    <a-card
                      v-for="cat in getOtherCategories()"
                      :key="cat.path"
                      size="small"
                      hoverable
                      @click="$router.push(`/posts/${cat.path}`)"
                      class="suggestion-card"
                    >
                      <div class="suggestion-info">
                        <h4>{{ cat.name }}</h4>
                        <p>{{ cat.description }}</p>
                        <span class="post-count">{{ cat.count }} 篇文章</span>
                      </div>
                    </a-card>
                  </div>
                </div>
              </div>
            </div>
          </a-spin>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  EyeOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { getPostsByCategory, type PostMeta } from '@/utils/posts'

const route = useRoute()
const router = useRouter()

// 响应式数据
const posts = ref<PostMeta[]>([])
const loading = ref(true)
const category = ref('')
const otherCategories = ref<any[]>([])

// 方法
const loadPosts = async () => {
  try {
    loading.value = true
    category.value = route.params.category as string

    if (!category.value) {
      router.push('/posts')
      return
    }

    posts.value = await getPostsByCategory(category.value)

    // 同时加载其他分类
    await loadOtherCategories(category.value)
  } catch (error) {
    console.error('加载分类文章失败:', error)
    message.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

const loadOtherCategories = async (currentCategory: string) => {
  try {
    const allCategories = await import('@/utils/posts').then(m => m.getCategories())
    otherCategories.value = allCategories.filter(cat => cat.path !== currentCategory)
  } catch (error) {
    console.error('获取其他分类失败:', error)
    otherCategories.value = []
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/posts')
  }
}

const navigateToPost = (post: PostMeta) => {
  router.push(`/posts/${post.category}/${post.id}`)
}

const getCategoryName = (category: string) => {
  const categoryNames: Record<string, string> = {
    'vue': 'Vue.js',
    'gis': 'GIS',
    'frontend': '前端开发'
  }
  return categoryNames[category] || category
}

const getCategoryDescription = (category: string) => {
  const categoryDescriptions: Record<string, string> = {
    'vue': 'Vue.js 相关技术和最佳实践',
    'gis': 'GIS 地理信息系统开发',
    'frontend': '前端开发技术和工具'
  }
  return categoryDescriptions[category] || ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getOtherCategories = () => {
  return otherCategories.value
}

// 监听路由变化
watch(() => route.params.category, () => {
  if (route.name === 'CategoryPosts') {
    loadPosts()
  }
})

// 生命周期
onMounted(() => {
  loadPosts()
})
</script>

<style scoped lang="scss">
.category-posts {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.layout {
  min-height: 100vh;
}

.header {
  background-color: var(--bg-secondary) !important;
  border-bottom: 1px solid var(--border-primary);
  padding: 0 24px;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .back-btn {
        color: var(--text-primary);
        padding: 4px 8px;
        height: auto;

        &:hover {
          background-color: var(--bg-tertiary);
        }
      }

      .category-info {
        h1 {
          margin: 0 0 4px 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 600;

          .anticon {
            margin-right: 8px;
            color: var(--accent-primary);
          }
        }

        .category-description {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }
      }
    }
  }
}

.content {
  padding: 24px;
  background-color: var(--bg-primary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 40px 24px;
}

.empty-content {
  text-align: center;
  max-width: 500px;

  .empty-icon {
    font-size: 80px;
    color: var(--text-tertiary);
    margin-bottom: 24px;
    opacity: 0.6;
  }

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .empty-suggestions {
    margin-top: 48px;
    text-align: left;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .suggestion-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .suggestion-card {
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
        border-color: var(--accent-primary);
      }

      .suggestion-info {
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .post-count {
          display: inline-block;
          background: var(--accent-primary);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
      }
    }
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.post-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--accent-primary);
  }

  .post-cover {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    font-size: 32px;
  }

  .post-description {
    color: var(--text-secondary);
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.6;
  }

  .post-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .post-date,
    .post-author {
      color: var(--text-tertiary);
      font-size: 12px;
    }
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;

    .more-tags {
      color: var(--text-tertiary);
      font-size: 12px;
      margin-left: 4px;
    }
  }
}

.empty-state {
  margin-top: 80px;
}

// 响应式设计
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header-content {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
    gap: 12px;

    .header-left {
      width: 100%;
      justify-content: space-between;

      .category-info {
        h1 {
          font-size: 20px;
        }

        .category-description {
          font-size: 12px;
        }
      }
    }
  }
}
</style>