// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // 运行时配置
  runtimeConfig: {
    public: {
      siteUrl: 'https://wangsen0802.github.io',
    },
  },

  // 模块
  modules: ['@nuxt/content', '@nuxtjs/google-fonts', '@nuxtjs/color-mode'],

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // 样式配置
  css: ['~/assets/styles/main.scss'],

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },
  },

  // Google Fonts
  googleFonts: {
    families: {
      'Noto Sans SC': [400, 500, 700],
    },
  },

  // 应用配置
  app: {
    head: {
      title: 'wanGISen - 技术博客',
      meta: [
        { name: 'description', content: '个人技术博客，专注于前端开发和 GIS 技术' },
        { name: 'author', content: '王森' },
        { name: 'keywords', content: 'Vue.js, Nuxt 3, TypeScript, GIS, Mapbox, 前端开发, 全栈开发' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Open Graph 默认配置
        { property: 'og:site_name', content: 'wanGISen' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_CN' },
        // Twitter Card 默认配置
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@wangsen0802' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },


  // 构建配置
  nitro: {
    preset: 'vercel',
  },
})
