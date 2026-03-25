# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在该代码库中工作时提供指导。

## 项目概述

这是一个使用 Vue 3、TypeScript 和 Vite 构建的个人技术博客网站，主要展示前端开发和 GIS 技术相关的文章内容。项目已配置自动部署到 GitHub Pages，遵循现代 Vue.js 开发模式。

> **架构规划**：项目计划迁移至 Nuxt 3 全栈架构，详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 当前技术栈

| 类型 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 (组合式 API) | ^3.5 |
| 语言 | TypeScript (严格模式) | ~5.8 |
| 构建 | Vite | ^5.4 |
| 路由 | Vue Router 4 | ^4.6 |
| 状态 | Pinia 3 | ^3.0 |
| 样式 | SCSS | - |
| UI | Ant Design Vue | ^4.2 |
| 解析 | markdown-it | ^14.1 |
| 高亮 | highlight.js | ^11.11 |
| 动画 | GSAP | ^3.13 |
| 3D | Three.js | ^0.180 |
| 格式化 | Prettier | ^3.6 |

## 核心功能

1. **首页展示** - 个人介绍和技术栈展示
2. **文章系统** - 支持分类浏览和详情查看
3. **Markdown 渲染** - 自动解析和高亮代码
4. **主题切换** - 支持暗色/亮色模式
5. **响应式设计** - 适配移动端和桌面端

## 项目结构

```
src/
├── App.vue                 # 根组件，包含导航和布局
├── main.ts                 # 应用程序入口点
├── style.css               # 全局样式
├── vite-env.d.ts           # TypeScript 环境声明
├── router/
│   └── index.ts            # 路由定义和导航守卫
├── stores/
│   └── index.ts            # Pinia 状态管理
├── components/
│   ├── Navigation.vue      # 导航组件
│   ├── ThemeToggle.vue     # 主题切换组件
│   ├── MarkdownRenderer.vue # Markdown 渲染器
│   └── ThreeBackground.vue # Three.js 背景组件
├── composables/
│   └── useTypewriter.ts    # 打字机效果 Hook
├── views/
│   ├── Home.vue            # 首页
│   ├── About.vue           # 关于页面
│   ├── PostsList.vue       # 文章列表页
│   ├── CategoryPosts.vue   # 分类文章页
│   ├── PostDetail.vue      # 文章详情页
│   └── demos/mapbox/       # Mapbox 演示
├── utils/
│   ├── posts.ts            # 文章处理工具
│   ├── markdown.ts         # Markdown 解析工具
│   └── image.ts            # 图片处理工具
├── styles/
│   └── theme.scss          # 主题样式
├── posts/                  # Markdown 文章
│   ├── frontend/           # 前端相关
│   ├── gis/                # GIS 相关
│   └── vue/                # Vue.js 相关
└── assets/                 # 静态资源
```

## 开发命令

```bash
pnpm run dev          # 启动开发服务器
pnpm run build        # 构建生产版本
pnpm run preview      # 预览生产构建
pnpm run format       # 代码格式化
pnpm run format:check # 检查代码格式
```

## 路由配置

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/posts` | PostsList.vue | 文章列表 |
| `/posts/:category` | CategoryPosts.vue | 分类文章 |
| `/posts/:category/:id` | PostDetail.vue | 文章详情 |
| `/mapbox` | demos/mapbox/index.vue | Mapbox 演示 |
| `/about` | About.vue | 关于页面 |

## 文章系统

### 文章格式

```markdown
---
title: 文章标题
description: 文章描述
date: 2026-03-26
author: 王森
tags: ["Vue", "TypeScript"]
---

# 文章标题

正文内容...
```

### 添加文章

1. 在 `src/posts/` 对应分类目录下创建 `.md` 文件
2. 添加 YAML frontmatter 元数据
3. 使用 Markdown 语法编写内容
4. 文章会自动出现在网站中

## 部署

- **平台**: GitHub Pages
- **方式**: GitHub Actions 自动部署
- **触发**: 推送到 main 分支
- **配置**: `.github/workflows/deploy.yml`

## 关键文件

| 文件 | 说明 |
|------|------|
| `src/main.ts` | 应用入口 |
| `src/router/index.ts` | 路由配置 |
| `src/stores/index.ts` | 状态管理 |
| `src/utils/posts.ts` | 文章处理 |
| `src/utils/markdown.ts` | Markdown 解析 |
| `vite.config.ts` | Vite 配置 |

## 优化路线图

详见 [docs/MIGRATION.md](docs/MIGRATION.md)

### 高优先级

- [ ] 404 页面
- [ ] 文章数据缓存
- [ ] ESLint 配置
- [ ] 类型优化
- [ ] 动态 Meta 标签
- [ ] 骨架屏加载

### 中优先级

- [ ] 阅读进度条
- [ ] 代码复制按钮
- [ ] Sitemap 生成
- [ ] 图片压缩

### 低优先级

- [ ] 文章搜索
- [ ] 标签聚合页
- [ ] RSS 订阅
- [ ] PWA 支持

## Nuxt 3 迁移计划

项目计划迁移至 Nuxt 3 全栈架构，完整迁移清单见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 第 10 节。

### 迁移阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 创建 Nuxt 3 项目、配置基础依赖 | 📋 待开始 |
| Phase 1 | 迁移页面、组件、样式 | 📋 待开始 |
| Phase 2 | 文章系统 (@nuxt/content) | 📋 待开始 |
| Phase 3 | 后端功能 (访客统计) | 📋 待开始 |
| Phase 4 | 高级功能 (搜索、代码沙盒) | 📋 待开始 |
| Phase 5 | 部署上线 (Vercel) | 📋 待开始 |

## 相关文档

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Nuxt 3 目标架构
- [docs/MIGRATION.md](docs/MIGRATION.md) - 优化迁移清单

---

**注意**: 此项目专注于技术博客内容展示，保持代码简洁和功能明确。在开发新功能时，请确保与现有架构保持一致，并考虑向 Nuxt 3 迁移的兼容性。
