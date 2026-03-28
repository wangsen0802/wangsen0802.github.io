# 项目优化迁移清单

> 基于 2026-03-28 更新，按优先级排序

## 高优先级

### 1. 404 页面 ✅
- [x] 创建 `error.vue` 组件（Nuxt 3 约定）
- [x] 设计友好的错误提示页面
- [x] 支持暗色/亮色主题
- [x] 提供返回首页和快速导航

### 2. 文章数据缓存 ✅
- [x] 创建 `composables/usePostsCache.ts` 文章状态管理
- [x] 实现文章列表缓存
- [x] 添加缓存失效策略（按需刷新）

### 3. ESLint 配置 ✅
- [x] 安装 `eslint` + `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`
- [x] 安装 `eslint-plugin-vue`
- [x] 创建 `eslint.config.js` 配置文件
- [x] 添加 `pnpm lint` 脚本

### 4. 类型优化 ✅
- [x] `types/index.ts` 中 `any` 替换为严格类型
- [x] 定义 `MetaTag` 接口（useSeo.ts）
- [x] 定义 `ContentDoc` 接口（search.index.get.ts）
- [x] 消除 `pages/posts/index.vue` 中的 `any` 类型

## 中优先级

### 5. SEO 优化 ✅
- [x] 创建 `composables/useSeo.ts` SEO 工具函数
- [x] 配置动态 meta 标签管理
- [x] 为每篇文章设置独立的 title/description
- [x] 添加 Open Graph 标签
- [x] 添加 Twitter Card 标签

### 6. 骨架屏加载 ✅
- [x] 创建 `components/skeleton/PostCardSkeleton.vue`
- [x] 创建 `components/skeleton/PostDetailSkeleton.vue`
- [x] 实现 shimmer 动画效果
- [x] 支持暗色/亮色主题

### 7. Sitemap 生成 ✅
- [x] 安装 `@nuxtjs/sitemap` 模块
- [x] 配置动态路由生成
- [x] 在 `nuxt.config.ts` 中集成

### 8. 图片压缩
- [ ] 使用 Nuxt Image 模块
- [ ] 配置图片压缩参数
- [ ] 测试构建输出

### 9. 代码复制按钮 ✅
- [x] 创建 `components/CodeBlock.vue` 组件
- [x] 创建 `composables/useCodeCopy.ts`
- [x] 创建 `plugins/codeCopy.client.ts` 自动集成
- [x] 实现一键复制功能

### 10. Git Hooks
- [ ] 安装 `husky` + `lint-staged`
- [ ] 配置 pre-commit 钩子
- [ ] 配置 commit-msg 钩子（可选）

## 低优先级

### 11. 文章搜索 ✅
- [x] 安装 `flexsearch` 依赖
- [x] 创建 `composables/useSearch.ts`
- [x] 创建 `components/SearchModal.vue`
- [x] 添加搜索快捷键支持（Ctrl/Cmd + K）
- [x] 支持中英文搜索

### 12. 标签聚合页
- [ ] 创建 `pages/tags/[tag].vue`
- [ ] 实现标签云组件

### 13. 阅读进度条
- [ ] 创建 `components/ReadingProgress.vue`
- [ ] 使用 scroll 事件计算进度
- [ ] 集成到文章详情页

### 14. 返回顶部
- [ ] 创建 `components/BackToTop.vue`
- [ ] 实现平滑滚动效果
- [ ] 添加显示/隐藏动画

### 15. 文章目录 (TOC)
- [ ] 从 Markdown 提取标题列表
- [ ] 创建 `components/Toc.vue` 组件
- [ ] 实现点击跳转功能
- [ ] 实现滚动高亮当前章节

### 16. RSS 订阅
- [ ] 创建 RSS 生成脚本
- [ ] 配置构建时生成 `feed.xml`
- [ ] 添加 RSS 订阅链接

### 17. PWA 支持
- [ ] 安装 `@vite-pwa/nuxt` 模块
- [ ] 配置 PWA manifest
- [ ] 配置 Service Worker
- [ ] 添加离线提示

### 18. 单元测试
- [ ] 安装 `vitest` + `@vue/test-utils`
- [ ] 配置测试环境
- [ ] 为 `composables/` 编写测试用例
- [ ] 添加 `pnpm test` 脚本

### 19. 打包压缩
- [ ] 配置 Nitro 压缩选项
- [ ] 配置 gzip/brotli 压缩
- [ ] 测试压缩效果

### 20. GitHub Actions 优化
- [x] 升级 Node.js 版本到 20 LTS
- [ ] 添加缓存优化
- [ ] 添加构建通知

---

## 完成记录

| 日期 | 完成项 | 备注 |
|------|--------|------|
| 2026-03-28 | 文章数据缓存 | usePostsCache composable + 分类/路径查询 + 刷新策略 |
| 2026-03-28 | 类型优化 | 替换 any → unknown/MetaTag/ContentDoc，消除页面级 any |
| 2026-03-28 | SEO 优化 | useSeo composable + Open Graph + Twitter Card |
| 2026-03-28 | FlexSearch 搜索 | SearchModal + useSearch + 快捷键 |
| 2026-03-28 | 骨架屏组件 | PostCardSkeleton + PostDetailSkeleton |
| 2026-03-28 | 代码复制按钮 | CodeBlock + useCodeCopy + 自动集成插件 |
| 2026-03-28 | 404 错误页面 | error.vue + 主题支持 |
| 2026-03-28 | 清理旧代码 | 删除 src/ 目录，迁移图片到 public/images/ |
| 2026-03-26 | ESLint 配置 | eslint@10 + typescript-eslint + eslint-plugin-vue |
| 2026-03-28 | Sitemap 生成 | @nuxtjs/sitemap + 动态文章路由 + 排除 demo 页面 |

---

**维护说明**：完成一项后，在对应 checkbox 打勾 `[x]`，并在完成记录表格中添加记录。
