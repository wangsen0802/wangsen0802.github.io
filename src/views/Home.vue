<template>
  <div class="home">
    <ThreeBackground />
    <div class="hero">
      <div class="hero-content">
        <h1 class="title">你好，我是王森</h1>
        <p class="subtitle">专注于前端开发和GIS技术的个人博客</p>
        <div class="actions">
          <a-button type="primary" size="large" @click="goToPosts">浏览文章</a-button>
          <a-button size="large" @click="goToAbout">了解我</a-button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="features">
        <h2>技术栈</h2>
        <div class="feature-grid">
          <div class="feature">
            <h3>Vue.js</h3>
            <p>Vue 3 生态开发，Composition API，组件设计</p>
          </div>
          <div class="feature">
            <h3>GIS开发</h3>
            <p>OpenLayers, Mapbox，地理信息系统开发</p>
          </div>
          <div class="feature">
            <h3>前端技术</h3>
            <p>现代CSS，JavaScript，TypeScript，构建工具</p>
          </div>
        </div>
      </div>

      <div class="recent-posts">
        <h2>最新文章</h2>
        <div class="posts-grid">
          <div v-for="post in recentPosts" :key="post.id" class="post-card" @click="goToPost(post)">
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <div class="post-meta">
              <span class="category">{{ post.category }}</span>
              <span class="date">{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getAllPosts, type PostMeta } from '@/utils/posts'
import ThreeBackground from '@/components/ThreeBackground.vue'

const router = useRouter()
const recentPosts = ref<PostMeta[]>([])
const loading = ref(true)

const loadData = async () => {
  try {
    loading.value = true
    const posts = await getAllPosts()
    recentPosts.value = posts.slice(0, 6)
  } catch (error) {
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

const goToPosts = () => {
  router.push('/posts')
}

const goToAbout = () => {
  router.push('/about')
}

const goToPost = (post: PostMeta) => {
  router.push(`/posts/${post.category}/${post.id}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.home {
  background-color: transparent;
  min-height: 100vh;
  position: relative;
}

.hero {
  background: linear-gradient(135deg,
    rgba(74, 158, 255, 0.9),
    rgba(147, 51, 234, 0.9)
  );
  backdrop-filter: blur(10px);
  color: white;
  padding: 80px 24px;
  text-align: center;
  position: relative;
  z-index: 1;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 20px;
    margin-bottom: 32px;
    opacity: 0.9;
  }

  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
  background-color: var(--bg-primary);
  position: relative;
  z-index: 1;
}

.features,
.recent-posts {
  margin-bottom: 80px;
}

h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 48px;
  color: var(--text-primary);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

.feature {
  text-align: center;
  padding: 32px;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-heavy);
  }

  h3 {
    margin-bottom: 16px;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.post-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
    border-color: var(--accent-primary);
  }

  h3 {
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    .category {
      background: var(--accent-primary);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .date {
      color: var(--text-tertiary);
    }
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 16px;

    .title {
      font-size: 36px;
    }

    .actions {
      flex-direction: column;
      gap: 12px;
    }
  }

  .content {
    padding: 40px 16px;
  }

  .feature-grid,
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>