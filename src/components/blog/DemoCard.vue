<template>
  <div class="demo-card" :class="{ featured: demo.featured }">
    <div class="demo-header">
      <div class="category-badge" :style="{ backgroundColor: categoryColor }">
        {{ categoryIcon }} {{ categoryName }}
      </div>
      <div class="difficulty" :class="demo.difficulty">
        {{ difficultyText }}
      </div>
    </div>

    <div class="demo-preview" v-if="demo.previewImage">
      <img :src="demo.previewImage" :alt="demo.title" />
      <div class="play-overlay">
        <button class="play-btn" @click="openDemo">
          ▶️ 运行示例
        </button>
      </div>
    </div>

    <h3 class="demo-title">
      <router-link :to="`/demos/${demo.category}/${demo.id}`">
        {{ demo.title }}
      </router-link>
    </h3>

    <p class="demo-description">{{ demo.description }}</p>

    <div class="demo-meta">
      <span class="code-files" v-if="demo.codeFiles && demo.codeFiles.length">
        📁 {{ demo.codeFiles.length }} 个文件
      </span>
      <span class="interactive">🎮 可交互</span>
    </div>

    <div class="demo-tags" v-if="demo.tags && demo.tags.length">
      <span
        v-for="tag in demo.tags"
        :key="tag"
        class="tag"
      >
        #{{ tag }}
      </span>
    </div>

    <div class="demo-actions">
      <router-link
        :to="`/demos/${demo.category}/${demo.id}`"
        class="primary-btn"
      >
        查看代码
      </router-link>
      <a
        v-if="demo.liveUrl"
        :href="demo.liveUrl"
        target="_blank"
        class="secondary-btn"
      >
        在线运行
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export interface Demo {
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

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Props {
  demo: Demo
  category?: Category
}

const props = withDefaults(defineProps<Props>(), {
  category: undefined
})

const router = useRouter()

const categoryName = computed(() =>
  props.category?.name || props.demo.category
)

const categoryIcon = computed(() =>
  props.category?.icon || '📱'
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
  return difficultyMap[props.demo.difficulty] || '未知'
})

const openDemo = () => {
  if (props.demo.liveUrl) {
    window.open(props.demo.liveUrl, '_blank')
  } else {
    router.push(`/demos/${props.demo.category}/${props.demo.id}`)
  }
}
</script>

<style scoped lang="scss">
.demo-card {
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

.demo-header {
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

.demo-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  height: 200px;
  background: #f8f9fa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  .play-btn {
    background: #4264FB;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 24px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #3366cc;
      transform: scale(1.05);
    }
  }
}

.demo-title {
  margin: 0 0 0.75rem 0;

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

.demo-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.demo-meta {
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

.demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  .tag {
    background: #f1f3f4;
    color: #5f6368;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }
}

.demo-actions {
  display: flex;
  gap: 0.75rem;

  .primary-btn {
    background: #4264FB;
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #3366cc;
      transform: translateY(-1px);
    }
  }

  .secondary-btn {
    background: white;
    color: #4264FB;
    border: 1px solid #4264FB;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #f1f8ff;
      transform: translateY(-1px);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-card {
    padding: 1rem;
  }

  .demo-actions {
    flex-direction: column;

    .primary-btn,
    .secondary-btn {
      text-align: center;
    }
  }

  .demo-preview {
    height: 150px;
  }
}
</style>