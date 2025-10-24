import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    theme: 'light' as 'light' | 'dark',
    sidebarOpen: false,
  }),

  getters: {
    isLoading: state => state.loading,
    currentTheme: state => state.theme,
    isSidebarOpen: state => state.sidebarOpen,
  },

  actions: {
    setLoading(status: boolean) {
      this.loading = status
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
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const theme = savedTheme || systemTheme

      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    closeSidebar() {
      this.sidebarOpen = false
    },
  },
})

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false,
  }),

  getters: {
    userName: state => state.name,
    userEmail: state => state.email,
    isAuthenticated: state => state.isLoggedIn,
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
    },
  },
})
