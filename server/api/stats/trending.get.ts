import { createStorage } from '~/server/utils/storage'

// 内存缓存 10 分钟
let cachedData: Record<string, unknown> | null = null
let cachedAt = 0
const CACHE_TTL = 10 * 60 * 1000

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const period = (query.period as 'day' | 'week' | 'month') || 'day'
  const days = Number(query.days) || 30

  const cacheKey = `${period}-${days}`
  const now = Date.now()
  if (cachedData && cachedData.key === cacheKey && now - cachedAt < CACHE_TTL) {
    return cachedData.data
  }

  const storage = await createStorage()
  const data = await storage.getTrend(period, days)

  cachedData = {
    key: cacheKey,
    data: { period, data },
  }
  cachedAt = now

  return cachedData.data
})
