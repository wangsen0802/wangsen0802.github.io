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

const app = createApp(App)

// 使用 Pinia
app.use(createPinia())

// 使用 Ant Design Vue
app.use(Antd)

// 使用 Vue Router
app.use(router)

// 初始化主题
const appStore = useAppStore()
appStore.initTheme()

app.mount('#app')
