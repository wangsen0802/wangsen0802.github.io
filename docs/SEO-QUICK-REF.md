# SEO 快速参考指南

## 快速开始

### 1. 为新页面添加 SEO

```vue
<script setup lang="ts">
// 基础页面
useSeo({
  title: '页面标题',
  description: '页面描述（150-160 字符）',
  keywords: ['关键词1', '关键词2'],
  type: 'website',
})

// 文章页面
useArticleSeo({
  title: '文章标题',
  description: '文章描述',
  date: '2026-03-28',
  tags: ['标签1', '标签2'],
  category: '分类',
})

// 列表页面
useListSeo('列表页标题', '列表页描述')
</script>
```

### 2. 验证 Meta 标签

```javascript
// 浏览器控制台
document.querySelectorAll('meta').forEach(meta => {
  const key = meta.name || meta.property
  if (key && meta.content) {
    console.log(`${key}: ${meta.content}`)
  }
})
```

## 常用配置

### 首页配置
```typescript
useSeo({
  title: 'wanGISen - 技术博客',
  description: '个人技术博客，专注于 Vue.js、Nuxt 3、TypeScript...',
  keywords: ['Vue.js', 'Nuxt 3', 'TypeScript', 'GIS', '前端开发'],
  type: 'website',
})
```

### 博客文章配置
```typescript
useArticleSeo({
  title: post.title,
  description: post.description,
  date: post.date,
  updated: post.updated,
  author: post.author,
  tags: post.tags,
  cover: post.cover,
  category: post.category,
})
```

### 分类页面配置
```typescript
useSeo({
  title: `${categoryName} - 文章分类`,
  description: `浏览 ${categoryName} 分类下的所有文章`,
  keywords: [categoryName, '技术文章', '博客'],
  type: 'website',
})
```

## 最佳实践

### 标题优化
- **长度**: 50-60 字符
- **格式**: `关键词 | 品牌名称` 或 `品牌名称 | 关键词`
- **示例**: `"Vue 3 Composition API 教程 | wanGISen"`

### 描述优化
- **长度**: 150-160 字符
- **内容**: 包含主要关键词和价值主张
- **示例**: `"深入了解 Vue 3 Composition API 的使用方法和最佳实践，提升前端开发效率"`

### 关键词优化
- **数量**: 每页 3-5 个主要关键词
- **分布**: 标题、描述、内容中自然分布
- **避免**: 关键词堆砌

## 常见问题

### Q: 如何添加自定义 Meta 标签？
```vue
<script setup lang="ts">
useSeo({ ... })
useHead({
  meta: [
    { name: 'custom-tag', content: 'value' },
  ],
})
</script>
```

### Q: 如何设置不同的语言？
```vue
<script setup lang="ts">
const { locale } = useI18n()
const title = locale.value === 'zh' ? '中文标题' : 'English Title'
useSeo({ title })
</script>
```

### Q: 如何更新社交分享图片？
```typescript
useSeo({
  image: '/custom-og-image.png', // 或完整 URL
})
```

## 验证工具

### 在线工具
- **Google**: https://search.google.com/test/rich-results
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

### 浏览器扩展
- **SEO Meta in 1 Click** (Chrome)
- **Open Graph Preview** (Firefox)

## 检查清单

### 发布前检查
- [ ] 页面标题唯一且描述准确
- [ ] 描述长度在 150-160 字符
- [ ] 关键词自然融入内容
- [ ] Open Graph 标签完整
- [ ] Twitter Card 标签完整
- [ ] 分享图片尺寸正确 (1200x630px)
- [ ] 所有链接可访问

### 定期检查
- [ ] 搜索引擎收录状态
- [ ] 关键词排名变化
- [ ] 社交分享预览效果
- [ ] Core Web Vitals 性能

## 相关文件

| 文件 | 说明 |
|------|------|
| `nuxt.config.ts` | 全局 SEO 配置 |
| `composables/useSeo.ts` | SEO 工具函数 |
| `docs/SEO.md` | 完整 SEO 文档 |
| `public/og-image.md` | 分享图片设计指南 |

## 获取帮助

- 查看 `docs/SEO.md` 获取详细文档
- 查看 `docs/SEO-SUMMARY.md` 了解实施详情
- 访问 [Nuxt 3 SEO 文档](https://nuxt.com/docs/guide/seo-meta)

---

**最后更新**: 2026-03-28
