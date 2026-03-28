import crypto from 'crypto'
import { createStorage } from '~/server/utils/storage'

// 内存去重：同一 ipHash + pagePath 在 10 秒内不重复记录
const recentVisits = new Map<string, number>()
const DEDUP_TTL = 10_000

// 定期清理过期记录
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamp] of recentVisits) {
    if (now - timestamp > DEDUP_TTL) {
      recentVisits.delete(key)
    }
  }
}, 30_000)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { pagePath } = body

  if (!pagePath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'pagePath is required',
    })
  }

  // 获取客户端信息
  const headers = getHeaders(event)
  const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown'
  const userAgent = headers['user-agent'] || ''
  const referer = headers['referer'] || ''

  // IP 哈希
  const ipHash = crypto.createHash('sha256').update(String(ip)).digest('hex').substring(0, 16)

  // 去重检查
  const dedupKey = `${ipHash}:${pagePath}`
  const now = Date.now()
  const lastVisit = recentVisits.get(dedupKey)
  if (lastVisit && now - lastVisit < DEDUP_TTL) {
    return { success: true, message: 'Visit recorded' }
  }
  recentVisits.set(dedupKey, now)

  // 记录访问
  const storage = await createStorage()
  await storage.recordVisit({
    pagePath,
    ipHash,
    userAgent: userAgent.substring(0, 500),
    referer: referer.substring(0, 500),
  })

  return { success: true, message: 'Visit recorded' }
})
