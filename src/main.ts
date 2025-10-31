import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import './styles/theme.scss'
// 导入代码高亮样式
import 'highlight.js/styles/github.css'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores'

// 应用初始化函数
async function initializeApp() {
  const app = createApp(App)
  const pinia = createPinia()

  // 使用插件
  app.use(pinia)
  app.use(Antd)
  app.use(router)

  // 获取应用store
  const appStore = useAppStore()

  // 设置主题监听器
  appStore.setupThemeWatcher()

  // 开始应用初始化流程
  try {
    await appStore.initializeApp()
  } catch (error) {
    console.error('应用初始化失败:', error)
    // 如果初始化失败，至少要挂载应用
    app.mount('#app')
  }

  // 挂载Vue应用
  app.mount('#app')

  // 显示应用（移除原生加载页面）
  setTimeout(() => {
    const nativeLoading = document.getElementById('native-loading')
    const vueApp = document.getElementById('app')

    if (nativeLoading && vueApp) {
      // 淡出原生加载页面
      nativeLoading.classList.add('fade-out')

      // 显示Vue应用
      vueApp.classList.add('app-loaded')

      // 移除原生加载页面DOM
      setTimeout(() => {
        nativeLoading.remove()
      }, 500)
    }
  }, 500) // 给Vue应用一点时间完成首次渲染

  return app
}

// 性能监控：记录应用启动时间
const startTime = performance.now()

// 错误处理：全局错误捕获
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason)
})

// 启动应用
initializeApp()
  .then(() => {
    const endTime = performance.now()
    console.log(`应用启动完成，耗时: ${(endTime - startTime).toFixed(2)}ms`)
  })
  .catch((error) => {
    console.error('应用启动失败:', error)
  })

// 预加载关键资源
if ('serviceWorker' in navigator) {
  // 这里可以添加Service Worker注册逻辑
  // 用于缓存关键资源，提升后续访问速度
}

// 预连接到常用域名
const preconnectDomains = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://api.github.com'
]

preconnectDomains.forEach(domain => {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = domain
  document.head.appendChild(link)
})
