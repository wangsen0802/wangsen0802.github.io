import { ref } from 'vue'

export interface CodeCopyOptions {
  code: string
  feedbackDuration?: number
}

export function useCodeCopy(options: CodeCopyOptions) {
  const { code, feedbackDuration = 2000 } = options

  const isCopied = ref(false)
  const copyError = ref<string | null>(null)

  /**
   * 复制代码到剪贴板
   */
  const copyToClipboard = async (): Promise<boolean> => {
    try {
      // 使用现代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // 降级方案: 使用传统方法
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (!successful) {
          throw new Error('execCommand failed')
        }
      }

      // 复制成功
      isCopied.value = true
      copyError.value = null

      // 定时重置状态
      setTimeout(() => {
        isCopied.value = false
      }, feedbackDuration)

      return true
    } catch (error) {
      // 复制失败
      console.error('复制失败:', error)
      copyError.value = error instanceof Error ? error.message : '未知错误'
      isCopied.value = false
      return false
    }
  }

  /**
   * 手动重置复制状态
   */
  const resetCopyState = () => {
    isCopied.value = false
    copyError.value = null
  }

  return {
    isCopied,
    copyError,
    copyToClipboard,
    resetCopyState
  }
}

/**
 * 为 DOM 元素添加复制功能的工具函数
 * 用于在 @nuxt/content 渲染的代码块上动态添加复制按钮
 */
export function setupCodeCopyButton(element: HTMLElement): (() => void) | null {
  // 查找代码块
  const preElement = element.tagName === 'PRE' ? element : element.querySelector('pre')
  if (!preElement) return null

  // 查找代码内容
  const codeElement = preElement.querySelector('code')
  if (!codeElement) return null

  const code = codeElement.textContent || ''
  if (!code.trim()) return null

  // 创建复制按钮容器
  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'code-copy-button-container'

  // 创建复制按钮
  const copyButton = document.createElement('button')
  copyButton.className = 'code-copy-button'
  copyButton.type = 'button'
  copyButton.setAttribute('aria-label', '复制代码')
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="display: none;">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `

  buttonContainer.appendChild(copyButton)
  preElement.style.position = 'relative'
  preElement.appendChild(buttonContainer)

  // 复制逻辑
  let timeoutId: NodeJS.Timeout | null = null

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      // 显示成功状态
      copyButton.classList.add('copied')

      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // 2秒后重置状态
      timeoutId = setTimeout(() => {
        copyButton.classList.remove('copied')
      }, 2000)
    } catch (error) {
      console.error('复制失败:', error)
      copyButton.classList.add('error')

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        copyButton.classList.remove('error')
      }, 2000)
    }
  }

  copyButton.addEventListener('click', handleCopy)

  // 返回清理函数
  return () => {
    copyButton.removeEventListener('click', handleCopy)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    buttonContainer.remove()
  }
}
