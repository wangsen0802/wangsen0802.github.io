<template>

  <div class="post-detail">
     <a-layout class="layout"
      > <a-layout-header class="header"
        >
        <div class="header-content">

          <div class="header-left">
             <a-button
              type="text"
              @click="goBack"
              class="back-btn"
              > <ArrowLeftOutlined /> 返回 </a-button
            >
            <div class="breadcrumb">
               <a-breadcrumb
                > <a-breadcrumb-item> <router-link to="/">首页</router-link> </a-breadcrumb-item> <a-breadcrumb-item
                  > <router-link to="/posts">文章列表</router-link> </a-breadcrumb-item
                > <a-breadcrumb-item> {{ getCategoryName(post?.category || '') }} </a-breadcrumb-item>
                <a-breadcrumb-item>{{ post?.title }}</a-breadcrumb-item
                > </a-breadcrumb
              >
            </div>

          </div>

          <div class="header-actions"> <ThemeToggle /> </div>

        </div>
         </a-layout-header
      > <a-layout-content class="content"
        >
        <div
          class="content-wrapper"
          v-if="post"
        >
           <a-spin :spinning="loading"
            >
            <div class="post-header">

              <h1 class="post-title">{{ post.title }}</h1>

              <div class="post-meta">

                <div class="meta-left">
                   <a-tag
                    color="blue"
                    class="category-tag"
                    > {{ getCategoryName(post.category) }} </a-tag
                  > <span class="post-date"> <CalendarOutlined /> {{ formatDate(post.date) }} </span> <span
                    class="post-author"
                    > <UserOutlined /> {{ post.author }} </span
                  >
                </div>

                <div class="meta-right">
                   <a-button
                    type="primary"
                    :icon="h(EditOutlined)"
                    @click="editPost"
                    v-if="false"
                    > 编辑 </a-button
                  >
                </div>

              </div>

              <div
                class="post-tags"
                v-if="post.tags.length"
              >
                 <span class="tags-label">标签：</span> <a-tag
                  v-for="tag in post.tags"
                  :key="tag"
                  color="green"
                  class="tag"
                  > {{ tag }} </a-tag
                >
              </div>

            </div>
             <a-card class="post-content-card"> <MarkdownRenderer :content="post.content || ''" /> </a-card> <!-- 相关文章推荐 -->

            <div
              class="related-posts"
              v-if="relatedPosts.length"
            >

              <h3> <LinkOutlined /> 相关文章 </h3>

              <div class="related-posts-grid">
                 <a-card
                  v-for="relatedPost in relatedPosts"
                  :key="`${relatedPost.category}-${relatedPost.id}`"
                  :title="relatedPost.title"
                  size="small"
                  hoverable
                  @click="navigateToPost(relatedPost)"
                  class="related-post-card"
                  > <template #cover
                    >
                    <div class="related-post-cover"> <FileTextOutlined /> </div>
                     </template
                  > <a-card-meta
                    > <template #description
                      >
                      <div class="related-post-description"> {{ relatedPost.description }} </div>

                      <div class="related-post-meta">
                         <a-tag
                          size="small"
                          color="blue"
                          > {{ getCategoryName(relatedPost.category) }} </a-tag
                        > <span class="related-post-date"> {{ formatDate(relatedPost.date) }} </span>
                      </div>
                       </template
                    > </a-card-meta
                  > </a-card
                >
              </div>

            </div>
             </a-spin
          >
        </div>
         <!-- 文章不存在 -->
        <div
          class="post-not-found"
          v-else-if="!loading"
        >

          <div class="not-found-content">

            <div class="not-found-icon"> <FileTextOutlined /> </div>

            <h1>文章不存在</h1>

            <p>抱歉，您访问的文章不存在或已被删除</p>

            <div class="not-found-actions">
               <a-button
                type="primary"
                size="large"
                @click="goBack"
                > <ArrowLeftOutlined /> 返回上一页 </a-button
              > <a-button
                size="large"
                @click="$router.push('/posts')"
                > <BookOutlined /> 查看所有文章 </a-button
              >
            </div>

            <div class="not-found-suggestions">

              <h3>可能的原因：</h3>

              <ul>

                <li>文章链接已过期</li>

                <li>文章已被作者删除</li>

                <li>输入的网址有误</li>

              </ul>

            </div>

          </div>

        </div>
         </a-layout-content
      > </a-layout
    >
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  LinkOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { getPost, getAllPosts, type PostMeta } from '@/utils/posts'

const route = useRoute()
const router = useRouter()

// 响应式数据
const post = ref<PostMeta | null>(null)
const loading = ref(true)
const allPosts = ref<PostMeta[]>([])

// 计算属性
const relatedPosts = computed(() => {
  if (!post.value) return []

  return allPosts.value
    .filter(
      p =>
        p.id !== post.value!.id &&
        (p.category === post.value!.category || p.tags.some(tag => post.value!.tags.includes(tag)))
    )
    .slice(0, 6) // 最多显示6篇相关文章
})

// 方法
const loadPost = async () => {
  try {
    loading.value = true
    const category = route.params.category as string
    const id = route.params.id as string

    const [postData, allPostsData] = await Promise.all([getPost(category, id), getAllPosts()])

    post.value = postData
    allPosts.value = allPostsData

    if (!postData) {
      message.warning('文章不存在')
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    message.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/posts')
  }
}

const navigateToPost = (targetPost: PostMeta) => {
  router.push(`/posts/${targetPost.category}/${targetPost.id}`)
}

const editPost = () => {
  // 编辑功能待实现
  message.info('编辑功能开发中...')
}

const getCategoryName = (category: string) => {
  const categoryNames: Record<string, string> = {
    vue: 'Vue.js',
    gis: 'GIS',
    frontend: '前端开发'
  }
  return categoryNames[category] || category
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 生命周期
onMounted(() => {
  loadPost()
})

// 监听路由变化
const unwatch = router.afterEach(() => {
  loadPost()
})

// 组件卸载时清理监听器
onUnmounted(() => {
  unwatch()
})
</script>

<style scoped lang="scss">
.post-detail {
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
      gap: 16px;

      .back-btn {
        color: var(--text-primary);
        padding: 4px 8px;
        height: auto;

        &:hover {
          background-color: var(--bg-tertiary);
        }
      }

      .breadcrumb {
        :deep(.ant-breadcrumb) {
          .ant-breadcrumb-link {
            color: var(--text-secondary);

            &:hover {
              color: var(--accent-primary);
            }
          }

          .ant-breadcrumb-separator {
            color: var(--text-tertiary);
          }
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
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 32px;
  padding: 32px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-primary);

  .post-title {
    margin: 0 0 24px 0;
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .meta-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .category-tag {
        border-radius: 16px;
        font-size: 12px;
      }

      .post-date,
      .post-author {
        color: var(--text-secondary);
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;

        .anticon {
          color: var(--accent-primary);
        }
      }
    }
  }

  .post-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .tags-label {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
    }

    .tag {
      border-radius: 16px;
      font-size: 12px;
    }
  }
}

.post-content-card {
  margin-bottom: 48px;
  border-radius: 12px;
  box-shadow: var(--shadow-light);

  :deep(.ant-card-body) {
    padding: 32px;
  }
}

.related-posts {
  h3 {
    margin-bottom: 24px;
    color: var(--text-primary);
    font-size: 24px;
    font-weight: 600;

    .anticon {
      margin-right: 8px;
      color: var(--accent-primary);
    }
  }

  .related-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .related-post-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
      border-color: var(--accent-primary);
    }

    .related-post-cover {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      font-size: 20px;
    }

    .related-post-description {
      color: var(--text-secondary);
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      font-size: 14px;
    }

    .related-post-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;

      .related-post-date {
        color: var(--text-tertiary);
      }
    }
  }
}

.post-not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 24px;
}

.not-found-content {
  text-align: center;
  max-width: 500px;

  .not-found-icon {
    font-size: 80px;
    color: var(--text-tertiary);
    margin-bottom: 24px;
    opacity: 0.6;
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .not-found-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 48px;
    flex-wrap: wrap;
  }

  .not-found-suggestions {
    text-align: left;
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-primary);

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: var(--text-secondary);

      li {
        margin-bottom: 8px;
        line-height: 1.5;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }

  .post-not-found {
    padding: 20px 16px;
    min-height: 50vh;
  }

  .not-found-content {
    .not-found-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 24px;
    }

    .not-found-actions {
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .not-found-suggestions {
      padding: 20px;
    }
  }

  .post-header {
    padding: 24px;

    .post-title {
      font-size: 24px;
    }

    .post-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .meta-left {
        flex-wrap: wrap;
        gap: 12px;
      }
    }
  }

  .post-content-card {
    :deep(.ant-card-body) {
      padding: 24px 16px;
    }
  }

  .related-posts-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    .header-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .breadcrumb {
        width: 100%;
        overflow-x: auto;
      }
    }
  }
}
</style>

