<template>

  <div
    class="markdown-content"
    v-html="renderedContent"
    ref="contentRef"
  ></div>

</template>

<script setup lang="ts">
import { computed, nextTick, ref, onMounted, watch } from 'vue'
import { parseMarkdown } from '@/utils/markdown'
import { message } from 'ant-design-vue'

interface Props {
  content: string
}

const props = defineProps<Props>()
const contentRef = ref<HTMLElement>()

const renderedContent = computed(() => {
  return parseMarkdown(props.content)
})

// 复制代码功能
const copyCode = async (codeBlock: HTMLElement) => {
  const code = codeBlock.querySelector('code')
  if (code) {
    try {
      await navigator.clipboard.writeText(code.textContent || '')
      message.success('代码已复制到剪贴板')
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = code.textContent || ''
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('代码已复制到剪贴板')
    }
  }
}

// 清理现有的复制按钮
const cleanupCopyButtons = () => {
  if (!contentRef.value) return

  const wrappers = contentRef.value.querySelectorAll('.code-block-wrapper')
  wrappers.forEach(wrapper => {
    const block = wrapper.querySelector('pre.hljs')
    const parent = wrapper.parentNode
    if (block && parent) {
      parent.insertBefore(block, wrapper)
      parent.removeChild(wrapper)
    }
  })
}

// 添加复制按钮
const addCopyButtons = () => {
  if (!contentRef.value) return

  // 先清理现有的复制按钮
  cleanupCopyButtons()

  const codeBlocks = contentRef.value.querySelectorAll('pre.hljs')
  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    wrapper.style.position = 'relative'

    // 创建复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.innerHTML = '复制'
    copyButton.onclick = () => copyCode(block as HTMLElement)

    // 包装原始代码块
    block.parentNode?.insertBefore(wrapper, block)
    wrapper.appendChild(block)
    wrapper.appendChild(copyButton)
  })
}

onMounted(() => {
  nextTick(() => {
    addCopyButtons()
  })
})

// 监听内容变化，重新添加复制按钮
watch(
  () => renderedContent.value,
  () => {
    nextTick(() => {
      addCopyButtons()
    })
  }
)
</script>

<style scoped lang="scss">
.markdown-content {
  line-height: 1.8;
  font-size: 16px;

  :deep(h1) {
    font-size: 2em;
    margin: 0.67em 0;
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--border-primary);
    font-weight: 600;
  }

  :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0 0.5em;
    padding-bottom: 0.2em;
    border-bottom: 1px solid var(--border-primary);
    font-weight: 600;
  }

  :deep(h3) {
    font-size: 1.25em;
    margin: 0.8em 0 0.4em;
    font-weight: 600;
  }

  :deep(h4) {
    font-size: 1.1em;
    margin: 0.6em 0 0.3em;
    font-weight: 600;
  }

  :deep(h5) {
    font-size: 1em;
    margin: 0.5em 0 0.25em;
    font-weight: 600;
  }

  :deep(h6) {
    font-size: 0.9em;
    margin: 0.4em 0 0.2em;
    font-weight: 600;
  }

  :deep(p) {
    margin: 1em 0;
    line-height: 1.8;
  }

  :deep(a) {
    color: var(--accent-primary);
    text-decoration: none;
    border-radius: 2px;
    transition: all 0.2s ease;

    &:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }
  }

  :deep(ul), :deep(ol) {
    margin: 1em 0;
    padding-left: 2em;
  }

  :deep(li) {
    margin: 0.5em 0;
  }

  :deep(blockquote) {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid var(--accent-primary);
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    border-radius: 0 4px 4px 0;
  }

  :deep(code) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    margin: 0 2px;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border-radius: 3px;
    border: 1px solid var(--border-primary);
  }

  :deep(pre) {
    margin: 1.5em 0;
    padding: 0;
    border-radius: 6px;
    overflow-x: auto;
    background-color: var(--bg-tertiary);

    code {
      background-color: transparent;
      border: none;
      padding: 1em;
      margin: 0;
      font-size: 0.9em;
      line-height: 1.5;
      display: block;
      white-space: pre;
      word-wrap: normal;
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 0.9em;
    border: 1px solid var(--border-primary);
    border-radius: 4px;
    overflow: hidden;
  }

  :deep(th), :deep(td) {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border-primary);
    border-right: 1px solid var(--border-primary);

    &:last-child {
      border-right: none;
    }
  }

  :deep(th) {
    background-color: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-primary);
  }

  :deep(td) {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1em 0;
    box-shadow: var(--shadow-light);
  }

  :deep(hr) {
    border: none;
    height: 2px;
    background-color: var(--border-primary);
    margin: 2em 0;
    border-radius: 1px;
  }

  :deep(strong), :deep(b) {
    font-weight: 600;
    color: var(--text-primary);
  }

  :deep(em), :deep(i) {
    font-style: italic;
  }

  :deep(.hljs) {
    background-color: var(--bg-tertiary) !important;
    color: var(--text-primary) !important;
  }

  // 代码块包装器和复制按钮
  :deep(.code-block-wrapper) {
    position: relative;
    margin: 1.5em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-primary);
    background-color: var(--bg-tertiary);

    .copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 10;
      font-family: inherit;

      &:hover {
        background: var(--accent-secondary);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &:hover {
      border-color: var(--accent-primary);

      .copy-button {
        opacity: 1;
      }
    }

    pre {
      margin: 0;
      border-radius: 0;
      border: none;
      background: transparent;
    }
  }
}
</style>

