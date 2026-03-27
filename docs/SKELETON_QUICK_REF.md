# 骨架屏组件快速参考

## 📦 组件清单

| 组件 | 路径 | 用途 |
|------|------|------|
| PostCardSkeleton | `/components/skeleton/PostCardSkeleton.vue` | 文章列表页骨架屏 |
| PostDetailSkeleton | `/components/skeleton/PostDetailSkeleton.vue` | 文章详情页骨架屏 |

## 🚀 快速使用

### 文章列表页

```vue
<template>
  <div class="posts-grid">
    <PostCardSkeleton v-for="i in 6" :key="i" v-if="pending" />
    <article v-else v-for="post in posts" :key="post.path">
      <!-- 实际内容 -->
    </article>
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useAsyncData('posts', () =>
  queryCollection('content').all()
)
</script>
```

### 文章详情页

```vue
<template>
  <PostDetailSkeleton v-if="pending" />
  <article v-else-if="post">
    <!-- 实际内容 -->
  </article>
</template>

<script setup lang="ts">
const { data: post, pending } = await useAsyncData('post', () =>
  queryCollection('content').where('path', path).first()
)
</script>
```

## 🎨 特性

✅ **自动主题适配** - 支持暗色/亮色模式
✅ **流畅动画** - Shimmer 渐变光效
✅ **响应式设计** - 移动端优化
✅ **零配置** - 开箱即用
✅ **TypeScript** - 完整类型支持

## 📱 演示页面

访问 `/skeleton-demo` 查看实时演示和详细文档。

## 📚 文档

详细使用指南：`/docs/SKELETON_USAGE.md`

## 🔧 技术栈

- Vue 3 Composition API
- TypeScript
- SCSS
- CSS 动画 (@keyframes)
- CSS 变量 (主题适配)

## 💡 提示

1. 使用 `v-if` 而非 `v-show` 以提升性能
2. 根据页面布局调整骨架屏数量
3. 确保骨架屏结构与实际内容一致
4. 测试不同网络速度下的加载效果

## 📄 相关文件

- `components/skeleton/PostCardSkeleton.vue` - 文章卡片骨架屏
- `components/skeleton/PostDetailSkeleton.vue` - 文章详情骨架屏
- `pages/skeleton-demo.vue` - 演示页面
- `docs/SKELETON_USAGE.md` - 详细文档
- `assets/styles/main.scss` - 主题变量定义
