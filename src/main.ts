import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 使用 Pinia
app.use(createPinia())

// 使用 Vue Router
app.use(router)

app.mount('#app')
