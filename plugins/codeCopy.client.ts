import { setupCodeCopyButton } from '~/composables/useCodeCopy'

/**
 * 代码复制插件
 * 自动为 @nuxt/content 渲染的代码块添加复制按钮
 */
export default defineNuxtPlugin((nuxtApp) => {
  // 使用 MutationObserver 监听 DOM 变化
  // 当新的代码块被添加到页面时，自动为其添加复制按钮
  const addCopyButtonsToCodeBlocks = () => {
    // 查找所有还没有复制按钮的代码块
    const codeBlocks = document.querySelectorAll('.prose pre:not(.has-copy-button)')

    codeBlocks.forEach((pre) => {
      if (!(pre instanceof HTMLElement)) return

      // 标记已处理
      pre.classList.add('has-copy-button')

      // 添加复制按钮
      const cleanup = setupCodeCopyButton(pre)

      // 保存清理函数到元素上，以便在元素被移除时清理
      if (cleanup) {
        ;(pre as any)._codeCopyCleanup = cleanup
      }
    })
  }

  // 初始添加
  if (process.client) {
    // 等待 DOM 加载完成
    nuxtApp.hook('page:finish', () => {
      // 使用 requestAnimationFrame 确保在渲染后执行
      requestAnimationFrame(() => {
        addCopyButtonsToCodeBlocks()
      })
    })

    // 监听 DOM 变化（用于动态加载的内容）
    const observer = new MutationObserver((mutations) => {
      let shouldAddButtons = false

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // 检查添加的节点是否包含代码块
            if (
              node.querySelector?.('pre') ||
              node.tagName === 'PRE' ||
              node.classList?.contains('prose')
            ) {
              shouldAddButtons = true
            }
          }
        })
      })

      if (shouldAddButtons) {
        requestAnimationFrame(() => {
          addCopyButtonsToCodeBlocks()
        })
      }
    })

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // 清理观察器
    nuxtApp.hook('app:unmounted', () => {
      observer.disconnect()
    })
  }
})
