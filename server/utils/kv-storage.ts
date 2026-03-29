import { Redis } from '@upstash/redis'
import type { StatsStorage, TopPage, TrendItem } from './storage'

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// Key 前缀，避免冲突
const PREFIX = 'stats'

// Key 设计:
// stats:pv:{pagePath}         → PV 计数
// stats:uv:{pagePath}         → UV Set (存 ipHash 集合)
// stats:pv:daily:{date}:{pagePath} → 每日 PV
// stats:uv:daily:{date}:{pagePath} → 每日 UV Set
// stats:pages                  → 所有页面路径的 Set

export class VercelKVStorage implements StatsStorage {
  private redis: Redis

  constructor() {
    this.redis = getRedis()
  }

  async recordVisit(data: {
    pagePath: string
    ipHash: string
    userAgent?: string
    referer?: string
  }): Promise<void> {
    const { pagePath, ipHash } = data
    const today = new Date().toISOString().slice(0, 10)
    const pipeline = this.redis.pipeline()

    // 记录页面存在
    pipeline.sadd(`${PREFIX}:pages`, pagePath)

    // 全站 PV +1
    pipeline.incr(`${PREFIX}:pv:${pagePath}`)

    // 每日 PV +1
    pipeline.incr(`${PREFIX}:pv:daily:${today}:${pagePath}`)

    // 全站 UV
    pipeline.sadd(`${PREFIX}:uv:${pagePath}`, ipHash)

    // 每日 UV
    pipeline.sadd(`${PREFIX}:uv:daily:${today}:${pagePath}`, ipHash)

    await pipeline.exec()
  }

  async getOverview(): Promise<{
    totalViews: number
    totalUV: number
    totalPages: number
    topPages: TopPage[]
    todayViews: number
    todayUV: number
  }> {
    const today = new Date().toISOString().slice(0, 10)
    const pages = (await this.redis.smembers(`${PREFIX}:pages`)) as string[]

    let totalViews = 0
    let totalUV = 0
    let todayViews = 0
    let todayUV = 0
    const pageStats: Array<{ pagePath: string; viewCount: number; uniqueVisitors: number }> = []

    // 批量获取所有页面统计
    for (const pagePath of pages) {
      const [pv, uvSet, dailyPv, dailyUvSet] = await Promise.all([
        this.redis.get<number>(`${PREFIX}:pv:${pagePath}`),
        this.redis.scard(`${PREFIX}:uv:${pagePath}`),
        this.redis.get<number>(`${PREFIX}:pv:daily:${today}:${pagePath}`),
        this.redis.scard(`${PREFIX}:uv:daily:${today}:${pagePath}`),
      ])

      const viewCount = pv || 0
      const uniqueVisitors = uvSet || 0
      totalViews += viewCount
      totalUV += uniqueVisitors
      todayViews += dailyPv || 0
      todayUV += dailyUvSet || 0

      pageStats.push({ pagePath, viewCount, uniqueVisitors })
    }

    // 按浏览量排序取 top 10
    const topPages = pageStats.sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)

    return {
      totalViews,
      totalUV,
      totalPages: pages.length,
      topPages,
      todayViews,
      todayUV,
    }
  }

  async getPageStats(pagePath: string): Promise<{
    pagePath: string
    viewCount: number
    uniqueVisitors: number
  }> {
    const [pv, uv] = await Promise.all([
      this.redis.get<number>(`${PREFIX}:pv:${pagePath}`),
      this.redis.scard(`${PREFIX}:uv:${pagePath}`),
    ])

    return {
      pagePath,
      viewCount: pv || 0,
      uniqueVisitors: uv || 0,
    }
  }

  async getTrend(period: 'day' | 'week' | 'month', days: number): Promise<TrendItem[]> {
    if (period === 'day') {
      return this.getDailyTrend(days)
    }

    if (period === 'week') {
      return this.getWeeklyTrend(days)
    }

    return this.getMonthlyTrend(days)
  }

  private async getDailyTrend(days: number): Promise<TrendItem[]> {
    const result: TrendItem[] = []

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)

      // 获取所有页面在该日期的 PV 和 UV
      const pages = (await this.redis.smembers(`${PREFIX}:pages`)) as string[]
      let pv = 0
      let uv = 0

      for (const pagePath of pages) {
        const [dailyPv, dailyUv] = await Promise.all([
          this.redis.get<number>(`${PREFIX}:pv:daily:${dateStr}:${pagePath}`),
          this.redis.scard(`${PREFIX}:uv:daily:${dateStr}:${pagePath}`),
        ])
        pv += dailyPv || 0
        uv += dailyUv || 0
      }

      result.push({ date: dateStr, pv, uv })
    }

    return result
  }

  private async getWeeklyTrend(days: number): Promise<TrendItem[]> {
    // 按周聚合每日数据
    const dailyData = await this.getDailyTrend(days * 7)
    return this.aggregateByWeek(dailyData)
  }

  private async getMonthlyTrend(days: number): Promise<TrendItem[]> {
    const dailyData = await this.getDailyTrend(days * 30)
    return this.aggregateByMonth(dailyData)
  }

  private aggregateByWeek(data: TrendItem[]): TrendItem[] {
    const weeks = new Map<string, TrendItem>()
    for (const item of data) {
      const d = new Date(item.date)
      // 获取该日期所在周的周一
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(d.setDate(diff)).toISOString().slice(0, 10)
      const existing = weeks.get(monday)
      if (existing) {
        existing.pv += item.pv
        existing.uv += item.uv
      } else {
        weeks.set(monday, { date: monday, pv: item.pv, uv: item.uv })
      }
    }
    return Array.from(weeks.values()).sort((a, b) => a.date.localeCompare(b.date))
  }

  private aggregateByMonth(data: TrendItem[]): TrendItem[] {
    const months = new Map<string, TrendItem>()
    for (const item of data) {
      const month = item.date.slice(0, 7)
      const existing = months.get(month)
      if (existing) {
        existing.pv += item.pv
        existing.uv += item.uv
      } else {
        months.set(month, { date: item.date, pv: item.pv, uv: item.uv })
      }
    }
    return Array.from(months.values()).sort((a, b) => a.date.localeCompare(b.date))
  }
}
