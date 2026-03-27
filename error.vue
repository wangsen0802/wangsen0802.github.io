<script setup lang="ts">
// SEO
useHead({
  title: '404 - 页面未找到',
  meta: [
    { name: 'description', content: '抱歉，您访问的页面不存在' },
  ],
})

// 获取错误信息
const props = defineProps({
  error: {
    type: Object as PropType<{ statusCode: number; message: string }>,
    default: () => ({ statusCode: 404, message: '页面未找到' }),
  },
})

// 判断错误类型
const is404 = computed(() => props.error?.statusCode === 404)
const errorTitle = computed(() => {
  return is404.value ? '404' : `${props.error?.statusCode || 'Error'}`
})
const errorMessage = computed(() => {
  if (props.error?.message) return props.error.message
  return is404.value ? '抱歉，您访问的页面不存在' : '服务器发生错误，请稍后再试'
})

// 处理错误处理函数
const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误代码 -->
      <div class="error-code">
        <span class="code-number">{{ errorTitle }}</span>
        <div class="code-decoration"></div>
      </div>

      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">哎呀！迷路了？</h1>
        <p class="error-description">
          {{ errorMessage }}
        </p>
        <p class="error-tip">
          您可以尝试返回首页，或使用导航菜单查找您需要的内容
        </p>

        <!-- 操作按钮 -->
        <div class="error-actions">
          <a-button type="primary" size="large" @click="handleError">
            <template #icon>
              <span>🏠</span>
            </template>
            返回首页
          </a-button>
          <a-button size="large" @click="$router.back()">
            <template #icon>
              <span>←</span>
            </template>
            返回上一页
          </a-button>
        </div>

        <!-- 快捷链接 -->
        <div class="quick-links">
          <p class="quick-links-title">快速导航</p>
          <div class="quick-links-list">
            <NuxtLink to="/" class="quick-link">
              <span class="link-icon">🏠</span>
              <span class="link-text">首页</span>
            </NuxtLink>
            <NuxtLink to="/posts" class="quick-link">
              <span class="link-icon">📝</span>
              <span class="link-text">文章列表</span>
            </NuxtLink>
            <NuxtLink to="/about" class="quick-link">
              <span class="link-icon">👤</span>
              <span class="link-text">关于我</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="error-background">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
}

.error-code {
  position: relative;
  margin-bottom: 3rem;

  .code-number {
    font-size: 12rem;
    font-weight: 900;
    color: var(--accent-primary);
    display: block;
    line-height: 1;
    letter-spacing: -0.05em;
    text-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  .code-decoration {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--accent-primary),
      transparent
    );
    border-radius: 2px;
  }
}

.error-content {
  .error-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .error-description {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .error-tip {
    font-size: 1rem;
    color: var(--text-tertiary);
    margin-bottom: 2.5rem;
  }
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.quick-links {
  .quick-links-title {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .quick-links-list {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .quick-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    min-width: 120px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--accent-primary);

      .link-icon {
        transform: scale(1.2);
      }

      .link-text {
        color: var(--accent-primary);
      }
    }

    .link-icon {
      font-size: 2rem;
      transition: transform 0.3s ease;
    }

    .link-text {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
      transition: color 0.3s ease;
    }
  }
}

.error-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;

  &.shape-1 {
    width: 300px;
    height: 300px;
    background: var(--accent-primary);
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 200px;
    height: 200px;
    background: var(--accent-secondary);
    bottom: 20%;
    right: 10%;
    animation-delay: 2s;
  }

  &.shape-3 {
    width: 150px;
    height: 150px;
    background: var(--accent-warning);
    top: 50%;
    right: 20%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .error-page {
    padding: 1rem;
  }

  .error-code {
    margin-bottom: 2rem;

    .code-number {
      font-size: 6rem;
    }

    .code-decoration {
      width: 150px;
    }
  }

  .error-content {
    .error-title {
      font-size: 1.75rem;
    }

    .error-description {
      font-size: 1.125rem;
    }
  }

  .error-actions {
    flex-direction: column;
    padding: 0 2rem;

    :deep(.ant-btn) {
      width: 100%;
    }
  }

  .quick-links {
    .quick-links-list {
      flex-direction: column;
      gap: 1rem;
    }

    .quick-link {
      width: 100%;
      flex-direction: row;
      justify-content: center;
      padding: 0.75rem 1rem;
    }
  }

  .floating-shape {
    &.shape-1 {
      width: 150px;
      height: 150px;
    }

    &.shape-2 {
      width: 100px;
      height: 100px;
    }

    &.shape-3 {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
