/**
 * 存储适配层 - 统一接口 + 工厂函数
 */

export interface TopPage {
  pagePath: string
  viewCount: number
  uniqueVisitors: number
}

export interface TrendItem {
  date: string
  pv: number
  uv: number
}

export interface StatsStorage {
  // 记录访问（PV + UV 判断）
  recordVisit(data: {
    pagePath: string
    ipHash: string
    userAgent?: string
    referer?: string
  }): Promise<void>

  // 获取全站统计概览
  getOverview(): Promise<{
    totalViews: number
    totalUV: number
    totalPages: number
    topPages: TopPage[]
    todayViews: number
    todayUV: number
  }>

  // 获取单页统计
  getPageStats(pagePath: string): Promise<{
    pagePath: string
    viewCount: number
    uniqueVisitors: number
  }>

  // 获取趋势数据
  getTrend(period: 'day' | 'week' | 'month', days: number): Promise<TrendItem[]>
}

export async function createStorage(): Promise<StatsStorage> {
  if (process.env.VERCEL) {
    const { VercelKVStorage } = await import('./kv-storage')
    return new VercelKVStorage()
  }
  const { SQLiteStorage } = await import('./sqlite-storage')
  return new SQLiteStorage()
}
