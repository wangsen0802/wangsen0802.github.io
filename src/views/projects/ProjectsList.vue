<template>
  <div class="projects-list">
    <div class="page-header">
      <h1>🚀 项目展示</h1>
      <p>分享GIS相关的实际项目案例和实践经验</p>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
          <div class="project-status" :class="project.status">
            {{ statusText(project.status) }}
          </div>
        </div>
        <div class="project-content">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>

          <div class="project-meta">
            <span class="completion-date">
              📅 完成于 {{ formatDate(project.completedAt) }}
            </span>
            <span class="featured" v-if="project.featured">
              ⭐ 精选项目
            </span>
          </div>

          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <div class="project-technologies">
            <span class="tech-label">技术栈：</span>
            <span v-for="tech in project.technologies" :key="tech" class="tech">
              {{ tech }}
            </span>
          </div>

          <div class="project-links">
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="link-btn primary">
              🌐 在线预览
            </a>
            <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="link-btn secondary">
              💻 源码
            </a>
            <router-link :to="`/projects/${project.id}`" class="link-btn tertiary">
              📋 详细信息
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!projects.length" class="empty-state">
      <div class="empty-icon">🚀</div>
      <h3>暂无项目展示</h3>
      <p>项目案例正在整理中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import projectsData from '@/data/projects.json'

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

const projects = ref<Project[]>(projectsData.projects)

const statusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    in_progress: '进行中',
    planned: '计划中'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped lang="scss">
.projects-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .project-image {
    position: relative;
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .project-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      backdrop-filter: blur(10px);

      &.completed {
        background: rgba(40, 167, 69, 0.9);
        color: white;
      }

      &.in_progress {
        background: rgba(255, 193, 7, 0.9);
        color: #212529;
      }

      &.planned {
        background: rgba(108, 117, 125, 0.9);
        color: white;
      }
    }
  }

  .project-content {
    padding: 2rem;

    h3 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
      line-height: 1.3;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }

    .project-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.9rem;

      .completion-date {
        color: #666;
      }

      .featured {
        color: #ff6b35;
        font-weight: 500;
      }
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .tag {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.875rem;
        font-weight: 500;
      }
    }

    .project-technologies {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;

      .tech-label {
        color: #666;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .tech {
        background: #f3e5f5;
        color: #7b1fa2;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
      }
    }

    .project-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &.primary {
          background: #4264FB;
          color: white;

          &:hover {
            background: #3366cc;
            transform: translateY(-1px);
          }
        }

        &.secondary {
          background: white;
          color: #4264FB;
          border: 1px solid #4264FB;

          &:hover {
            background: #f1f8ff;
            transform: translateY(-1px);
          }
        }

        &.tertiary {
          background: #f8f9fa;
          color: #2c3e50;
          border: 1px solid #dee2e6;

          &:hover {
            background: #e9ecef;
            transform: translateY(-1px);
          }
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    color: #2c3e50;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin: 0;
    line-height: 1.6;
    font-size: 1.1rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .projects-list {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project-card .project-content {
    padding: 1.5rem;

    h3 {
      font-size: 1.25rem;
    }

    .project-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .project-links {
      .link-btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }
  }
}
</style>