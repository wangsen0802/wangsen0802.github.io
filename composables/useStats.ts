import type { StatsOverview, TrendResponse } from '~/types'

export const useStats = () => {
  const overview = useFetch<StatsOverview>('/api/stats/overview', {
    server: false,
    key: 'stats-overview',
  })

  const fetchTrend = async (period: 'day' | 'week' | 'month' = 'day', days: number = 30) => {
    return await $fetch<TrendResponse>('/api/stats/trending', {
      params: { period, days },
    })
  }

  const fetchPageStats = async (path: string) => {
    return await $fetch<{ pagePath: string; viewCount: number; uniqueVisitors: number }>(
      '/api/stats/page',
      { params: { path } },
    )
  }

  return {
    overview,
    fetchTrend,
    fetchPageStats,
  }
}
