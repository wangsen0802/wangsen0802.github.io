import type { StatsStorage, TopPage, TrendItem } from './storage'

/**
 * Vercel KV 存储实现（生产环境）
 * 部署到 Vercel 后实现，当前为骨架
 */
export class VercelKVStorage implements StatsStorage {
  async recordVisit(): Promise<void> {
    // TODO: Vercel KV 生产环境实现
    throw new Error('VercelKVStorage not implemented yet')
  }

  async getOverview(): Promise<{
    totalViews: number
    totalUV: number
    totalPages: number
    topPages: TopPage[]
    todayViews: number
    todayUV: number
  }> {
    throw new Error('VercelKVStorage not implemented yet')
  }

  async getPageStats(): Promise<{
    pagePath: string
    viewCount: number
    uniqueVisitors: number
  }> {
    throw new Error('VercelKVStorage not implemented yet')
  }

  async getTrend(): Promise<TrendItem[]> {
    throw new Error('VercelKVStorage not implemented yet')
  }
}
