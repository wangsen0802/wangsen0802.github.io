import { ref, watch } from 'vue'

export interface TypewriterOptions {
  text: string | string[]
  speed?: number
  initialDelay?: number
  loopDelay?: number
  loop?: boolean
  cursor?: boolean
}

export function useTypewriter(options: TypewriterOptions) {
  const {
    text,
    speed = 100,
    initialDelay = 0,
    loopDelay = 2000,
    loop = false,
    cursor = true
  } = options

  const displayText = ref('')
  const currentIndex = ref(0)
  const isTyping = ref(false)
  const isDeleting = ref(false)
  const textArray = Array.isArray(text) ? text : [text]
  const currentTextIndex = ref(0)
  const isFirstRun = ref(true)

  const typeChar = () => {
    const currentText = textArray[currentTextIndex.value]

    if (!isDeleting.value) {
      // 打字阶段
      if (currentIndex.value < currentText.length) {
        displayText.value += currentText[currentIndex.value]
        currentIndex.value++
        setTimeout(typeChar, speed)
      } else {
        // 打字完成，等待后开始删除（如果循环）
        if (loop) {
          // 使用不同的延时：首次运行用 initialDelay，后续用 loopDelay
          const delay = isFirstRun.value ? initialDelay : loopDelay
          setTimeout(() => {
            isDeleting.value = true
            isFirstRun.value = false
            typeChar()
          }, delay)
        } else {
          isTyping.value = false
        }
      }
    } else {
      // 删除阶段
      if (currentIndex.value > 0) {
        displayText.value = currentText.substring(0, currentIndex.value - 1)
        currentIndex.value--
        setTimeout(typeChar, speed / 2)
      } else {
        // 删除完成，切换到下一个文本（如果是多文本）或重新开始（单文本）
        isDeleting.value = false
        if (textArray.length > 1) {
          currentTextIndex.value = (currentTextIndex.value + 1) % textArray.length
        }
        setTimeout(typeChar, 500)
      }
    }
  }

  const start = () => {
    if (initialDelay > 0) {
      setTimeout(() => {
        isTyping.value = true
        typeChar()
      }, initialDelay)
    } else {
      isTyping.value = true
      typeChar()
    }
  }

  const reset = () => {
    displayText.value = ''
    currentIndex.value = 0
    currentTextIndex.value = 0
    isTyping.value = false
    isDeleting.value = false
    isFirstRun.value = true
  }

  const restart = () => {
    reset()
    start()
  }

  // 监听文本变化，重新开始
  watch(
    () => options.text,
    () => {
      reset()
      start()
    },
    { deep: true }
  )

  return {
    displayText,
    isTyping,
    start,
    reset,
    restart
  }
}