import { createStorage } from '~/server/utils/storage'

// 内存缓存 5 分钟
let cachedData: Record<string, unknown> | null = null
let cachedAt = 0
const CACHE_TTL = 5 * 60 * 1000

export default defineEventHandler(async () => {
  const now = Date.now()
  if (cachedData && now - cachedAt < CACHE_TTL) {
    return cachedData
  }

  const storage = createStorage()
  const stats = await storage.getOverview()

  cachedData = {
    ...stats,
    timestamp: new Date().toISOString(),
  }
  cachedAt = now

  return cachedData
})
