/**
 * 页面访问统计 composable
 * 用于在客户端记录页面访问
 */
export const usePageStats = () => {
  const route = useRoute()

  // 记录页面访问
  const recordPageView = async (pagePath: string) => {
    try {
      await $fetch('/api/stats/visit', {
        method: 'POST',
        body: { pagePath },
      })
    } catch (error) {
      // 静默失败，不影响用户体验
      console.warn('Failed to record page view:', error)
    }
  }

  // 在页面加载时记录访问
  onMounted(() => {
    // 延迟记录，避免阻塞首屏渲染
    setTimeout(() => {
      recordPageView(route.path)
    }, 1000)
  })

  return {
    recordPageView,
  }
}
