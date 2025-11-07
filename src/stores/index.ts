import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true, // 默认为加载状态
    theme: 'dark' as 'light' | 'dark', // 默认使用暗色主题
    sidebarOpen: false,
    // 新增加载相关状态
    appInitialized: false,
    initializationProgress: 0,
    initializationPhase: 'initializing' as 'initializing' | 'loading-resources' | 'ready',
    loadingStartTime: 0,
    // 缓存和性能优化相关
    firstVisit: true,
    skipLoading: false,
    performanceMode: false
  }),

  getters: {
    isLoading: state => state.loading,
    currentTheme: state => state.theme,
    isSidebarOpen: state => state.sidebarOpen,
    isAppInitialized: state => state.appInitialized,
    getInitializationProgress: state => state.initializationProgress,
    getInitializationPhase: state => state.initializationPhase,
    getLoadingDuration: state => {
      return state.loadingStartTime ? Date.now() - state.loadingStartTime : 0
    },
    // 新增缓存相关getters
    isFirstVisit: state => state.firstVisit,
    shouldSkipLoading: state => state.skipLoading,
    isPerformanceMode: state => state.performanceMode
  },

  actions: {
    setLoading(status: boolean) {
      this.loading = status
      if (status) {
        this.loadingStartTime = Date.now()
      }
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      // 保存到localStorage
      localStorage.setItem('theme', theme)
      // 应用到document
      document.documentElement.setAttribute('data-theme', theme)
    },

    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      this.setTheme(newTheme)
    },

    initTheme() {
      // 从localStorage读取主题设置
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

      // 默认优先使用暗色主题，只有在用户明确设置亮色时才使用亮色
      let theme: 'light' | 'dark'
      if (savedTheme) {
        // 如果用户有手动设置，使用用户设置
        theme = savedTheme
      } else {
        // 没有用户设置时，默认使用暗色主题
        theme = 'dark'
      }

      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    closeSidebar() {
      this.sidebarOpen = false
    },

    // 检查是否应该跳过完整加载
    checkLoadingConditions() {
      const now = Date.now()
      const lastVisit = localStorage.getItem('lastVisit')
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0')

      // 检查缓存状态
      const hasCachedResources = this.checkResourceCache()

      // 判断条件
      const isRecentVisit = lastVisit && now - parseInt(lastVisit) < 30 * 60 * 1000 // 30分钟内
      const isFrequentUser = visitCount > 5 // 访问次数超过5次

      // 快速刷新检测 - 安全的类型检查
      let isQuickRefresh = false
      try {
        const navigationEntries = performance.getEntriesByType(
          'navigation'
        ) as PerformanceNavigationTiming[]
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0]
          if (nav && nav.type === 'reload' && nav.loadEventEnd && nav.loadEventStart) {
            isQuickRefresh = nav.loadEventEnd - nav.loadEventStart < 1000
          }
        }
      } catch (error) {
        console.warn('导航类型检测失败:', error)
        isQuickRefresh = false
      }

      // 决定是否跳过加载
      this.skipLoading = isRecentVisit || isFrequentUser || isQuickRefresh
      this.performanceMode = isFrequentUser && hasCachedResources
      this.firstVisit = visitCount === 0

      // 更新访问记录
      localStorage.setItem('lastVisit', now.toString())
      localStorage.setItem('visitCount', (visitCount + 1).toString())

      return {
        skipLoading: this.skipLoading,
        performanceMode: this.performanceMode,
        firstVisit: this.firstVisit
      }
    },

    // 检查资源缓存状态
    checkResourceCache(): boolean {
      try {
        // 检查关键资源是否已缓存
        const cacheTest = localStorage.getItem('cacheVerified')
        if (!cacheTest) return false

        const cacheData = JSON.parse(cacheTest)
        const now = Date.now()

        // 缓存有效期2小时
        return now - cacheData.timestamp < 2 * 60 * 60 * 1000
      } catch {
        return false
      }
    },

    // 标记资源缓存
    markResourceCache() {
      try {
        localStorage.setItem(
          'cacheVerified',
          JSON.stringify({
            timestamp: Date.now()
          })
        )
      } catch (error) {
        console.warn('无法设置缓存标记:', error)
      }
    },

    // 新增应用初始化相关方法
    async initializeApp() {
      // 检查加载条件
      const loadingConditions = this.checkLoadingConditions()

      // 如果应该跳过加载，直接初始化
      if (loadingConditions.skipLoading) {
        await this.fastInitialize()
        return
      }

      this.loadingStartTime = Date.now()
      this.setLoading(true)
      this.appInitialized = false

      try {
        // 第一阶段：初始化主题和基础设置
        this.initializationPhase = 'initializing'
        this.initializationProgress = 10

        await this.initializeTheme()
        this.initializationProgress = 30

        // 第二阶段：加载资源和配置
        this.initializationPhase = 'loading-resources'
        this.initializationProgress = 50

        await this.loadResources()
        this.initializationProgress = 80

        // 第三阶段：准备完成
        this.initializationPhase = 'ready'
        this.initializationProgress = 100

        // 根据访问类型调整加载时间
        let minLoadingTime = 2000
        if (!loadingConditions.firstVisit) {
          minLoadingTime = 800 // 非首次访问缩短加载时间
        }

        const elapsedTime = Date.now() - this.loadingStartTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }

        this.appInitialized = true
        this.markResourceCache()
        this.setLoading(false)
      } catch (error) {
        console.error('应用初始化失败:', error)
        // 即使出错也要完成初始化，避免无限加载
        this.appInitialized = true
        this.setLoading(false)
      }
    },

    // 快速初始化模式
    async fastInitialize() {
      console.log('🚀 使用快速初始化模式')

      try {
        await this.initializeTheme()
        await this.loadResources()
        this.appInitialized = true
        this.markResourceCache()

        // 快速模式下设置极短的加载时间或直接完成
        this.setLoading(false)
      } catch (error) {
        console.error('快速初始化失败:', error)
        this.appInitialized = true
        this.setLoading(false)
      }
    },

    async initializeTheme() {
      // 延迟执行以确保DOM已准备好
      await new Promise(resolve => setTimeout(resolve, 100))
      this.initTheme()
    },

    async loadResources() {
      // 模拟加载资源的过程
      await new Promise(resolve => setTimeout(resolve, 500))

      // 这里可以添加实际的资源加载逻辑
      // 例如：预加载图片、加载用户配置、获取API数据等
    },

    // 手动设置初始化进度
    setInitializationProgress(
      progress: number,
      phase?: 'initializing' | 'loading-resources' | 'ready'
    ) {
      this.initializationProgress = Math.min(100, Math.max(0, progress))
      if (phase) {
        this.initializationPhase = phase
      }
    },

    // 重置初始化状态
    resetInitialization() {
      this.appInitialized = false
      this.initializationProgress = 0
      this.initializationPhase = 'initializing'
      this.loadingStartTime = 0
      this.setLoading(true)
    },

    // 监听系统主题变化
    setupThemeWatcher() {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        mediaQuery.addEventListener('change', e => {
          // 只有在没有用户手动设置主题时才跟随系统主题
          const userTheme = localStorage.getItem('theme')
          if (!userTheme) {
            this.setTheme(e.matches ? 'dark' : 'light')
          }
        })
      }
    }
  }
})

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false
  }),

  getters: {
    userName: state => state.name,
    userEmail: state => state.email,
    isAuthenticated: state => state.isLoggedIn
  },

  actions: {
    setUserInfo(name: string, email: string) {
      this.name = name
      this.email = email
      this.isLoggedIn = true
    },

    clearUserInfo() {
      this.name = ''
      this.email = ''
      this.isLoggedIn = false
    }
  }
})
