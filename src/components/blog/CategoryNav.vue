<template>
  <nav class="category-nav">
    <div class="nav-header">
      <h3>{{ title }}</h3>
      <button
        v-if="showToggle"
        @click="toggleExpanded"
        class="toggle-btn"
        :class="{ expanded: isExpanded }"
      >
        {{ isExpanded ? '收起' : '展开' }}
      </button>
    </div>

    <div class="categories" :class="{ collapsed: !isExpanded }">
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="getCategoryLink(category)"
        class="category-item"
        :class="{ active: isActiveCategory(category.id) }"
        :style="{ borderLeftColor: category.color }"
      >
        <span class="category-icon" :style="{ color: category.color }">
          {{ category.icon }}
        </span>
        <div class="category-info">
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count" v-if="getCategoryCount(category.id)">
            ({{ getCategoryCount(category.id) }})
          </span>
        </div>
      </router-link>
    </div>

    <div class="nav-footer" v-if="showAllLink">
      <router-link :to="allLink" class="all-link">
        查看全部 {{ totalItems }} 个{{ itemType }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  description?: string
}

interface Props {
  categories: Category[]
  title?: string
  itemType?: string
  counts?: Record<string, number>
  showToggle?: boolean
  showAllLink?: boolean
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '分类导航',
  itemType: '项目',
  showToggle: false,
  showAllLink: true,
  basePath: ''
})

const route = useRoute()
const isExpanded = ref(true)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const getCategoryLink = (category: Category) => {
  return `${props.basePath}/${category.id}`
}

const isActiveCategory = (categoryId: string) => {
  return route.path.includes(`/${categoryId}`)
}

const getCategoryCount = (categoryId: string) => {
  return props.counts?.[categoryId] || 0
}

const totalItems = computed(() => {
  return Object.values(props.counts || {}).reduce((sum, count) => sum + count, 0)
})

const allLink = computed(() => {
  return props.basePath || '/'
})
</script>

<style scoped lang="scss">
.category-nav {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f3f4;

  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .toggle-btn {
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
      border-color: #4264FB;
      color: #4264FB;
    }
  }
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &.collapsed {
    max-height: 0;
    overflow: hidden;
  }
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #5f6368;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }

  &.active {
    background: #f1f8ff;
    color: #4264FB;
    font-weight: 500;
  }

  .category-icon {
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  .category-info {
    display: flex;
    flex-direction: column;
    flex: 1;

    .category-name {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .category-count {
      font-size: 0.75rem;
      color: #666;
    }
  }
}

.nav-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 2px solid #f1f3f4;
  text-align: center;

  .all-link {
    color: #4264FB;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .category-nav {
    padding: 1rem;
  }

  .nav-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;

    h3 {
      font-size: 1rem;
    }
  }

  .category-item {
    padding: 0.5rem 0.75rem;
  }
}
</style>