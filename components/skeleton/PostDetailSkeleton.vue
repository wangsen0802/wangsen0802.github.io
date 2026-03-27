<template>
  <article class="post-detail-skeleton">
    <!-- 文章头部骨架 -->
    <header class="skeleton-header">
      <!-- 元信息骨架 -->
      <div class="skeleton-meta">
        <div class="skeleton-line skeleton-category" />
        <div class="skeleton-line skeleton-date" />
      </div>

      <!-- 标题骨架 -->
      <div class="skeleton-title">
        <div class="skeleton-line" />
        <div class="skeleton-line medium" />
      </div>

      <!-- 描述骨架 -->
      <div class="skeleton-description">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>

      <!-- 标签骨架 -->
      <div class="skeleton-tags">
        <div class="skeleton-tag" />
        <div class="skeleton-tag" />
        <div class="skeleton-tag medium" />
        <div class="skeleton-tag" />
      </div>
    </header>

    <!-- 文章内容骨架 -->
    <div class="skeleton-content">
      <!-- 第一段 -->
      <div class="skeleton-paragraph">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line medium" />
      </div>

      <!-- 第二段 -->
      <div class="skeleton-paragraph">
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>

      <!-- 代码块骨架 -->
      <div class="skeleton-code-block">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line medium" />
      </div>

      <!-- 第三段 -->
      <div class="skeleton-paragraph">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>

      <!-- 标题骨架 -->
      <div class="skeleton-heading">
        <div class="skeleton-line" />
      </div>

      <!-- 第四段 -->
      <div class="skeleton-paragraph">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
      </div>
    </div>

    <!-- 文章底部骨架 -->
    <footer class="skeleton-footer">
      <div class="skeleton-author">
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>
      <div class="skeleton-back-link" />
    </footer>
  </article>
</template>

<script setup lang="ts">
// 文章详情骨架屏组件
// 用于在文章详情页加载时显示占位内容
</script>

<style scoped lang="scss">
.post-detail-skeleton {
  max-width: 800px;
  margin: 0 auto;
  animation: pulse 1.5s ease-in-out infinite;
}

// 文章头部骨架
.skeleton-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

// 元信息骨架
.skeleton-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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
  width: 120px;
  height: 16px;
}

// 标题骨架
.skeleton-title {
  margin-bottom: 1rem;

  .skeleton-line {
    height: 36px;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 描述骨架
.skeleton-description {
  margin-bottom: 1rem;

  .skeleton-line {
    height: 20px;
    margin-bottom: 0.75rem;

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
  height: 32px;
  width: 70px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 16px;

  &.medium {
    width: 90px;
  }
}

// 文章内容骨架
.skeleton-content {
  padding: 1rem 0;
  min-height: 300px;
}

.skeleton-paragraph {
  margin-bottom: 1.5rem;

  .skeleton-line {
    height: 18px;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.skeleton-code-block {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;

  .skeleton-line {
    height: 16px;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.skeleton-heading {
  margin: 2rem 0 1rem;

  .skeleton-line {
    height: 28px;
    width: 50%;
  }
}

// 文章底部骨架
.skeleton-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-author {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .skeleton-line {
    width: 150px;
    height: 16px;
  }
}

.skeleton-back-link {
  width: 120px;
  height: 20px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
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
  .skeleton-title {
    .skeleton-line {
      height: 28px;
    }
  }

  .skeleton-description {
    .skeleton-line {
      height: 16px;
    }
  }

  .skeleton-paragraph {
    .skeleton-line {
      height: 16px;
    }
  }

  .skeleton-code-block {
    padding: 1rem;

    .skeleton-line {
      height: 14px;
    }
  }

  .skeleton-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
