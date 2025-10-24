<template>
  <div class="notes-list">
    <div class="page-header">
      <h1>📝 技术笔记</h1>
      <p>分享GIS开发经验、技术教程和学习心得</p>
    </div>

    <div class="content-layout">
      <!-- 主要内容区域 -->
      <main class="main-content">
        <div class="notes-grid">
          <NoteCard
            v-for="note in notes"
            :key="note.id"
            :note="note"
            :category="getCategoryById(note.category)"
          />
        </div>
      </main>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <CategoryNav
          :categories="categories"
          title="笔记分类"
          item-type="笔记"
          :counts="categoryCounts"
          base-path="/notes"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NoteCard from '@/components/blog/NoteCard.vue'
import CategoryNav from '@/components/blog/CategoryNav.vue'
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

const categories = ref<Category[]>(notesData.categories)
const notes = ref<Note[]>(notesData.notes.map(note => ({
  ...note,
  difficulty: note.difficulty as 'beginner' | 'intermediate' | 'advanced'
})))

// 计算每个分类的笔记数量
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  notes.value.forEach(note => {
    counts[note.category] = (counts[note.category] || 0) + 1
  })
  return counts
})

const getCategoryById = (categoryId: string) => {
  return categories.value.find(cat => cat.id === categoryId)
}
</script>

<style scoped lang="scss">
.notes-list {
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

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
}

.main-content {
  .notes-grid {
    display: grid;
    gap: 2rem;
  }
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

// 响应式设计
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .notes-list {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
</style>