import packageJson from '../../package.json'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home-page/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/mapbox',
    name: 'mapbox',
    component: () => import('../views/mapbox/index.vue'),
    meta: {
      title: 'Mapbox',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta?.title
    ? `${to.meta.title} - ${packageJson.nameCN}`
    : `${packageJson.nameCN}`
  next()
})

export default router
