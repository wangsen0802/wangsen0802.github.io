import packageJson from '@/../package.json'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  // 文章系统路由
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('@/views/PostsList.vue'),
    meta: {
      title: '文章列表',
    },
  },
  {
    path: '/posts/:category',
    name: 'CategoryPosts',
    component: () => import('@/views/CategoryPosts.vue'),
    meta: {
      title: '分类文章',
    },
  },
  {
    path: '/posts/:category/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetail.vue'),
    meta: {
      title: '文章详情',
    },
  },
  // 保留mapbox示例
  {
    path: '/mapbox',
    name: 'mapbox',
    component: () => import('@/views/demos/mapbox/index.vue'),
    meta: {
      title: 'Mapbox',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
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
