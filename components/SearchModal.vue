<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import type { SearchDocument, SearchResult } from '~/composables/useSearch'

// Props
interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Router
const router = useRouter()

// Composables
const { search: performSearch } = useSearch()

// Refs
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isSearching = ref(false)
const activeIndex = ref(-1)

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const hasResults = computed(() => searchResults.value.length > 0)

const showNoResults = computed(
  () => searchQuery.value.trim().length > 0 && !hasResults.value && !isSearching.value
)

// Methods
/**
 * 搜索文章
 */
const handleSearch = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  activeIndex.value = -1

  // 使用 setTimeout 避免阻塞 UI
  await nextTick()
  setTimeout(() => {
    try {
      const results = performSearch(query, 20)
      searchResults.value = results
    } catch (error) {
      console.error('搜索失败:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 100)
}

/**
 * 防抖搜索
 */
let searchTimer: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    handleSearch()
  }, 300)
}

/**
 * 选择结果
 */
const selectResult = (result: SearchResult) => {
  const path = `/posts/${result.doc.category}/${result.doc.id}`
  router.push(path)
  closeModal()
}

/**
 * 关闭弹窗
 */
const closeModal = () => {
  isOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  activeIndex.value = -1
}

/**
 * 处理键盘导航
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (!hasResults.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, searchResults.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, -1)
      break
    case 'Enter':
      e.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < searchResults.value.length) {
        selectResult(searchResults.value[activeIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      closeModal()
      break
  }
}

/**
 * 高亮搜索关键词
 */
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

// Watchers
watch(searchQuery, () => {
  debouncedSearch()
})

watch(isOpen, (newValue) => {
  if (newValue) {
    // 打开时自动聚焦输入框
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    // 关闭时清空搜索
    searchQuery.value = ''
    searchResults.value = []
  }
})

// 生命周期
onMounted(() => {
  // 监听全局快捷键
  const handleGlobalKeydown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value = !isOpen.value
    }
  }

  document.addEventListener('keydown', handleGlobalKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  })
})
</script>

<template>
  <div>
    <!-- 搜索按钮 -->
    <a-button
      type="text"
      class="search-trigger-button"
      title="搜索文章 (Ctrl/Cmd + K)"
      @click="isOpen = true"
    >
      <template #icon>
        <SearchOutlined />
      </template>
    </a-button>

    <!-- 搜索弹窗 -->
    <a-modal
      v-model:open="isOpen"
      :footer="null"
      :closable="false"
      centered
      width="90%"
      :style="{ maxWidth: '640px' }"
      wrap-class-name="search-modal-wrapper"
      @cancel="closeModal"
    >
      <div class="search-modal">
        <!-- 搜索输入框 -->
        <div class="search-input-wrapper">
          <SearchOutlined class="search-icon" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文章标题、描述、标签..."
            @keydown="handleKeydown"
          />
          <div class="search-shortcut">⌘K</div>
          <a-button
            v-if="searchQuery"
            type="text"
            size="small"
            class="clear-button"
            @click="searchQuery = ''"
          >
            <template #icon>
              <CloseOutlined />
            </template>
          </a-button>
        </div>

        <!-- 搜索结果 -->
        <div class="search-results">
          <!-- 加载中 -->
          <div v-if="isSearching" class="search-loading">
            <a-spin size="small" />
            <span>搜索中...</span>
          </div>

          <!-- 无结果 -->
          <div v-else-if="showNoResults" class="search-no-results">
            <FileTextOutlined class="no-results-icon" />
            <p>未找到相关文章</p>
            <span class="hint">试试其他关键词</span>
          </div>

          <!-- 结果列表 -->
          <div v-else-if="hasResults" class="results-list">
            <div
              v-for="(result, index) in searchResults"
              :key="result.doc.id"
              class="result-item"
              :class="{ active: index === activeIndex }"
              @click="selectResult(result)"
              @mouseenter="activeIndex = index"
            >
              <div class="result-header">
                <h3 class="result-title" v-html="highlightText(result.doc.title, searchQuery)" />
                <span class="result-category">{{ result.doc.category }}</span>
              </div>
              <p class="result-description" v-html="highlightText(result.doc.description, searchQuery)" />
              <div class="result-meta">
                <span class="result-date">{{ result.doc.date }}</span>
                <div class="result-tags">
                  <a-tag v-for="tag in result.doc.tags" :key="tag" size="small">
                    {{ tag }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 初始提示 -->
          <div v-else class="search-hint">
            <p>输入关键词开始搜索文章</p>
            <div class="hint-tips">
              <span>支持搜索标题、描述、标签</span>
              <span>按 ↑↓ 导航，Enter 选择</span>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="search-footer">
          <span class="footer-hint">
            <span class="keyboard-hint">↑↓</span> 导航
            <span class="keyboard-hint">Enter</span> 选择
            <span class="keyboard-hint">Esc</span> 关闭
          </span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.search-trigger-button {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.search-modal {
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-primary);
    border-radius: 12px;
    margin-bottom: 1rem;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    .search-icon {
      color: var(--text-secondary);
      font-size: 1.125rem;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 1rem;
      color: var(--text-primary);
      outline: none;

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    .search-shortcut {
      padding: 0.25rem 0.5rem;
      background: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      user-select: none;
    }

    .clear-button {
      color: var(--text-secondary);
      transition: all 0.3s ease;

      &:hover {
        color: var(--accent-primary);
      }
    }
  }

  .search-results {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 1rem;

    .search-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .search-no-results {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);

      .no-results-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      p {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .hint {
        font-size: 0.875rem;
        color: var(--text-tertiary);
      }
    }

    .search-hint {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);

      p {
        font-size: 1rem;
        margin-bottom: 1rem;
      }

      .hint-tips {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-tertiary);
      }
    }

    .results-list {
      .result-item {
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid transparent;

        &:hover,
        &.active {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;

          .result-title {
            flex: 1;
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.4;

            :deep(mark.search-highlight) {
              background: var(--accent-warning);
              color: var(--text-primary);
              padding: 0 0.125rem;
              border-radius: 2px;
            }
          }

          .result-category {
            padding: 0.125rem 0.5rem;
            background: var(--accent-primary);
            color: white;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
          }
        }

        .result-description {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          :deep(mark.search-highlight) {
            background: var(--accent-warning);
            color: var(--text-secondary);
            padding: 0 0.125rem;
            border-radius: 2px;
          }
        }

        .result-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;

          .result-date {
            font-size: 0.75rem;
            color: var(--text-tertiary);
          }

          .result-tags {
            display: flex;
            gap: 0.25rem;
            flex-wrap: wrap;

            :deep(.ant-tag) {
              margin: 0;
              font-size: 0.6875rem;
            }
          }
        }
      }
    }
  }

  .search-footer {
    padding-top: 1rem;
    border-top: 1px solid var(--border-primary);
    text-align: center;

    .footer-hint {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      .keyboard-hint {
        padding: 0.125rem 0.375rem;
        background: var(--bg-tertiary);
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.75rem;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-modal {
    .search-results {
      max-height: 300px;

      .results-list {
        .result-item {
          padding: 0.75rem;

          .result-header {
            flex-direction: column;
            align-items: flex-start;

            .result-category {
              align-self: flex-start;
            }
          }
        }
      }
    }

    .search-footer {
      .footer-hint {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }
}
</style>

<style>
/* 全局样式 - Modal 容器 */
.search-modal-wrapper .ant-modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-heavy);
}

.search-modal-wrapper .ant-modal-body {
  padding: 1.5rem;
}
</style>
