<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">🗺️ GIS技术博客</h1>
        <p class="hero-subtitle">
          专注WebGIS开发，分享地图技术、实践案例和学习笔记
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalNotes }}</span>
            <span class="stat-label">技术笔记</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalDemos }}</span>
            <span class="stat-label">在线示例</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalProjects }}</span>
            <span class="stat-label">项目案例</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Content -->
    <section class="featured-content">
      <div class="section-header">
        <h2>🌟 精选内容</h2>
        <router-link to="/notes" class="view-all">查看全部 →</router-link>
      </div>

      <div class="content-grid">
        <div class="featured-notes">
          <h3>📝 最新笔记</h3>
          <div class="notes-grid">
            <NoteCard
              v-for="note in featuredNotes"
              :key="note.id"
              :note="note"
              :category="getCategoryById(note.category)"
            />
          </div>
        </div>

        <div class="featured-demos">
          <h3>🎮 热门示例</h3>
          <div class="demos-grid">
            <DemoCard
              v-for="demo in featuredDemos"
              :key="demo.id"
              :demo="demo"
              :category="getDemoCategoryById(demo.category)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Overview -->
    <section class="categories-overview">
      <div class="section-header">
        <h2>📚 技术分类</h2>
        <router-link to="/notes" class="view-all">探索更多 →</router-link>
      </div>

      <div class="categories-grid">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/notes/${category.id}`"
          class="category-card"
          :style="{ borderLeftColor: category.color }"
        >
          <div class="category-icon" :style="{ color: category.color }">
            {{ category.icon }}
          </div>
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <span class="category-count">
              {{ getCategoryNoteCount(category.id) }} 篇笔记
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Projects Preview -->
    <section class="projects-preview" v-if="featuredProjects.length">
      <div class="section-header">
        <h2>🚀 项目展示</h2>
        <router-link to="/projects" class="view-all">查看全部 →</router-link>
      </div>

      <div class="projects-grid">
        <div
          v-for="project in featuredProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" />
          </div>
          <div class="project-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <div class="project-links">
              <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank">
                🌐 在线预览
              </a>
              <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank">
                💻 源码
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NoteCard from '@/components/blog/NoteCard.vue'
import DemoCard from '@/components/blog/DemoCard.vue'
import notesData from '@/data/notes.json'
import demosData from '@/data/demos.json'
import projectsData from '@/data/projects.json'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

interface Note {
  id: string
  title: string
  category: string
  excerpt: string
  tags: string[]
  createdAt: string
  updatedAt: string
  readTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  featured: boolean
}

interface Demo {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  featured: boolean
}

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  completedAt: string
  status: string
}

const categories = ref<Category[]>(notesData.categories)
const notes = ref<Note[]>(notesData.notes)
const demos = ref<Demo[]>(demosData.demos)
const projects = ref<Project[]>(projectsData.projects)

// 统计数据
const totalNotes = computed(() => notes.value.length)
const totalDemos = computed(() => demos.value.length)
const totalProjects = computed(() => projects.value.length)

// 精选内容
const featuredNotes = computed(() =>
  notes.value.filter(note => note.featured).slice(0, 3)
)

const featuredDemos = computed(() =>
  demos.value.filter(demo => demo.featured).slice(0, 2)
)

const featuredProjects = computed(() =>
  projects.value.filter(project => project.featured).slice(0, 2)
)

// 辅助函数
const getCategoryById = (categoryId: string) => {
  return categories.value.find(cat => cat.id === categoryId)
}

const getDemoCategoryById = (categoryId: string) => {
  return demosData.categories.find(cat => cat.id === categoryId)
}

const getCategoryNoteCount = (categoryId: string) => {
  return notes.value.filter(note => note.category === categoryId).length
}

onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped lang="scss">
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

// Hero Section
.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 3rem;

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1;
      }

      .stat-label {
        display: block;
        font-size: 0.9rem;
        opacity: 0.8;
        margin-top: 0.5rem;
      }
    }
  }
}

// Common Section Styles
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #2c3e50;
    font-size: 2rem;
    margin: 0;
  }

  .view-all {
    color: #4264FB;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Featured Content
.featured-content {
  margin-bottom: 3rem;

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .featured-notes h3,
  .featured-demos h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .notes-grid {
    display: grid;
    gap: 1.5rem;
  }

  .demos-grid {
    display: grid;
    gap: 1.5rem;
  }
}

// Categories Overview
.categories-overview {
  margin-bottom: 3rem;

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .category-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .category-icon {
      font-size: 2rem;
      width: 48px;
      text-align: center;
    }

    .category-info {
      flex: 1;

      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }

      p {
        color: #666;
        margin: 0 0 1rem 0;
        line-height: 1.5;
        font-size: 0.95rem;
      }

      .category-count {
        color: #4264FB;
        font-weight: 500;
        font-size: 0.9rem;
      }
    }
  }
}

// Projects Preview
.projects-preview {
  margin-bottom: 3rem;

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .project-image {
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .project-content {
      padding: 1.5rem;

      h3 {
        color: #2c3e50;
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
      }

      p {
        color: #666;
        margin: 0 0 1rem 0;
        line-height: 1.6;
      }

      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;

        .tag {
          background: #f1f3f4;
          color: #5f6368;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }

      .project-links {
        display: flex;
        gap: 1rem;

        a {
          color: #4264FB;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .featured-content .content-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 1rem;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-stats {
      gap: 2rem;

      .stat-item .stat-number {
        font-size: 2rem;
      }
    }
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    h2 {
      font-size: 1.5rem;
    }
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>

