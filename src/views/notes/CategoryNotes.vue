<template>
  <div class="category-notes">
    <div class="page-header">
      <div class="category-info" v-if="category">
        <div class="category-icon" :style="{ color: category.color }">
          {{ category.icon }}
        </div>
        <div>
          <h1>{{ category.name }} 相关笔记</h1>
          <p>{{ category.description }}</p>
        </div>
      </div>
    </div>

    <div class="notes-content">
      <div class="notes-grid" v-if="categoryNotes.length">
        <NoteCard
          v-for="note in categoryNotes"
          :key="note.id"
          :note="note"
          :category="category"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无相关笔记</h3>
        <p>该分类下还没有任何笔记，敬请期待后续内容更新。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NoteCard from '@/components/blog/NoteCard.vue'
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

const category = computed(() => {
  return categories.value.find(cat => cat.id === route.params.category)
})

const categoryNotes = computed(() => {
  return notes.value.filter(note => note.category === route.params.category)
})
</script>

<style scoped lang="scss">
.category-notes {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 3rem;

  .category-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .category-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 50%;
    }

    h1 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    p {
      color: #666;
      margin: 0;
      line-height: 1.6;
      font-size: 1.1rem;
    }
  }
}

.notes-content {
  .notes-grid {
    display: grid;
    gap: 2rem;
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
  .category-notes {
    padding: 1rem;
  }

  .page-header .category-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;

    .category-icon {
      width: 60px;
      height: 60px;
      font-size: 2rem;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>