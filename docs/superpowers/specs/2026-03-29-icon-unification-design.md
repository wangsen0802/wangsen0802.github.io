# 图标设计语言统一方案

## 背景

项目中图标来源混杂，存在 4 种不同的图标方案：
- `@ant-design/icons-vue`（6 个功能性图标）
- 内联 SVG（15+ 个箭头、链接等）
- Emoji（8 个主题切换、统计、错误页面）
- 自定义 SVG 组件（4 个品牌/装饰）

视觉风格不统一：Ant Design 线性风格 vs 内联 SVG 粗细不一 vs Emoji 像素风格。

## 技术选型

- **唯一图标库**：`lucide-vue-next`，按需 import
- **引入方式**：组件中直接 `import { IconName } from 'lucide-vue-next'`
- **移除依赖**：`@ant-design/icons-vue`
- **保留不变**：SvgLogo、SvgBackground、SvgDivider（品牌/装饰组件）`

## 图标映射表

### 搜索弹窗 (`components/SearchModal.vue`)

| 用途 | 当前 | 替换为 |
|------|------|--------|
| 搜索 | `SearchOutlined` | `Search` |
| 关闭 | `CloseOutlined` | `X` |
| 文档 | `FileTextOutlined` | `FileText` |

### 代码块 (`components/CodeBlock.vue`)

| 用途 | 当前 | 替换为 |
|------|------|--------|
| 复制 | `CopyOutlined` | `Copy` |
| 成功 | `CheckOutlined` | `Check` |
| 错误 | `CloseCircleOutlined` | `CircleX` |

### 主题切换 (`components/ThemeToggle.vue`)

| 用途 | 当前 | 替换为 |
|------|------|--------|
| 暗色 | 🌙 | `Moon` |
| 亮色 | ☀️ | `Sun` |

### 错误页面 (`error.vue`)

| 用途 | 当前 | 替换为 |
|------|------|--------|
| 首页 | 🏠 | `Home` |
| 文章 | 📝 | `BookOpen` |
| 关于 | 👤 | `User` |

### 统计概览 (`components/StatsOverview.vue`)

| 用途 | 当前 | 替换为 |
|------|------|--------|
| 浏览量 | 👁️ | `Eye` |
| 访客数 | 👥 | `Users` |
| 页面数 | 📄 | `FileText` |

### 页面级图标

| 文件 | 用途 | 当前 | 替换为 |
|------|------|------|--------|
| `pages/index.vue` | 箭头指示 | 内联 SVG | `ChevronRight` |
| `pages/posts/index.vue` | 箭头指示 | 内联 SVG | `ChevronRight` |
| `pages/posts/index.vue` | 空状态 | 内联 SVG | `FileQuestion` |
| `pages/posts/[...slug].vue` | 返回 | 内联 SVG | `ArrowLeft` |
| `pages/about.vue` | GitHub | 内联 SVG | `Github` |
| `pages/about.vue` | 外部链接 | 内联 SVG | `ExternalLink` |

## 图标样式规范

- **默认尺寸**：20px（`:size="20"`）
- **默认线宽**：2px（Lucide 默认）
- **颜色**：继承 `currentColor`，通过 CSS `color` 控制
- **可访问性**：装饰性图标 `aria-hidden="true"`，功能性图标 `aria-label`

## 影响文件

- `components/SearchModal.vue`
- `components/CodeBlock.vue`
- `components/ThemeToggle.vue`
- `components/StatsOverview.vue`
- `pages/index.vue`
- `pages/posts/index.vue`
- `pages/posts/[...slug].vue`
- `pages/about.vue`
- `error.vue`
- `package.json`

## 不变部分

- `SvgLogo.vue` — 品牌 logo
- `SvgBackground.vue` — 动态背景
- `SvgDivider.vue` — 装饰分割线
- `public/favicon.svg` — 网站图标
