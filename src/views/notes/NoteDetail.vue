<template>
  <div class="note-detail" v-if="note">
    <div class="note-header">
      <div class="breadcrumb">
        <router-link to="/notes">📝 技术笔记</router-link>
        <span class="separator">/</span>
        <router-link :to="`/notes/${note.category}`">
          {{ categoryName }}
        </router-link>
        <span class="separator">/</span>
        <span class="current">{{ note.title }}</span>
      </div>

      <div class="note-meta">
        <div class="category-badge" :style="{ backgroundColor: categoryColor }">
          {{ categoryIcon }} {{ categoryName }}
        </div>
        <div class="difficulty" :class="note.difficulty">
          {{ difficultyText }}
        </div>
        <span class="read-time">📖 {{ note.readTime }} 分钟</span>
        <span class="update-date">📅 {{ formatDate(note.updatedAt) }}</span>
      </div>

      <h1 class="note-title">{{ note.title }}</h1>
      <p class="note-excerpt">{{ note.excerpt }}</p>
    </div>

    <div class="note-content">
      <div class="content-wrapper">
        <div class="note-tags" v-if="note.tags.length">
          <span v-for="tag in note.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>

        <!-- 这里是笔记正文内容区域 -->
        <div class="markdown-content">
          <h2>🚧 正在建设中</h2>
          <p>这篇笔记的详细内容正在编写中，敬请期待...</p>

          <h3>📋 预期内容</h3>
          <ul>
            <li>详细的技术教程和代码示例</li>
            <li>实践案例和经验分享</li>
            <li>相关工具和资源推荐</li>
            <li>常见问题和解决方案</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="note-navigation">
      <div class="nav-prev" v-if="prevNote">
        <router-link :to="`/notes/${prevNote.category}/${prevNote.id}`">
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ prevNote.title }}</span>
        </router-link>
      </div>
      <div class="nav-next" v-if="nextNote">
        <router-link :to="`/notes/${nextNote.category}/${nextNote.id}`">
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ nextNote.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import notesData from '@/data/notes.json'

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

const route = useRoute()
const categories = ref<Category[]>(notesData.categories)
const notes = ref<Note[]>(notesData.notes.map(note => ({
  ...note,
  difficulty: note.difficulty as 'beginner' | 'intermediate' | 'advanced'
})))

const note = computed<Note | undefined>(() => {
  return notes.value.find(n =>
    n.id === String(route.params.id) && n.category === String(route.params.category)
  )
})

const category = computed(() => {
  return categories.value.find(cat => cat.id === note.value?.category)
})

const categoryName = computed(() => category.value?.name || note.value?.category || '未知')
const categoryIcon = computed(() => category.value?.icon || '📝')
const categoryColor = computed(() => category.value?.color || '#666')

const difficultyText = computed(() => {
  const difficultyMap = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return difficultyMap[note.value?.difficulty || 'beginner'] || '未知'
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 上一篇和下一篇导航
const currentIndex = computed(() => {
  return notes.value.findIndex(n => n.id === note.value?.id)
})

const prevNote = computed(() => {
  const index = currentIndex.value
  return index > 0 ? notes.value[index - 1] : null
})

const nextNote = computed(() => {
  const index = currentIndex.value
  return index < notes.value.length - 1 ? notes.value[index + 1] : null
})
</script>

<style scoped lang="scss">
.note-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.note-header {
  margin-bottom: 3rem;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
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

  .note-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
    }

    .difficulty {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;

      &.beginner {
        background: #d4edda;
        color: #155724;
      }

      &.intermediate {
        background: #fff3cd;
        color: #856404;
      }

      &.advanced {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .read-time,
    .update-date {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #666;
      font-size: 0.9rem;
    }
  }

  .note-title {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .note-excerpt {
    color: #666;
    font-size: 1.25rem;
    line-height: 1.6;
    margin: 0;
  }
}

.note-content {
  .content-wrapper {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;

      .tag {
        background: #f1f3f4;
        color: #5f6368;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.875rem;
        font-weight: 500;
      }
    }

    .markdown-content {
      color: #2c3e50;
      line-height: 1.8;
      font-size: 1.1rem;

      h2 {
        color: #2c3e50;
        font-size: 1.8rem;
        margin: 2rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f1f3f4;
      }

      h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        margin: 1.5rem 0 1rem 0;
      }

      p {
        margin-bottom: 1rem;
      }

      ul {
        margin-bottom: 1rem;
        padding-left: 1.5rem;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
}

.note-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  gap: 2rem;

  .nav-prev,
  .nav-next {
    flex: 1;
    max-width: 300px;

    a {
      display: block;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .nav-label {
        color: #4264FB;
        font-weight: 500;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      .nav-title {
        color: #2c3e50;
        font-weight: 600;
        line-height: 1.4;
      }
    }
  }

  .nav-prev {
    text-align: left;
  }

  .nav-next {
    text-align: right;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .note-detail {
    padding: 1rem;
  }

  .note-header {
    .note-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .note-title {
      font-size: 2rem;
    }

    .note-excerpt {
      font-size: 1.1rem;
    }
  }

  .note-content .content-wrapper {
    padding: 1.5rem;
  }

  .note-navigation {
    flex-direction: column;
    gap: 1rem;

    .nav-prev,
    .nav-next {
      max-width: none;
    }
  }
}
</style>