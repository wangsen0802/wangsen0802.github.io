<template>
  <div class="note-card" :class="{ featured: note.featured }">
    <div class="note-header">
      <div class="category-badge" :style="{ backgroundColor: categoryColor }">
        {{ categoryIcon }} {{ categoryName }}
      </div>
      <div class="difficulty" :class="note.difficulty">
        {{ difficultyText }}
      </div>
    </div>

    <h3 class="note-title">
      <router-link :to="`/notes/${note.category}/${note.id}`">
        {{ note.title }}
      </router-link>
    </h3>

    <p class="note-excerpt">{{ note.excerpt }}</p>

    <div class="note-meta">
      <span class="read-time">📖 {{ note.readTime }} 分钟</span>
      <span class="date">📅 {{ formatDate(note.updatedAt) }}</span>
    </div>

    <div class="note-tags" v-if="note.tags && note.tags.length">
      <span
        v-for="tag in note.tags"
        :key="tag"
        class="tag"
      >
        #{{ tag }}
      </span>
    </div>

    <div class="note-footer">
      <router-link
        :to="`/notes/${note.category}/${note.id}`"
        class="read-more"
      >
        阅读全文 →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Props {
  note: Note
  category?: Category
}

const props = withDefaults(defineProps<Props>(), {
  category: undefined
})

const categoryName = computed(() =>
  props.category?.name || props.note.category
)

const categoryIcon = computed(() =>
  props.category?.icon || '📝'
)

const categoryColor = computed(() =>
  props.category?.color || '#666'
)

const difficultyText = computed(() => {
  const difficultyMap = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return difficultyMap[props.note.difficulty] || '未知'
})

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
.note-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &.featured {
    border-color: #4264FB;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  }
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

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

.note-title {
  margin: 0 0 1rem 0;

  a {
    text-decoration: none;
    color: #2c3e50;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;

    &:hover {
      color: #4264FB;
    }
  }
}

.note-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.note-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .tag {
    background: #f1f3f4;
    color: #5f6368;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }
}

.note-footer {
  text-align: right;

  .read-more {
    color: #4264FB;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>