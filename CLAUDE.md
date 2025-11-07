# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在该代码库中工作时提供指导。

## 项目概述

这是一个使用 Vue
3、TypeScript 和 Vite 构建的个人技术博客网站，主要展示前端开发和GIS技术相关的文章内容。项目已配置自动部署到 GitHub
Pages，遵循现代 Vue.js 开发模式。

## 架构概述

### 技术栈

- **Vue 3** (组合式 API)
- **TypeScript** (严格模式)
- **Vite 5.x** 构建工具
- **Vue Router 4** 路由管理
- **Pinia 3** 状态管理
- **SCSS** 样式预处理器
- **Ant Design Vue** UI组件库
- **markdown-it** Markdown解析
- **highlight.js** 代码高亮
- **GSAP** 动画库
- **Prettier** 代码格式化

### 核心功能

1. **首页展示** - 个人介绍和技术栈展示
2. **文章系统** - 支持分类浏览和详情查看
3. **Markdown渲染** - 自动解析和高亮代码
4. **主题切换** - 支持暗色/亮色模式
5. **响应式设计** - 适配移动端和桌面端

### 项目结构

```
src/
├── App.vue              # 根组件，包含导航和布局
├── main.ts              # 应用程序入口点
├── style.css            # 全局样式
├── vite-env.d.ts        # TypeScript 环境声明
├── router/              # Vue Router 配置
│   └── index.ts         # 路由定义和导航守卫
├── stores/              # Pinia 状态存储
│   └── index.ts         # 应用和用户状态管理
├── components/          # 可复用组件
│   ├── Navigation.vue   # 导航组件
│   ├── ThemeToggle.vue  # 主题切换组件
│   └── MarkdownRenderer.vue # Markdown渲染器
├── views/               # 页面组件
│   ├── Home.vue         # 首页
│   ├── About.vue        # 关于页面
│   ├── PostsList.vue    # 文章列表页
│   ├── CategoryPosts.vue # 分类文章页
│   ├── PostDetail.vue   # 文章详情页
│   └── demos/
│       └── mapbox/
│           └── index.vue # Mapbox示例
├── utils/               # 工具函数
│   ├── posts.ts         # 文章处理工具
│   └── markdown.ts      # Markdown解析工具
├── styles/              # 样式文件
│   └── theme.scss       # 主题样式
├── posts/               # Markdown文章
│   ├── frontend/        # 前端相关文章
│   ├── gis/            # GIS相关文章
│   └── vue/            # Vue.js相关文章
└── assets/              # 静态资源
    └── images/          # 图片资源
```

## 开发工作流

### 开发命令

```bash
# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产构建
pnpm run preview

# 代码格式化
pnpm run format

# 检查代码格式
pnpm run format:check
```

### 包管理

- 使用 **pnpm** 进行包管理
- 依赖通过 `pnpm-lock.yaml` 锁定版本

## 架构与结构详解

### Vue Router 配置

路由配置位于 `src/router/index.ts`，包含以下路由：

- **首页** `/` - 展示个人介绍和技术栈
- **文章列表** `/posts` - 显示所有文章列表
- **分类文章** `/posts/:category` - 显示特定分类的文章
- **文章详情** `/posts/:category/:id` - 显示文章具体内容
- **Mapbox示例** `/mapbox` - GIS地图演示
- **关于页面** `/about` - 个人介绍页面

### Pinia 状态管理

状态管理位于 `src/stores/index.ts`：

- **App Store**: 全局应用状态（加载状态、主题设置等）
- **User Store**: 用户认证和资料信息
- **TypeScript**: 完整的类型安全支持

### 组件设计模式

- **组合式 API**: 所有组件使用 `<script setup lang="ts">` 语法
- **响应式设计**: 移动端优先，响应式布局
- **主题系统**: 支持暗色/亮色主题切换
- **TypeScript**: 严格的类型检查和智能提示

### 文章系统

文章系统基于 Markdown 文件：

- **文件位置**: `src/posts/` 目录下按分类组织
- **Frontmatter**: 支持YAML格式的文章元数据
- **自动解析**: 工具函数自动解析文章内容和元信息
- **代码高亮**: 使用highlight.js进行语法高亮
- **分类管理**: 支持多级分类和标签系统

### 构建配置

- **TypeScript**: 严格模式，全面类型检查
- **Vite**: 快速开发服务器和生产优化
- **代码分割**: 自动代码分割和懒加载
- **资源处理**: 正确处理图片、字体等静态资源
- **输出优化**: 生产环境构建优化

## 开发规范

### 添加新文章

1. 在 `src/posts/` 对应分类目录下创建 `.md` 文件
2. 添加 YAML frontmatter 元数据
3. 使用 Markdown 语法编写内容
4. 文章会自动出现在网站中

### 添加新页面

1. 在 `src/views/` 中创建组件
2. 在 `src/router/index.ts` 中添加路由
3. 设置页面标题元数据

### 组件开发

- 使用组合式 API 和 TypeScript
- 遵循单一职责原则
- 添加适当的类型定义
- 保持响应式设计

### 样式规范

- 使用 SCSS 和组件作用域样式
- 利用 CSS 自定义属性进行主题管理
- 保持移动端优先的响应式设计
- 遵循设计系统的一致性

## 部署配置

### GitHub Pages

- 通过 GitHub Actions 自动部署
- 构建并部署到 `gh-pages` 分支
- 确保构建测试通过后再提交

### 环境变量

- 生产环境配置在 Vite 中管理
- 敏感信息通过环境变量传递

## 关键文件说明

- `src/main.ts`: 应用初始化入口
- `src/router/index.ts`: 路由配置和导航逻辑
- `src/stores/index.ts`: 全局状态管理
- `src/App.vue`: 主布局组件
- `src/utils/posts.ts`: 文章数据处理逻辑
- `src/utils/markdown.ts`: Markdown解析和渲染
- `vite.config.ts`: Vite构建工具配置
- `package.json`: 项目依赖和脚本配置

## 常见问题

### 开发环境问题

- 确保使用 `pnpm` 而非 `npm` 或 `yarn`
- 如果遇到类型错误，检查 TypeScript 配置
- 确保所有依赖已正确安装

### 构建问题

- 检查所有 TypeScript 类型错误
- 确保 Vite 配置正确
- 验证所有文件路径和引用

### 部署问题

- 检查 GitHub Actions 工作流
- 确保构建输出正确
- 验证 GitHub Pages 配置

---

**注意**: 此项目专注于技术博客内容展示，保持代码简洁和功能明确。在开发新功能时，请确保与现有架构保持一致。
