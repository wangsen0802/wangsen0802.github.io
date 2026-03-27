<template>
  <article class="post-card-skeleton">
    <!-- 封面图骨架 -->
    <div class="skeleton-cover" />

    <!-- 内容区域骨架 -->
    <div class="skeleton-content">
      <!-- 元信息骨架 -->
      <div class="skeleton-meta">
        <div class="skeleton-line skeleton-category" />
        <div class="skeleton-line skeleton-date" />
      </div>

      <!-- 标题骨架 -->
      <div class="skeleton-title">
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>

      <!-- 描述骨架 -->
      <div class="skeleton-description">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
      </div>

      <!-- 标签骨架 -->
      <div class="skeleton-tags">
        <div class="skeleton-tag" />
        <div class="skeleton-tag" />
        <div class="skeleton-tag medium" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
// 文章卡片骨架屏组件
// 用于在文章列表页加载时显示占位内容
</script>

<style scoped lang="scss">
.post-card-skeleton {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  overflow: hidden;
  animation: pulse 1.5s ease-in-out infinite;
}

// 封面图骨架
.skeleton-cover {
  height: 180px;
  width: 100%;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

// 内容区域
.skeleton-content {
  padding: 1.25rem;
}

// 元信息骨架
.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;

  &.short {
    width: 60%;
  }

  &.medium {
    width: 75%;
  }
}

.skeleton-category {
  width: 80px;
  height: 16px;
}

.skeleton-date {
  width: 100px;
  height: 16px;
}

// 标题骨架
.skeleton-title {
  margin-bottom: 0.5rem;

  .skeleton-line {
    height: 24px;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 描述骨架
.skeleton-description {
  margin-bottom: 0.75rem;

  .skeleton-line {
    height: 16px;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 标签骨架
.skeleton-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skeleton-tag {
  height: 28px;
  width: 60px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;

  &.medium {
    width: 80px;
  }
}

// Shimmer 动画效果
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// 脉冲动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .skeleton-cover {
    height: 160px;
  }

  .skeleton-content {
    padding: 1rem;
  }
}
</style>
