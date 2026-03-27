/**
 * SEO 工具函数 Composable
 * 提供可复用的 SEO 配置生成函数
 */

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  author?: string
  publishDate?: string
  modifiedDate?: string
}

/**
 * 生成完整的 SEO 配置
 * @param options - SEO 配置选项
 * @returns useHead 配置对象
 */
export function useSeo(options: SeoOptions = {}) {
  const {
    title = 'wanGISen - 技术博客',
    description = '个人技术博客，专注于前端开发和 GIS 技术',
    image = '/og-image.png',
    type = 'website',
    keywords = ['Vue.js', 'Nuxt 3', 'TypeScript', 'GIS', 'Mapbox', '前端开发'],
    author = '王森',
    publishDate,
    modifiedDate,
  } = options

  // 构建页面标题
  const fullTitle = title.includes('wanGISen') ? title : `${title} - wanGISen`

  // 构建关键词字符串
  const keywordsString = keywords.join(', ')

  // 构建当前页面 URL
  const route = useRoute()
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://wangsen0802.github.io'
  const fullUrl = `${baseUrl}${route.path}`

  // 构建完整图片 URL
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  // Meta 标签配置
  const metaTags: any[] = [
    // 基础 SEO
    { name: 'description', content: description },
    { name: 'keywords', content: keywordsString },
    { name: 'author', content: author },

    // Open Graph
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:url', content: fullUrl },
    { property: 'og:type', content: type },

    // Twitter Card
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImageUrl },
  ]

  // 文章类型额外的 meta 标签
  if (type === 'article') {
    metaTags.push(
      { property: 'article:author', content: author },
      { property: 'article:published_time', content: publishDate || '' },
      { property: 'article:modified_time', content: modifiedDate || publishDate || '' }
    )
  }

  // 应用 SEO 配置
  useHead({
    title: fullTitle,
    meta: metaTags,
    link: [
      { rel: 'canonical', href: fullUrl },
    ],
  })
}

/**
 * 生成文章页面的 SEO 配置
 * @param post - 文章数据对象
 */
export function useArticleSeo(post: {
  title: string
  description: string
  date?: string
  updated?: string
  author?: string
  tags?: string[]
  cover?: string
  category?: string
}) {
  return useSeo({
    title: post.title,
    description: post.description,
    image: post.cover || '/og-image.png',
    type: 'article',
    keywords: [
      'Vue.js',
      'Nuxt 3',
      'TypeScript',
      '前端开发',
      post.category || '技术',
      ...(post.tags || []),
    ],
    author: post.author || '王森',
    publishDate: post.date,
    modifiedDate: post.updated || post.date,
  })
}

/**
 * 生成列表页面的 SEO 配置
 * @param title - 页面标题
 * @param description - 页面描述
 */
export function useListSeo(title: string, description: string) {
  return useSeo({
    title,
    description,
    type: 'website',
  })
}
