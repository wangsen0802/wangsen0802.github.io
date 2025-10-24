import packageJson from '@/../package.json'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  // 笔记系统路由
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('@/views/notes/NotesList.vue'),
    meta: {
      title: '技术笔记',
    },
  },
  {
    path: '/notes/:category',
    name: 'NotesCategory',
    component: () => import('@/views/notes/CategoryNotes.vue'),
    meta: {
      title: '分类笔记',
    },
  },
  {
    path: '/notes/:category/:id',
    name: 'NoteDetail',
    component: () => import('@/views/notes/NoteDetail.vue'),
    meta: {
      title: '笔记详情',
    },
  },
  // Demo系统路由
  {
    path: '/demos',
    name: 'Demos',
    component: () => import('@/views/demos/DemosList.vue'),
    meta: {
      title: '在线示例',
    },
  },
  {
    path: '/demos/:category',
    name: 'DemosCategory',
    component: () => import('@/views/demos/CategoryDemos.vue'),
    meta: {
      title: '分类示例',
    },
  },
  {
    path: '/demos/:category/:id',
    name: 'DemoDetail',
    component: () => import('@/views/demos/DemoDetail.vue'),
    meta: {
      title: '示例详情',
    },
  },
  // 项目展示路由
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/projects/ProjectsList.vue'),
    meta: {
      title: '项目展示',
    },
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/projects/ProjectDetail.vue'),
    meta: {
      title: '项目详情',
    },
  },
  // 保留现有路由
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
    component: () => import('@/views/about/About.vue'),
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
