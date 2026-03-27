# 骨架屏组件使用指南

## 概述

项目中包含两个骨架屏组件，用于在数据加载时提供良好的用户体验：

1. **PostCardSkeleton** - 文章卡片骨架屏
2. **PostDetailSkeleton** - 文章详情骨架屏

## 组件特性

### 通用特性
- ✅ 使用 Vue 3 Composition API (`<script setup>`)
- ✅ TypeScript 类型支持
- ✅ CSS 渐变动画 (shimmer 效果)
- ✅ 暗色/亮色主题自动适配
- ✅ 响应式设计（移动端优化）
- ✅ 流畅的加载动画

### 动画效果
- **Shimmer 动画**: 从左到右的渐变光效，模拟数据加载
- **Pulse 动画**: 整体透明度变化，增强视觉反馈

## PostCardSkeleton 组件

### 用途
用于文章列表页 (`/pages/posts/index.vue`)，在文章数据加载时显示占位内容。

### 布局结构
```
┌─────────────────────┐
│   封面图区域 (180px) │
├─────────────────────┤
│ [分类]      [日期]  │  ← 元信息
│                     │
│ 标题行第一行         │  ← 标题
│ 标题行第二行（短）   │
│                     │
│ 描述行第一行         │  ← 描述
│ 描述行第二行         │
│                     │
│ [标签] [标签] [标签]│  ← 标签
└─────────────────────┘
```

### 使用示例

```vue
<template>
  <div class="posts-page">
    <!-- 数据加载中：显示骨架屏 -->
    <div v-if="pending" class="posts-grid">
      <PostCardSkeleton
        v-for="i in 6"
        :key="`skeleton-${i}`"
      />
    </div>

    <!-- 数据加载完成：显示实际内容 -->
    <div v-else class="posts-grid">
      <article v-for="post in posts" :key="post.path" class="post-card">
        <!-- 文章内容 -->
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取文章数据（带加载状态）
const { data: posts, pending } = await useAsyncData('all-posts', () =>
  queryCollection('content')
    .order('date', 'DESC')
    .all()
)
</script>
```

## PostDetailSkeleton 组件

### 用途
用于文章详情页 (`/pages/posts/[...slug].vue`)，在文章内容加载时显示占位内容。

### 布局结构
```
┌─────────────────────────────┐
│ [分类]           [日期]     │  ← 元信息
│                             │
│ 标题行第一行                 │  ← 标题
│ 标题行第二行（中等）         │
│                             │
│ 描述行第一行                 │  ← 描述
│ 描述行第二行                 │
│ 描述行第三行（短）           │
│                             │
│ [标签] [标签] [标签] [标签] │  ← 标签
├─────────────────────────────┤
│ 正文段落第一行               │
│ 正文段落第二行               │
│ 正文段落第三行               │
│ 正文段落第四行（中等）       │
│                             │
│ 正文段落第一行               │
│ 正文段落第二行（短）         │
│                             │
│ ┌─────────────────────┐    │  ← 代码块
│ │ 代码行第一行         │    │
│ │ 代码行第二行         │    │
│ │ 代码行第三行         │    │
│ │ 代码行第四行（中等） │    │
│ └─────────────────────┘    │
│                             │
│ 小标题行                     │  ← 小标题
│                             │
│ 正文段落...                 │
├─────────────────────────────┤
│ 作者：王森                  │  ← 底部信息
│ 更新于：2026-03-28          │
│              ← 返回文章列表  │
└─────────────────────────────┘
```

### 使用示例

```vue
<template>
  <article class="post-detail">
    <!-- 数据加载中：显示骨架屏 -->
    <PostDetailSkeleton v-if="pending" />

    <!-- 数据加载完成：显示实际内容 -->
    <template v-else-if="post">
      <header class="post-header">
        <div class="post-meta">
          <span class="post-category">{{ post.category }}</span>
          <span class="post-date">{{ post.date }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-description">{{ post.description }}</p>
      </header>

      <div class="post-content markdown-content">
        <ContentRenderer :value="post" />
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const path = route.params.slug as string[]

// 获取文章内容（带加载状态）
const { data: post, pending } = await useAsyncData(
  `post-${path.join('/')}`,
  () => queryCollection('content')
    .where('path', `/${path.join('/')}`)
    .first()
)
</script>
```

## 主题适配

骨架屏组件使用 CSS 变量自动适配主题：

### 亮色主题
```scss
--bg-secondary: #f8f9fa;     // 背景色
--bg-tertiary: #e9ecef;      // 骨架线颜色
--border-primary: #dee2e6;   // 边框颜色
```

### 暗色主题
```scss
--bg-secondary: #1f1f1f;     // 背景色
--bg-tertiary: #262626;      // 骨架线颜色
--border-primary: #434343;   // 边框颜色
```

## 样式定制

### 修改动画速度

在组件的 `<style>` 部分修改 `animation-duration`：

```scss
// 默认 1.5s
animation: shimmer 1.5s ease-in-out infinite;

// 更快的动画（1s）
animation: shimmer 1s ease-in-out infinite;

// 更慢的动画（2s）
animation: shimmer 2s ease-in-out infinite;
```

### 修改骨架屏数量

根据页面布局调整显示的骨架屏数量：

```vue
<!-- 文章列表页：显示 6 个骨架屏 -->
<PostCardSkeleton v-for="i in 6" :key="`skeleton-${i}`" />

<!-- 移动端：显示 3 个骨架屏 -->
<PostCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
```

## 性能优化

### 1. 避免不必要的重渲染
骨架屏组件是静态的，没有响应式数据，不会触发不必要的重渲染。

### 2. CSS 动画优化
使用 `transform` 和 `opacity` 属性，这些属性由 GPU 加速，不会引起重排。

### 3. 条件渲染
使用 `v-if` 而非 `v-show`，在数据加载完成后完全移除骨架屏 DOM：

```vue
<!-- ✅ 推荐：完全移除 DOM -->
<PostDetailSkeleton v-if="pending" />

<!-- ❌ 不推荐：保留 DOM 但隐藏 -->
<PostDetailSkeleton v-show="pending" />
```

## 响应式断点

组件在移动端（< 768px）自动调整尺寸：

### PostCardSkeleton
- 封面图高度：180px → 160px
- 内边距：1.25rem → 1rem

### PostDetailSkeleton
- 标题行高度：36px → 28px
- 描述行高度：20px → 16px
- 底部布局：横向 → 纵向

## 可访问性

骨架屏组件使用语义化的 HTML 标签：
- `<article>` 表示文章内容
- `<header>` 表示文章头部
- `<footer>` 表示文章底部

这有助于屏幕阅读器理解页面结构。

## 测试建议

### 1. 测试加载状态
使用浏览器开发工具模拟慢速网络：
1. 打开 DevTools (F12)
2. 切换到 Network 面板
3. 选择 "Slow 3G" 或自定义限速
4. 刷新页面查看骨架屏效果

### 2. 测试主题切换
1. 打开页面
2. 切换暗色/亮色主题
3. 验证骨架屏颜色是否正确适配

### 3. 测试响应式
1. 打开浏览器开发者工具
2. 切换设备模拟（移动端/平板/桌面）
3. 验证骨架屏布局是否正确

## 最佳实践

### ✅ DO
- 在数据加载时立即显示骨架屏
- 根据实际内容布局设计骨架屏结构
- 使用合理的骨架屏数量（3-6 个）
- 确保骨架屏与实际内容布局一致

### ❌ DON'T
- 不要在数据已加载后仍显示骨架屏
- 不要使用过多骨架屏造成视觉混乱
- 不要忽略移动端适配
- 不要使用过于复杂的动画效果

## 故障排查

### 问题：骨架屏不显示
**可能原因**：`pending` 状态未正确获取
**解决方案**：确保使用 `useAsyncData` 并正确解构 `pending` 状态

### 问题：骨架屏颜色不对
**可能原因**：CSS 变量未定义
**解决方案**：检查 `assets/styles/main.scss` 中是否定义了主题变量

### 问题：动画卡顿
**可能原因**：设备性能较低或动画过于复杂
**解决方案**：简化动画或增加 `animation-duration`

## 相关文件

- `/components/skeleton/PostCardSkeleton.vue` - 文章卡片骨架屏
- `/components/skeleton/PostDetailSkeleton.vue` - 文章详情骨架屏
- `/assets/styles/main.scss` - 主题 CSS 变量定义
- `/pages/posts/index.vue` - 文章列表页（使用示例）
- `/pages/posts/[...slug].vue` - 文章详情页（使用示例）
