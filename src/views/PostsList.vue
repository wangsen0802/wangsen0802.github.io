<template>
  <div class="posts-list">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <h1>
            <BookOutlined /> 文章列表
          </h1>
          <div class="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-wrapper">
          <!-- 分类筛选 -->
          <a-card class="categories-card">
            <template #title>
              <AppstoreOutlined /> 分类
            </template>
            <div class="categories">
              <a-button
                v-for="category in categories"
                :key="category.path"
                :type="selectedCategory === category.path ? 'primary' : 'default'"
                @click="filterByCategory(category.path)"
                class="category-btn"
              >
                {{ category.name }}
                <a-badge :count="category.count" class="category-count" />
              </a-button>
              <a-button
                :type="selectedCategory === null ? 'primary' : 'default'"
                @click="filterByCategory(null)"
                class="category-btn"
              >
                全部
                <a-badge :count="posts.length" class="category-count" />
              </a-button>
            </div>
          </a-card>

          <!-- 文章列表 -->
          <div class="posts-container">
            <a-spin :spinning="loading">
              <div class="posts-grid">
                <a-card
                  v-for="post in filteredPosts"
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
                        <a-tag color="blue" class="category-tag">
                          {{ getCategoryName(post.category) }}
                        </a-tag>
                        <span class="post-date">{{ formatDate(post.date) }}</span>
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
              <a-empty
                v-if="!loading && filteredPosts.length === 0"
                description="暂无文章"
                class="empty-state"
              >
                <template #image>
                  <FileTextOutlined style="font-size: 64px; color: #d9d9d9;" />
                </template>
              </a-empty>
            </a-spin>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  EyeOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { getAllPosts, getCategories, type PostMeta, type Category } from '@/utils/posts'

const router = useRouter()

// 响应式数据
const posts = ref<PostMeta[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const selectedCategory = ref<string | null>(null)

// 计算属性
const filteredPosts = computed(() => {
  if (selectedCategory.value) {
    return posts.value.filter(post => post.category === selectedCategory.value)
  }
  return posts.value
})

// 方法
const loadData = async () => {
  try {
    loading.value = true
    const [postsData, categoriesData] = await Promise.all([
      getAllPosts(),
      getCategories()
    ])
    posts.value = postsData
    categories.value = categoriesData
  } catch (error) {
    console.error('加载数据失败:', error)
    message.error('加载文章数据失败')
  } finally {
    loading.value = false
  }
}

const filterByCategory = (category: string | null) => {
  selectedCategory.value = category
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.posts-list {
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

    h1 {
      margin: 0;
      color: var(--text-primary);
      font-size: 24px;
      font-weight: 600;

      .anticon {
        margin-right: 8px;
        color: var(--accent-primary);
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

.categories-card {
  margin-bottom: 24px;

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .category-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 20px;
      padding: 4px 16px;
      height: auto;

      .category-count {
        :deep(.ant-badge-count) {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
        }
      }
    }
  }
}

.posts-container {
  min-height: 400px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
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

    .category-tag {
      border-radius: 12px;
      font-size: 12px;
    }

    .post-date {
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

  .categories {
    .category-btn {
      flex: 1;
      min-width: 0;
      justify-content: center;
    }
  }

  .header-content {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
    gap: 12px;

    h1 {
      font-size: 20px;
    }
  }
}
</style>