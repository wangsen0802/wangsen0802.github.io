import { createStorage } from '~/server/utils/storage'

// 内存缓存 5 分钟
const pageCache = new Map<string, { data: Record<string, unknown>; at: number }>()
const CACHE_TTL = 5 * 60 * 1000

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const path = query.path as string

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'path is required',
    })
  }

  const now = Date.now()
  const cached = pageCache.get(path)
  if (cached && now - cached.at < CACHE_TTL) {
    return cached.data
  }

  const storage = await createStorage()
  const data = await storage.getPageStats(path)

  pageCache.set(path, { data, at: now })

  // 清理过期缓存
  if (pageCache.size > 100) {
    for (const [key, value] of pageCache) {
      if (now - value.at > CACHE_TTL) {
        pageCache.delete(key)
      }
    }
  }

  return data
})
