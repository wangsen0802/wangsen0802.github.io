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

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
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
