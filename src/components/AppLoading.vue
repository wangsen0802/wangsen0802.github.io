<template>

  <div
    class="app-loading"
    :class="{ 'app-loading--dark': isDarkTheme }"
  >

    <div class="app-loading__container">
       <!-- Logo 区域 -->
      <div class="app-loading__logo">

        <div class="app-loading__logo-text"> wanGISen </div>

        <div class="app-loading__logo-subtitle"> 个人技术博客 </div>

      </div>
       <!-- 加载动画 -->
      <div class="app-loading__spinner"> <a-spin size="large" /> </div>
       <!-- 加载文字 -->
      <div class="app-loading__text">

        <div class="app-loading__title">{{ loadingTitle }}</div>

        <div class="app-loading__subtitle">{{ loadingSubtitle }}</div>

      </div>
       <!-- 进度条 -->
      <div class="app-loading__progress">

        <div
          class="app-loading__progress-bar"
          :style="{ width: `${progress}%` }"
        ></div>

      </div>

    </div>
     <!-- 背景装饰 -->
    <div class="app-loading__background">

      <div class="app-loading__particles">

        <div
          v-for="i in 20"
          :key="i"
          class="app-loading__particle"
          :style="getParticleStyle(i)"
        ></div>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores'

// 组件使用store中的状态，不需要props

const appStore = useAppStore()

// 响应式数据
const progress = ref(0)
const loadingPhase = ref(0)

// 计算属性
const isDarkTheme = computed(() => appStore.currentTheme === 'dark')

const loadingTitle = computed(() => {
  // 根据用户类型和跳过状态显示不同文案
  if (appStore.shouldSkipLoading) {
    return '快速启动中'
  }

  if (appStore.isPerformanceMode) {
    return '性能模式'
  }

  const titles = ['正在初始化', '加载资源中', '准备就绪']
  return titles[Math.max(0, Math.min(loadingPhase.value, titles.length - 1))]
})

const loadingSubtitle = computed(() => {
  // 根据用户类型和跳过状态显示不同文案
  if (appStore.shouldSkipLoading) {
    return '欢迎回来！'
  }

  if (appStore.isPerformanceMode) {
    return '使用缓存资源'
  }

  if (appStore.isFirstVisit) {
    return '首次访问，正在准备...'
  }

  const subtitles = ['正在启动应用...', '正在加载组件和样式...', '即将完成...']
  return subtitles[Math.max(0, Math.min(loadingPhase.value, subtitles.length - 1))]
})

// 方法
const getParticleStyle = (_index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 3
  const randomDuration = 3 + Math.random() * 4

  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

const simulateProgress = () => {
  // 根据加载模式调整进度参数
  let phases
  if (appStore.shouldSkipLoading || appStore.isPerformanceMode) {
    // 快速模式：更短的阶段和更快的进度
    phases = [
      { targetProgress: 50, phaseNumber: 0, duration: 200 },
      { targetProgress: 100, phaseNumber: 1, duration: 300 }
    ]
  } else {
    // 正常模式：完整的加载流程
    phases = [
      { targetProgress: 30, phaseNumber: 0, duration: 800 },
      { targetProgress: 70, phaseNumber: 1, duration: 1200 },
      { targetProgress: 95, phaseNumber: 2, duration: 1000 }
    ]
  }

  let currentPhaseIndex = 0

  const nextPhase = () => {
    if (currentPhaseIndex < phases.length) {
      // TypeScript 安全断言：由于我们检查了数组边界，这里不会是 undefined
      const currentPhase = phases[currentPhaseIndex]!
      loadingPhase.value = currentPhase.phaseNumber

      // 渐进式进度增长
      const startProgress = progress.value
      const progressDiff = currentPhase.targetProgress - startProgress
      const steps = appStore.shouldSkipLoading ? 10 : 30 // 快速模式减少步数
      const stepDuration = currentPhase.duration / steps
      let step = 0

      const interval = setInterval(() => {
        step++
        progress.value = startProgress + (progressDiff * step) / steps

        if (step >= steps) {
          clearInterval(interval)
          currentPhaseIndex++

          // 短暂停顿后进入下一阶段
          const pauseDuration = appStore.shouldSkipLoading ? 50 : 200
          if (currentPhaseIndex < phases.length) {
            setTimeout(nextPhase, pauseDuration)
          } else {
            // 最后阶段处理
            if (appStore.shouldSkipLoading || appStore.isPerformanceMode) {
              // 快速模式直接完成
              progress.value = 100
            } else {
              // 正常模式缓慢到 100%
              setTimeout(() => {
                const finalInterval = setInterval(() => {
                  if (progress.value < 100) {
                    progress.value += 1
                  } else {
                    clearInterval(finalInterval)
                  }
                }, 50)
              }, 500)
            }
          }
        }
      }, stepDuration)
    }
  }

  nextPhase()
}

// 生命周期
onMounted(() => {
  simulateProgress()
})
</script>

<style scoped lang="scss">
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;

  // 暗色主题
  &--dark {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  &__container {
    text-align: center;
    z-index: 10;
    animation: fadeInUp 0.8s ease-out;
  }

  &__logo {
    margin-bottom: 3rem;

    &-text {
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
      animation: glow 2s ease-in-out infinite alternate;
    }

    &-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 300;
      letter-spacing: 1px;
    }
  }

  &__spinner {
    margin-bottom: 2.5rem;

    :deep(.ant-spin) {
      .ant-spin-dot {
        i {
          background-color: white;
          width: 12px;
          height: 12px;
        }
      }
    }
  }

  &__text {
    margin-bottom: 2rem;

    .app-loading__title {
      font-size: 1.4rem;
      color: white;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .app-loading__subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
    }
  }

  &__progress {
    width: 300px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
    backdrop-filter: blur(10px);
  }

  &__progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__particles {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3),
                 0 0 20px rgba(255, 255, 255, 0.2);
  }
  to {
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3),
                 0 0 30px rgba(255, 255, 255, 0.4),
                 0 0 40px rgba(79, 172, 254, 0.3);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .app-loading {
    &__logo-text {
      font-size: 2.5rem;
    }

    &__logo-subtitle {
      font-size: 1rem;
    }

    &__text {
      .app-loading__title {
        font-size: 1.2rem;
      }

      .app-loading__subtitle {
        font-size: 0.9rem;
      }
    }

    &__progress {
      width: 250px;
    }
  }
}

@media (max-width: 480px) {
  .app-loading {
    &__logo-text {
      font-size: 2rem;
    }

    &__progress {
      width: 200px;
    }
  }
}
</style>

