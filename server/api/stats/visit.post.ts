import crypto from 'crypto'
import { recordVisit } from '~/server/utils/db'

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

  // 对 IP 进行哈希处理，保护隐私
  const ipHash = crypto.createHash('sha256').update(String(ip)).digest('hex').substring(0, 16)

  // 记录访问
  recordVisit({
    pagePath,
    ipHash,
    userAgent: userAgent.substring(0, 500), // 限制长度
    referer: referer.substring(0, 500),
  })

  return {
    success: true,
    message: 'Visit recorded',
  }
})
