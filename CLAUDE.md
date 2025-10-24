# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在该代码库中工作时提供指导。

## 项目概述

这是一个使用 Vue 3、TypeScript 和 Vite 构建的个人网站，配置了自动部署到 GitHub Pages。项目遵循现代 Vue.js 开发模式，使用 Vue Router 进行导航，Pinia 进行状态管理。

## 架构概述

### 技术栈

- **Vue 3** (组合式 API)
- **TypeScript** (启用严格模式)
- **Vite 5.x** 构建工具
- **Vue Router 4** 路由管理
- **Pinia 3** 状态管理
- **SCSS** 样式，包含类似 Tailwind 的工具类
- **Prettier** 代码格式化

### 项目结构

```
src/
├── App.vue              # 根组件，包含导航和布局
├── main.ts              # 应用程序入口点
├── style.css            # 全局样式
├── vite-env.d.ts        # TypeScript 环境声明
├── router/              # Vue Router 配置
│   └── index.ts         # 路由和导航守卫
├── stores/              # Pinia 状态存储
│   └── index.ts         # 应用和用户状态管理
├── components/          # 可复用组件 (目前为空)
├── views/               # 页面组件
│   ├── Home.vue         # 首页
│   ├── About.vue        # 关于页面
│   ├── home-page/       # 未来首页组件
│   └── mapbox/          # 地图相关组件
└── assets/              # 静态资源
    ├── icons/           # 图标文件
    └── images/          # 图片资源
        └── texture.png  # 背景纹理
```

## 开发工作流

## 开发命令

### 核心开发

```bash
pnpm run dev          # 启动开发服务器，支持热重载
pnpm run build        # TypeScript 编译 + Vite 生产构建
pnpm run preview      # 本地预览生产构建
```

### 代码质量

```bash
pnpm run format       # 使用 Prettier 格式化所有文件
pnpm run format:check # 检查代码格式，不做修改
```

### 包管理

- 所有包操作使用 **pnpm** (不是 npm 或 yarn)
- 依赖通过 `pnpm-lock.yaml` 管理

## 架构与结构

### Vue Router 配置 (`src/router/index.ts`)

- **History 模式**: 使用 `createWebHistory()` 获得简洁的 URL
- **懒加载**: 所有路由组件使用动态导入
- **全局守卫**: 导航守卫从路由元数据设置页面标题
- **路由模式**:
  ```typescript
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  }
  ```

### Pinia 状态管理 (`src/stores/index.ts`)

- **App Store**: 全局应用状态 (加载、主题、侧边栏)
- **User Store**: 认证和用户资料数据
- **TypeScript**: 状态、getters 和 actions 完全类型安全
- **使用模式**:
  ```typescript
  import { useAppStore, useUserStore } from '@/stores'
  const appStore = useAppStore()
  const userStore = useUserStore()
  ```

### 组件结构

- **组合式 API**: 所有组件使用 `<script setup lang="ts">` 语法
- **Views**: `src/views/` 中的页面组件 (Home.vue, About.vue)
- **Layout**: `App.vue` 中的主布局，包含头部导航、主内容区域和页脚
- **样式**: 带作用域的 SCSS，现代 CSS 特性 (backdrop-filter、渐变)

### 构建配置

- **TypeScript**: 启用严格模式，全面类型检查
- **Vite**: 生产优化，代码分割
- **资源**: `src/assets/` 中的图片，正确的 URL 处理
- **输出**: 生产构建输出到 `/dist` 目录

## 开发模式

### 添加新路由

1. 在 `src/views/` 中创建组件
2. 按照现有模式将路由添加到 `src/router/index.ts`
3. 包含 meta.title 以自动设置页面标题

### 添加新状态存储

1. 在 `src/stores/index.ts` 或单独文件中创建 store
2. 使用带 TypeScript 类型的 Pinia 组合式 API
3. 从主 store index 导出以获得清晰的导入

### 样式约定

- 在组件中使用带作用域的 SCSS
- 利用现有的渐变背景和纹理模式
- 保持响应式设计模式
- 使用 CSS 自定义属性保证主题一致性

### GitHub Pages 部署

- 通过 GitHub Actions 工作流自动部署
- 构建并部署到 `gh-pages` 分支
- 确保在提交到 main 分支前构建通过

## 关键文件说明

- `src/main.ts`: 应用初始化，包含 router 和 Pinia
- `src/router/index.ts`: 路由定义和导航逻辑
- `src/stores/index.ts`: 全局状态管理
- `src/App.vue`: 带导航的主布局组件
- `vite.config.ts`: 构建工具配置
- `package.json`: 依赖和开发脚本
