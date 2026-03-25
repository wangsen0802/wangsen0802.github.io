/**
 * 文章 Frontmatter 元数据类型
 */
export interface PostFrontmatter {
  title: string
  description: string
  category: string
  tags?: string[]
  author?: string
  date: string
  updated?: string
  cover?: string
}

/**
 * 文章类型
 */
export interface Post {
  _path: string
  _file: string
  title: string
  description: string
  category: string
  tags: string[]
  author: string
  date: string
  updated?: string
  cover?: string
  body?: any
}

/**
 * 分类类型
 */
export interface Category {
  name: string
  slug: string
  count: number
}

/**
 * 统计数据类型
 */
export interface StatsOverview {
  totalViews: number
  uniqueVisitors: number
  pageViews: PageViewStats[]
}

export interface PageViewStats {
  pagePath: string
  viewCount: number
  uniqueVisitors: number
}

/**
 * 导航项类型
 */
export interface NavItem {
  name: string
  path: string
  icon?: string
}
