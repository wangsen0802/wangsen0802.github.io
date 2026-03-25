# 项目架构文档

> 最后更新：2026-03-25

## 1. 项目概述

这是一个个人技术博客网站，支持文章发布、代码展示、在线代码沙盒、访客统计等功能。项目基于 **Nuxt 3** 全栈框架开发，前后端一体化。

### 核心功能

| 功能模块 | 描述 | 状态 |
|---------|------|------|
| 代码块显示 | Markdown 代码高亮渲染 | ✅ 已完成 |
| 代码沙盒 | 在线编辑运行代码，实时预览效果 | 📋 规划中 |
| 访客统计 | 页面访问量（PV/UV）统计与展示 | 📋 规划中 |
| 文章分类 | 按分类归档管理文章 | ✅ 已完成 |
| 文章搜索 | 本地全文搜索索引 | 📋 规划中 |

---

## 2. 技术栈

### 2.0 运行环境

| 环境 | 版本 | 说明 |
|------|------|------|
| **Node.js** | 20.x LTS | 前后端统一版本 |
| pnpm | 8.x | 包管理器 |

### 2.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Nuxt 3** | ^3.x | 全栈框架 |
| Vue 3 | ^3.x | 前端框架（Nuxt 内置） |
| TypeScript | ^5.x | 类型安全 |
| Nitro | ^2.x | 服务端引擎（Nuxt 内置） |

### 2.2 前端技术

| 技术 | 用途 |
|------|------|
| Nuxt Router | 文件系统路由（自动生成） |
| Pinia / useState | 状态管理 |
| SCSS | 样式预处理器 |
| Ant Design Vue | UI 组件库 |
| @nuxt/content | Markdown 内容管理 |
| Shiki / highlight.js | 代码高亮 |
| FlexSearch | 本地全文搜索（规划） |
| Monaco Editor | 代码编辑器（规划） |

### 2.3 后端技术

| 技术 | 用途 |
|------|------|
| Nuxt Server API | 服务端接口 |
| SQLite | 轻量级数据库 |
| better-sqlite3 | SQLite 驱动 |

### 2.4 开发工具

| 工具 | 用途 |
|------|------|
| pnpm | 包管理器 |
| Nuxt DevTools | 开发调试 |
| Prettier | 代码格式化 |
| ESLint | 代码检查 |

---

## 3. 项目结构（Nuxt 3）

```
wangsen0802.github.io/
├── docs/                          # 📁 项目文档
│   └── ARCHITECTURE.md            # 架构文档
│
├── pages/                         # 📁 页面（自动路由）
│   ├── index.vue                  # 首页 /
│   ├── about.vue                  # 关于 /about
│   ├── posts/
│   │   ├── index.vue              # 文章列表 /posts
│   │   ├── [category].vue         # 分类文章 /posts/:category
│   │   └── [category]/
│   │       └── [id].vue           # 文章详情 /posts/:category/:id
│   └── demos/
│       └── mapbox.vue             # Mapbox 演示 /demos/mapbox
│
├── components/                    # 📁 组件（自动导入）
│   ├── Navigation.vue             # 导航组件
│   ├── ThemeToggle.vue            # 主题切换
│   ├── MarkdownRenderer.vue       # Markdown 渲染器
│   └── sandbox/
│       ├── CodeEditor.vue         # 代码编辑器
│       └── Preview.vue            # 预览面板
│
├── composables/                   # 📁 组合式函数（自动导入）
│   ├── usePosts.ts                # 文章处理
│   ├── useTheme.ts                # 主题管理
│   └── useSearch.ts               # 搜索功能
│
├── server/                        # 📁 后端 API
│   ├── api/
│   │   ├── posts.ts               # GET /api/posts
│   │   ├── stats/
│   │   │   ├── visit.post.ts      # POST /api/stats/visit
│   │   │   └── overview.get.ts    # GET /api/stats/overview
│   │   └── sandbox/
│   │       └── execute.post.ts    # POST /api/sandbox/execute
│   ├── utils/
│   │   └── db.ts                  # 数据库工具
│   └── database/
│       ├── schema.sql             # 数据库结构
│       └── data.db                # SQLite 数据库文件
│
├── content/                       # 📁 Markdown 文章（@nuxt/content）
│   ├── frontend/                  # 前端文章
│   ├── gis/                       # GIS 文章
│   └── vue/                       # Vue 文章
│
├── assets/                        # 📁 需构建的资源
│   └── styles/
│       ├── main.scss              # 全局样式
│       └── theme.scss             # 主题样式
│
├── public/                        # 📁 静态资源
│   └── images/                    # 图片资源
│
├── layouts/                       # 📁 布局组件
│   └── default.vue                # 默认布局
│
├── plugins/                       # 📁 插件
│   └── antd.ts                    # Ant Design Vue
│
├── middleware/                    # 📁 中间件
│   └── stats.ts                   # 访客统计中间件
│
├── utils/                         # 📁 工具函数（需手动导入）
│   └── markdown.ts                # Markdown 解析
│
├── types/                         # 📁 类型定义
│   └── index.ts                   # 全局类型
│
├── .github/                       # 📁 GitHub 配置
│   └── workflows/                 # CI/CD 工作流
│
├── app.vue                        # 根组件
├── nuxt.config.ts                 # Nuxt 配置
├── tailwind.config.ts             # Tailwind 配置（可选）
├── tsconfig.json                  # TypeScript 配置
├── package.json                   # 项目依赖
├── pnpm-lock.yaml                 # 依赖锁定
├── .prettierrc                    # Prettier 配置
├── .gitignore                     # Git 忽略规则
├── CLAUDE.md                      # Claude Code 指导
└── README.md                      # 项目说明
```

---

## 4. 架构设计

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Nuxt 3 应用                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              前端 (Vue 3)                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  Pages   │  │Components│  │Composables│       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │ @nuxt/   │  │ FlexSearch│  │  Monaco  │       │   │
│  │  │ content  │  │  搜索     │  │  Editor  │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          │ useFetch / $fetch            │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           服务端 (Nitro Engine)                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │ server/  │  │ server/  │  │ server/  │       │   │
│  │  │ api/     │  │ utils/   │  │ database │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  │  ┌──────────────────────────────────────┐       │   │
│  │  │           SQLite 数据库               │       │   │
│  │  └──────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 数据流

```
文章浏览流程:
用户访问 → Nuxt 路由 → @nuxt/content 解析 → 渲染页面

代码沙盒流程:
编辑代码 → Monaco Editor → iframe 隔离执行 → 实时预览

访客统计流程:
页面加载 → middleware 拦截 → server API 记录 → SQLite 存储
```

### 4.3 渲染模式

| 页面 | 渲染模式 | 说明 |
|------|---------|------|
| 首页 | SSG | 静态生成，CDN 缓存 |
| 文章列表 | SSG | 静态生成 |
| 文章详情 | SSG | 静态生成 |
| 统计数据 | CSR | 客户端获取 |

---

## 5. API 设计

### 5.1 文章相关

| 方法 | 路径 | 文件 | 描述 |
|------|------|------|------|
| GET | `/api/posts` | `server/api/posts.ts` | 获取文章列表 |
| GET | `/api/posts/:slug` | `server/api/posts/[slug].ts` | 获取文章详情 |
| GET | `/api/categories` | `server/api/categories.ts` | 获取分类列表 |

### 5.2 统计相关

| 方法 | 路径 | 文件 | 描述 |
|------|------|------|------|
| POST | `/api/stats/visit` | `server/api/stats/visit.post.ts` | 记录访问 |
| GET | `/api/stats/overview` | `server/api/stats/overview.get.ts` | 获取统计概览 |

### 5.3 沙盒相关

| 方法 | 路径 | 文件 | 描述 |
|------|------|------|------|
| POST | `/api/sandbox/execute` | `server/api/sandbox/execute.post.ts` | 执行代码（可选） |

---

## 6. 数据库设计

### 6.1 访客统计表

```sql
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visits_page_path ON visits(page_path);
CREATE INDEX idx_visits_created_at ON visits(created_at);
```

### 6.2 页面浏览量表

```sql
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. 文章管理

### 7.1 保存格式

采用 **Markdown + YAML frontmatter** 格式：

```markdown
---
title: 文章标题
description: 文章描述（用于 SEO）
category: frontend
tags:
  - Vue
  - TypeScript
author: wangsen
date: 2026-03-25
updated: 2026-03-25
cover: /images/posts/cover.jpg
---

# 文章标题

这里是正文内容，支持标准 Markdown 语法...

## 二级标题

正文内容...

\`\`\`typescript
// 代码块
const greeting = 'Hello World'
\`\`\`
```

### 7.2 Frontmatter 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 文章描述，用于 SEO |
| `category` | string | ✅ | 分类：frontend / gis / vue |
| `tags` | string[] | ❌ | 标签列表 |
| `author` | string | ❌ | 作者，默认 wangsen |
| `date` | string | ✅ | 发布日期 |
| `updated` | string | ❌ | 更新日期 |
| `cover` | string | ❌ | 封面图片路径 |

### 7.3 存放位置

文章存放在 `content/` 目录，使用 @nuxt/content 管理：

```
content/
├── frontend/                     # 前端分类
│   ├── vue3-composition-api.md
│   ├── typescript-tips.md
│   └── css-grid-layout.md
│
├── gis/                          # GIS 分类
│   ├── mapbox-introduction.md
│   ├── turfjs-guide.md
│   └── leaflet-basics.md
│
├── vue/                          # Vue 分类
│   ├── pinia-state-management.md
│   ├── nuxt3-getting-started.md
│   └── vue-router-advanced.md
│
└── _drafts/                      # 草稿（以下划线开头，不会被渲染）
    └── work-in-progress.md
```

### 7.4 为什么选择文件存储

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Markdown 文件** ⭐ | Git 版本控制、写作简单、部署方便 | - |
| 数据库存储 | 动态管理 | 无版本历史、写作麻烦 |
| 外部 CMS | 功能丰富 | 过度设计、额外成本、依赖外部服务 |

### 7.5 文章处理流程

```
写作 Markdown → Git 提交 → @nuxt/content 解析 → SSG 构建 → 静态页面

具体流程：
1. 在 content/ 目录下创建 .md 文件
2. 填写 frontmatter 元数据
3. 使用 Markdown 编写正文
4. Git 提交并推送
5. CI/CD 自动构建部署
6. 用户访问静态页面
```

### 7.6 图片资源管理

文章图片存放在 `public/images/posts/` 目录：

```
public/
└── images/
    └── posts/
        ├── vue3-composition-api/
        │   ├── screenshot-1.png
        │   └── diagram.svg
        └── mapbox-intro/
            └── map-demo.png
```

在 Markdown 中引用：

```markdown
![图片描述](/images/posts/vue3-composition-api/screenshot-1.png)
```

---

## 8. 部署方案

### 推荐方案：Vercel

```
✅ 原生支持 Nuxt 3
✅ 自动 SSR/SSG
✅ Serverless Functions 支持
✅ 免费额度充足
✅ 自动部署（GitHub 集成）
```

### 备选方案

| 平台 | 优点 | 缺点 |
|------|------|------|
| **Netlify** | 简单易用 | Serverless 限制较多 |
| **Railway** | 支持持久化数据库 | 免费额度有限 |
| **Cloudflare Pages** | 全球 CDN、速度快 | 配置稍复杂 |

### 部署配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel' // 或 'netlify', 'cloudflare-pages'
  }
})
```

---

## 9. 开发规范

### 8.1 代码规范

- 使用 TypeScript 严格模式
- 使用组合式 API (`<script setup lang="ts">`)
- 组件命名：PascalCase
- 文件命名：PascalCase（组件）、camelCase（工具）
- composables 以 `use` 开头

### 8.2 目录规范

| 目录 | 自动导入 | 说明 |
|------|---------|------|
| `components/` | ✅ | 组件 |
| `composables/` | ✅ | 组合式函数 |
| `utils/` | ✅ | 工具函数 |
| `pages/` | ✅ | 页面路由 |
| `server/` | - | 服务端代码 |

### 8.3 Git 规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
```

---

## 10. 迁移计划

### Phase 0: 准备工作

- [ ] 创建 Nuxt 3 项目
- [ ] 配置 TypeScript
- [ ] 配置 Ant Design Vue
- [ ] 配置 SCSS

### Phase 1: 基础迁移

- [ ] 迁移页面组件到 `pages/`
- [ ] 迁移通用组件到 `components/`
- [ ] 迁移工具函数到 `composables/`
- [ ] 迁移样式文件到 `assets/styles/`

### Phase 2: 文章系统

- [ ] 配置 @nuxt/content
- [ ] 迁移 Markdown 文章到 `content/`
- [ ] 实现文章列表页
- [ ] 实现文章详情页

### Phase 3: 后端功能

- [ ] 实现访客统计 API
- [ ] 配置 SQLite 数据库
- [ ] 实现统计展示组件

### Phase 4: 高级功能

- [ ] 集成 FlexSearch 搜索
- [ ] 开发代码沙盒组件
- [ ] 性能优化

### Phase 5: 部署上线

- [ ] 配置 Vercel 部署
- [ ] 配置自定义域名
- [ ] 验证所有功能

---

## 11. 相关文档

- [CLAUDE.md](../CLAUDE.md) - Claude Code 开发指导
- [README.md](../README.md) - 项目说明
- [Nuxt 3 文档](https://nuxt.com/docs)
- [@nuxt/content 文档](https://content.nuxt.com)
