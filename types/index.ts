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
  body?: unknown
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
  totalUV: number
  totalPages: number
  todayViews: number
  todayUV: number
  topPages: TopPage[]
  timestamp: string
}

export interface TopPage {
  pagePath: string
  viewCount: number
  uniqueVisitors: number
}

export interface PageViewStats {
  pagePath: string
  viewCount: number
  uniqueVisitors: number
}

export interface TrendItem {
  date: string
  pv: number
  uv: number
}

export interface TrendResponse {
  period: 'day' | 'week' | 'month'
  data: TrendItem[]
}

/**
 * 导航项类型
 */
export interface NavItem {
  name: string
  path: string
  icon?: string
}
