import { getOverviewStats } from '~/server/utils/db'

export default defineEventHandler(() => {
  const stats = getOverviewStats()

  return {
    ...stats,
    timestamp: new Date().toISOString(),
  }
})
