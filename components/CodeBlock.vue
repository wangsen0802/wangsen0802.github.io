<template>
  <div class="code-block-wrapper">
    <a-button
      type="text"
      size="small"
      class="code-copy-btn"
      :class="{ 'copied': isCopied, 'error': copyError }"
      :title="copyError || (isCopied ? '已复制!' : '复制代码')"
      @click="handleCopy"
    >
      <template #icon>
        <CheckOutlined v-if="isCopied" class="check-icon" />
        <CloseCircleOutlined v-else-if="copyError" class="error-icon" />
        <CopyOutlined v-else class="copy-icon" />
      </template>
      <span v-if="showLabel" class="copy-label">
        {{ copyError || (isCopied ? '已复制' : '复制') }}
      </span>
    </a-button>
    <pre :class="['code-block', language && `language-${language}`]"><code :class="language && `language-${language}`" v-html="highlightedCode"></code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CopyOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { useCodeCopy } from '~/composables/useCodeCopy'

interface Props {
  code: string
  language?: string
  showLabel?: boolean
  highlight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: '',
  showLabel: false,
  highlight: true
})

// 使用 useCodeCopy composable
const { isCopied, copyError, copyToClipboard } = useCodeCopy({
  code: props.code,
  feedbackDuration: 2000
})

/**
 * 处理复制按钮点击
 */
const handleCopy = async () => {
  await copyToClipboard()
}

/**
 * 高亮代码 (使用 highlight.js)
 */
const highlightedCode = computed(() => {
  if (!props.highlight || !props.language) {
    // 转义 HTML 特殊字符
    return escapeHtml(props.code)
  }

  try {
    // 动态导入 highlight.js
    if (process.client) {
      const hljs = require('highlight.js')
      if (hljs.getLanguage(props.language)) {
        return hljs.highlight(props.code, {
          language: props.language,
          ignoreIllegals: true
        }).value
      }
    }
  } catch (error) {
    console.warn('代码高亮失败:', error)
  }

  // 降级: 返回转义后的代码
  return escapeHtml(props.code)
})

/**
 * 转义 HTML 特殊字符
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// 在挂载时导入 highlight.js 的样式
onMounted(() => {
  if (process.client && props.highlight) {
    try {
      // 动态导入 highlight.js 主题样式
      const colorMode = useColorMode()
      const isDark = computed(() => colorMode.value === 'dark')

      // 根据主题加载不同的 highlight.js 主题
      const theme = isDark.value ? 'atom-one-dark' : 'atom-one-light'
      import(`highlight.js/styles/${theme}.css`)
    } catch (error) {
      console.warn('无法加载 highlight.js 样式:', error)
    }
  }
})
</script>

<style scoped lang="scss">
.code-block-wrapper {
  position: relative;
  margin: 1rem 0;
}

.code-copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  opacity: 0.7;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary) !important;
  border-color: var(--border-primary) !important;
  color: var(--text-secondary) !important;
  box-shadow: var(--shadow-light);

  &:hover {
    opacity: 1;
    background-color: var(--bg-tertiary) !important;
    border-color: var(--accent-primary) !important;
    color: var(--accent-primary) !important;
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &.copied {
    background-color: var(--accent-secondary) !important;
    border-color: var(--accent-secondary) !important;
    color: white !important;
    opacity: 1;

    .check-icon {
      animation: checkmark 0.3s ease-in-out;
    }
  }

  &.error {
    background-color: var(--accent-error) !important;
    border-color: var(--accent-error) !important;
    color: white !important;
    opacity: 1;

    .error-icon {
      animation: shake 0.3s ease-in-out;
    }
  }
}

.copy-label {
  margin-left: 0.25rem;
  font-size: 0.75rem;
}

.code-block {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  border-radius: 8px;
  padding: 1rem;
  padding-top: 2.5rem; /* 为复制按钮留出空间 */
  border: 1px solid var(--border-primary);
  margin: 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--bg-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--border-primary);
    border-radius: 3px;

    &:hover {
      background-color: var(--text-tertiary);
    }
  }

  code {
    font-family: inherit;
    background-color: transparent;
    padding: 0;
    border-radius: 0;

    &.language-javascript,
    &.language-js,
    &.language-typescript,
    &.language-ts {
      .hljs-keyword {
        color: #c678dd;
      }
      .hljs-string {
        color: #98c379;
      }
      .hljs-number {
        color: #d19a66;
      }
      .hljs-comment {
        color: #5c6370;
        font-style: italic;
      }
      .hljs-function {
        color: #61afef;
      }
      .hljs-title {
        color: #e5c07b;
      }
    }
  }
}

.dark {
  .code-block {
    code {
      &.language-javascript,
      &.language-js,
      &.language-typescript,
      &.language-ts {
        .hljs-keyword {
          color: #c678dd;
        }
        .hljs-string {
          color: #98c379;
        }
        .hljs-number {
          color: #d19a66;
        }
        .hljs-comment {
          color: #7f848e;
          font-style: italic;
        }
        .hljs-function {
          color: #61afef;
        }
        .hljs-title {
          color: #e5c07b;
        }
      }
    }
  }
}

/* 成功图标动画 */
@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 错误图标动画 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-copy-btn {
    top: 0.25rem;
    right: 0.25rem;
    padding: 2px 8px !important;

    .copy-label {
      display: none;
    }
  }

  .code-block {
    padding: 0.75rem;
    padding-top: 2rem;
    font-size: 0.8125rem;
  }
}
</style>
