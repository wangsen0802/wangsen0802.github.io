<template>
  <div class="demos-list">
    <div class="page-header">
      <h1>🎮 在线示例</h1>
      <p>可交互的GIS代码示例，实时运行和编辑</p>
    </div>

    <div class="content-layout">
      <!-- 主要内容区域 -->
      <main class="main-content">
        <div class="demos-grid">
          <DemoCard
            v-for="demo in demos"
            :key="demo.id"
            :demo="demo"
            :category="getCategoryById(demo.category)"
          />
        </div>
      </main>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <CategoryNav
          :categories="categories"
          title="示例分类"
          item-type="示例"
          :counts="categoryCounts"
          base-path="/demos"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DemoCard from '@/components/blog/DemoCard.vue'
import CategoryNav from '@/components/blog/CategoryNav.vue'
import demosData from '@/data/demos.json'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

interface Demo {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  featured: boolean
  previewImage?: string
  codeFiles?: string[]
  liveUrl?: string
}

const categories = ref<Category[]>(demosData.categories)
const demos = ref<Demo[]>(demosData.demos)

// 计算每个分类的示例数量
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  demos.value.forEach(demo => {
    counts[demo.category] = (counts[demo.category] || 0) + 1
  })
  return counts
})

const getCategoryById = (categoryId: string) => {
  return categories.value.find(cat => cat.id === categoryId)
}
</script>

<style scoped lang="scss">
.demos-list {
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
  .demos-grid {
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
  .demos-list {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
</style>