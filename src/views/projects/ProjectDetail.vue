<template>
  <div class="project-detail" v-if="project">
    <div class="project-header">
      <div class="breadcrumb">
        <router-link to="/projects">🚀 项目展示</router-link>
        <span class="separator">/</span>
        <span class="current">{{ project.title }}</span>
      </div>

      <div class="project-info">
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
          <div class="project-status" :class="project.status">
            {{ statusText(project.status) }}
          </div>
        </div>

        <div class="project-meta">
          <h1 class="project-title">{{ project.title }}</h1>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-details">
            <div class="detail-item">
              <span class="label">完成时间</span>
              <span class="value">📅 {{ formatDate(project.completedAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">项目状态</span>
              <span class="value status" :class="project.status">
                {{ statusText(project.status) }}
              </span>
            </div>
            <div class="detail-item" v-if="project.featured">
              <span class="label">项目评级</span>
              <span class="value featured">⭐ 精选项目</span>
            </div>
          </div>

          <div class="project-actions">
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="action-btn primary">
              🌐 在线预览
            </a>
            <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="action-btn secondary">
              💻 查看源码
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="project-content">
      <div class="content-section">
        <h2>📋 项目概述</h2>
        <div class="section-content">
          <h3>🚧 正在建设中</h3>
          <p>这个项目的详细介绍正在编写中，敬请期待...</p>

          <h4>预期内容：</h4>
          <ul>
            <li>项目背景和需求分析</li>
            <li>技术架构和设计方案</li>
            <li>关键功能实现细节</li>
            <li>开发过程和挑战</li>
            <li>性能优化和部署经验</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2>🛠️ 技术栈</h2>
        <div class="tech-grid">
          <div v-for="tech in project.technologies" :key="tech" class="tech-card">
            <div class="tech-icon">💻</div>
            <span class="tech-name">{{ tech }}</span>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🏷️ 项目标签</h2>
        <div class="tags-container">
          <span v-for="tag in project.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>

      <div class="content-section">
        <h2>🔗 相关资源</h2>
        <div class="resources-grid">
          <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="resource-card">
            <div class="resource-icon">🌐</div>
            <div class="resource-content">
              <h4>在线预览</h4>
              <p>访问项目在线演示</p>
            </div>
          </a>

          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="resource-card">
            <div class="resource-icon">💻</div>
            <div class="resource-content">
              <h4>源码仓库</h4>
              <p>查看项目完整代码</p>
            </div>
          </a>

          <router-link to="/projects" class="resource-card">
            <div class="resource-icon">🚀</div>
            <div class="resource-content">
              <h4>更多项目</h4>
              <p>浏览其他项目案例</p>
            </div>
          </router-link>
        </div>
      </div>

      <div class="content-section">
        <h2>📊 项目统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ project.technologies.length }}</div>
            <div class="stat-label">技术栈</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ project.tags.length }}</div>
            <div class="stat-label">标签数量</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ daysSinceCompletion }}</div>
            <div class="stat-label">完成天数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ project.featured ? '是' : '否' }}</div>
            <div class="stat-label">精选项目</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const projects = ref<Project[]>(projectsData.projects)

const project = computed<Project | undefined>(() => {
  return projects.value.find(p => p.id === String(route.params.id))
})

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

const daysSinceCompletion = computed(() => {
  if (!project.value) return 0
  const completionDate = new Date(project.value.completedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - completionDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})
</script>

<style scoped lang="scss">
.project-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.project-header {
  margin-bottom: 3rem;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    color: #666;

    a {
      color: #4264FB;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .separator {
      color: #999;
    }

    .current {
      color: #2c3e50;
      font-weight: 500;
    }
  }

  .project-info {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    .project-image {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      height: 300px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    .project-meta {
      .project-title {
        color: #2c3e50;
        font-size: 2rem;
        margin: 0 0 1rem 0;
        line-height: 1.2;
      }

      .project-description {
        color: #666;
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0 0 2rem 0;
      }

      .project-details {
        margin-bottom: 2rem;

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f3f4;

          .label {
            color: #666;
            font-weight: 500;
          }

          .value {
            color: #2c3e50;
            font-weight: 600;

            &.status {
              &.completed {
                color: #28a745;
              }

              &.in_progress {
                color: #ffc107;
              }

              &.planned {
                color: #6c757d;
              }
            }

            &.featured {
              color: #ff6b35;
            }
          }
        }
      }

      .project-actions {
        display: flex;
        gap: 1rem;

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
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
            border: 2px solid #4264FB;

            &:hover {
              background: #f1f8ff;
              transform: translateY(-1px);
            }
          }
        }
      }
    }
  }
}

.project-content {
  display: grid;
  gap: 3rem;

  .content-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      color: #2c3e50;
      font-size: 1.8rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #f1f3f4;
    }

    .section-content {
      color: #2c3e50;
      line-height: 1.8;

      h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        margin: 1.5rem 0 1rem 0;
      }

      h4 {
        color: #2c3e50;
        font-size: 1.2rem;
        margin: 1rem 0 0.5rem 0;
      }

      p {
        margin-bottom: 1rem;
      }

      ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;

      .tech-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #4264FB;

        .tech-icon {
          font-size: 1.5rem;
        }

        .tech-name {
          font-weight: 500;
          color: #2c3e50;
        }
      }
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      .tag {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: 500;
      }
    }

    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;

      .resource-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          background: #e9ecef;
          transform: translateY(-2px);
        }

        .resource-icon {
          font-size: 2rem;
          width: 50px;
          text-align: center;
        }

        .resource-content {
          flex: 1;

          h4 {
            color: #2c3e50;
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
          }

          p {
            color: #666;
            margin: 0;
            font-size: 0.9rem;
          }
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;

      .stat-card {
        text-align: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .project-header .project-info {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .project-detail {
    padding: 1rem;
  }

  .project-header .project-info {
    padding: 1.5rem;

    .project-image {
      height: 200px;
    }

    .project-meta {
      .project-title {
        font-size: 1.5rem;
      }

      .project-description {
        font-size: 1rem;
      }

      .project-actions {
        flex-direction: column;

        .action-btn {
          text-align: center;
          justify-content: center;
        }
      }
    }
  }

  .project-content .content-section {
    padding: 1.5rem;

    h2 {
      font-size: 1.5rem;
    }

    .tech-grid {
      grid-template-columns: 1fr;
    }

    .resources-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>