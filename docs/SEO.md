# SEO 优化文档

本文档说明 Nuxt 3 博客项目的 SEO 优化实现。

## 实现概览

项目已实现完整的 SEO 优化，包括：

1. **全局 SEO 配置** (`nuxt.config.ts`)
2. **可复用的 SEO 工具函数** (`composables/useSeo.ts`)
3. **页面级 SEO 配置** (所有页面)
4. **Open Graph 和 Twitter Card 支持**

## 文件结构

```
├── nuxt.config.ts                    # 全局 SEO 配置
├── composables/
│   └── useSeo.ts                     # SEO 工具函数
├── pages/
│   ├── index.vue                     # 首页 SEO
│   ├── about.vue                     # 关于页 SEO
│   └── posts/
│       ├── index.vue                 # 文章列表页 SEO
│       └── [...slug].vue             # 文章详情页动态 SEO
└── public/
    └── og-image.md                   # Open Graph 图片设计指南
```

## 1. 全局配置 (nuxt.config.ts)

### 站点 URL
```typescript
runtimeConfig: {
  public: {
    siteUrl: 'https://wangsen0802.github.io',
  },
}
```

### 默认 Meta 标签
```typescript
app: {
  head: {
    title: 'wanGISen - 技术博客',
    meta: [
      { name: 'description', content: '...' },
      { name: 'keywords', content: '...' },
      { name: 'author', content: '王森' },
      // Open Graph
      { property: 'og:site_name', content: 'wanGISen' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_CN' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@wangsen0802' },
    ],
  },
}
```

## 2. SEO 工具函数 (composables/useSeo.ts)

### useSeo(options)
生成完整的 SEO 配置。

**参数：**
```typescript
interface SeoOptions {
  title?: string          // 页面标题
  description?: string    // 页面描述
  image?: string          // 分享图片
  type?: 'website' | 'article'  // 页面类型
  keywords?: string[]     // 关键词数组
  author?: string         // 作者
  publishDate?: string    // 发布日期
  modifiedDate?: string   // 修改日期
}
```

**使用示例：**
```vue
<script setup lang="ts">
useSeo({
  title: '首页',
  description: '...',
  keywords: ['Vue.js', 'Nuxt 3'],
  type: 'website',
})
</script>
```

### useArticleSeo(post)
专门用于文章页面的 SEO 配置。

**参数：**
```typescript
{
  title: string
  description: string
  date?: string
  updated?: string
  author?: string
  tags?: string[]
  cover?: string
  category?: string
}
```

**使用示例：**
```vue
<script setup lang="ts">
const { data: post } = await useAsyncData('post', fetchPost)
useArticleSeo(post.value)
</script>
```

### useListSeo(title, description)
用于列表页面的 SEO 配置。

**使用示例：**
```vue
<script setup lang="ts">
useListSeo('文章列表', '浏览所有技术文章')
</script>
```

## 3. 页面级 SEO 实现

### 首页 (pages/index.vue)
```vue
<script setup lang="ts">
useSeo({
  title: 'wanGISen - 技术博客',
  description: '个人技术博客，专注于 Vue.js、Nuxt 3、TypeScript...',
  keywords: ['Vue.js', 'Nuxt 3', 'TypeScript', 'GIS', ...],
  type: 'website',
})
</script>
```

### 文章列表页 (pages/posts/index.vue)
```vue
<script setup lang="ts">
const { data: posts } = await useAsyncData('all-posts', ...)
const postCount = computed(() => posts.value?.length || 0)

useSeo({
  title: '文章列表',
  description: `浏览全部 ${postCount.value} 篇技术文章...`,
  keywords: ['技术文章', '前端开发', ...],
  type: 'website',
})
</script>
```

### 文章详情页 (pages/posts/[...slug].vue)
```vue
<script setup lang="ts">
const { data: post } = await useAsyncData('post', ...)

useArticleSeo({
  title: post.value?.title,
  description: post.value?.description,
  date: post.value?.date,
  updated: post.value?.updated,
  author: post.value?.author,
  tags: post.value?.tags,
  cover: post.value?.cover,
  category: post.value?.category,
})
</script>
```

## 4. 自动生成的 Meta 标签

### 基础 SEO
- `title`: 页面标题
- `description`: 页面描述
- `keywords`: 关键词（逗号分隔）
- `author`: 作者信息

### Open Graph
- `og:title`: 标题
- `og:description`: 描述
- `og:image`: 分享图片
- `og:url`: 页面 URL
- `og:type`: 页面类型（website/article）
- `og:site_name`: 站点名称
- `og:locale`: 语言设置

### Twitter Card
- `twitter:title`: 标题
- `twitter:description`: 描述
- `twitter:image`: 分享图片
- `twitter:card`: 卡片类型（summary_large_image）
- `twitter:site`: Twitter 账号

### 文章专用（article 类型）
- `article:author`: 文章作者
- `article:published_time`: 发布时间
- `article:modified_time`: 修改时间

### 链接
- `canonical`: 规范链接

## 5. Open Graph 图片

### 推荐
- **尺寸**: 1200x630px
- **比例**: 1.91:1
- **格式**: PNG 或 JPG
- **大小**: 小于 8MB

### 设计指南
参见 `public/og-image.md`

## 6. 验证和测试

### 在线验证工具
1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - 验证结构化数据和富媒体搜索结果

2. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - 验证 Open Graph 标签和分享预览

3. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - 验证 Twitter Card 标签

4. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - 验证 LinkedIn 分享预览

### 本地测试
```bash
# 启动开发服务器
pnpm run dev

# 访问页面并检查源代码
# 查看生成的 meta 标签
```

### Chrome DevTools
```javascript
// 在浏览器控制台运行
document.querySelectorAll('meta').forEach(meta => {
  console.log(meta.name || meta.property, meta.content)
})
```

## 7. 最佳实践

### 关键词优化
- 每页 3-5 个主要关键词
- 标题中包含主要关键词
- 描述中自然融入关键词
- 避免关键词堆砌

### 描述优化
- 长度：150-160 字符
- 包含页面核心价值
- 包含号召性用语
- 与标题相关但不是重复

### 标题优化
- 长度：50-60 字符
- 包含品牌名称
- 关键词放在前面
- 描述准确且吸引人

## 8. 性能考虑

### Nuxt 3 SEO 优势
- **服务端渲染 (SSR)**: 搜索引擎可以直接抓取 HTML
- **自动生成**: useHead 自动管理 meta 标签
- **类型安全**: TypeScript 支持
- **零配置**: 开箱即用的 SEO 功能

### 注意事项
- SEO 配置不会影响客户端性能
- Meta 标签在服务端渲染时生成
- 避免在 SEO 配置中使用大量计算

## 9. 扩展建议

### 结构化数据 (Schema.org)
```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    name: 'wanGISen 技术博客',
    url: 'https://wangsen0802.github.io',
  }),
  defineWebPage(),
])
</script>
```

### Sitemap 生成
安装 `@nuxtjs/sitemap` 模块：
```bash
pnpm add -D @nuxtjs/sitemap
```

配置 `nuxt.config.ts`：
```typescript
modules: ['@nuxtjs/sitemap'],

sitemap: {
  hostname: 'https://wangsen0802.github.io',
  gzip: true,
  routes: [...],
}
```

### robots.txt
在 `public/robots.txt` 中配置：
```txt
User-agent: *
Allow: /
Sitemap: https://wangsen0802.github.io/sitemap.xml
```

## 10. 监控和分析

### Google Search Console
1. 添加网站到 GSC
2. 验证网站所有权
3. 监控索引状态
4. 查看搜索分析

### Google Analytics
1. 安装 Google Analytics 4
2. 配置事件跟踪
3. 监控用户行为

## 11. 常见问题

### Q: 为什么社交分享预览不更新？
**A**: 社交平台会缓存预览数据。使用验证工具强制刷新：
- Facebook: 使用 Sharing Debugger 的 "Scrape Again"
- Twitter: 使用 Card Validator 重新验证
- LinkedIn: 等待 7 天或使用 Post Inspector

### Q: 如何添加自定义 meta 标签？
**A**: 在 `useSeo()` 调用后，可以额外使用 `useHead()`：
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

### Q: 如何为不同语言设置不同的 SEO？
**A**: 使用 `useHead()` 的条件渲染：
```vue
<script setup lang="ts">
const { locale } = useI18n()
const title = locale.value === 'zh' ? '中文标题' : 'English Title'
useSeo({ title })
</script>
```

## 12. 维护清单

### 定期检查
- [ ] 验证所有页面的 meta 标签
- [ ] 更新 Open Graph 图片
- [ ] 检查关键词排名
- [ ] 分析搜索流量
- [ ] 更新过时的描述

### 新页面检查
- [ ] 添加 `useSeo()` 配置
- [ ] 验证 Open Graph 标签
- [ ] 测试社交分享预览
- [ ] 添加到 Sitemap

## 参考资源

- [Nuxt 3 SEO 文档](https://nuxt.com/docs/guide/seo-meta)
- [Open Graph 协议](https://ogp.me/)
- [Twitter Card 文档](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google 搜索中心](https://developers.google.com/search/docs)
- [Schema.org](https://schema.org/)

---

**注意**: SEO 是持续优化的过程，定期检查和更新是保持良好搜索排名的关键。
