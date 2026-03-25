# 项目优化迁移清单

> 基于 2026-03-26 架构分析，按优先级排序

## 高优先级

### 1. 404 页面
- [ ] 创建 `src/views/NotFound.vue` 组件
- [ ] 在路由配置中添加 404 捕获路由
- [ ] 设计友好的错误提示页面

### 2. 文章数据缓存
- [ ] 创建 `src/stores/posts.ts` 文章状态管理
- [ ] 实现 `getAllPosts()` 结果缓存
- [ ] 添加缓存失效策略（按需刷新）

### 3. ESLint 配置
- [x] 安装 `eslint` + `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`
- [x] 安装 `eslint-plugin-vue`
- [x] 创建 `eslint.config.js` 配置文件
- [x] 添加 `pnpm lint` 脚本

### 4. 类型优化
- [ ] `src/utils/markdown.ts` 中 `any[]` 替换为严格类型
- [ ] 定义 `MarkdownToken` 接口
- [ ] 定义 `FrontmatterMeta` 接口

## 中优先级

### 5. SEO 优化
- [ ] 安装 `@unhead/vue`
- [ ] 配置动态 meta 标签管理
- [ ] 为每篇文章设置独立的 title/description
- [ ] 添加 Open Graph 标签

### 6. 骨架屏加载
- [ ] 创建 `src/components/Skeleton/` 目录
- [ ] 实现 `PostCardSkeleton.vue` 组件
- [ ] 实现 `PostDetailSkeleton.vue` 组件
- [ ] 在对应页面集成骨架屏

### 7. Sitemap 生成
- [ ] 安装 `vite-plugin-sitemap`
- [ ] 配置动态路由生成
- [ ] 在 `vite.config.ts` 中集成

### 8. 图片压缩
- [ ] 安装 `vite-plugin-imagemin`
- [ ] 配置图片压缩参数
- [ ] 测试构建输出

### 9. 代码复制按钮
- [ ] 创建 `src/components/CodeBlock.vue` 组件
- [ ] 实现一键复制功能
- [ ] 集成到 MarkdownRenderer

### 10. Git Hooks
- [ ] 安装 `husky` + `lint-staged`
- [ ] 配置 pre-commit 钩子
- [ ] 配置 commit-msg 钩子（可选）

## 低优先级

### 11. 文章搜索
- [ ] 评估 `minisearch` vs `fuse.js`
- [ ] 创建 `src/stores/search.ts`
- [ ] 实现搜索组件 UI
- [ ] 添加搜索快捷键支持

### 12. 标签聚合页
- [ ] 创建 `src/views/TagPosts.vue`
- [ ] 添加 `/tags/:tag` 路由
- [ ] 实现标签云组件

### 13. 阅读进度条
- [ ] 创建 `src/components/ReadingProgress.vue`
- [ ] 使用 scroll 事件计算进度
- [ ] 集成到 PostDetail 页面

### 14. 返回顶部
- [ ] 创建 `src/components/BackToTop.vue`
- [ ] 实现平滑滚动效果
- [ ] 添加显示/隐藏动画

### 15. 文章目录 (TOC)
- [ ] 从 Markdown 提取标题列表
- [ ] 创建 `src/components/Toc.vue` 组件
- [ ] 实现点击跳转功能
- [ ] 实现滚动高亮当前章节

### 16. RSS 订阅
- [ ] 创建 RSS 生成脚本
- [ ] 配置构建时生成 `feed.xml`
- [ ] 添加 RSS 订阅链接

### 17. PWA 支持
- [ ] 安装 `vite-plugin-pwa`
- [ ] 创建 `manifest.json`
- [ ] 配置 Service Worker
- [ ] 添加离线提示

### 18. 单元测试
- [ ] 安装 `vitest` + `@vue/test-utils`
- [ ] 配置测试环境
- [ ] 为 `src/utils/` 编写测试用例
- [ ] 添加 `pnpm test` 脚本

### 19. 打包压缩
- [ ] 安装 `vite-plugin-compression`
- [ ] 配置 gzip/brotli 压缩
- [ ] 测试压缩效果

### 20. GitHub Actions 优化
- [ ] 升级 Node.js 版本到 20 LTS
- [ ] 添加缓存优化
- [ ] 添加构建通知

---

## 完成记录

| 日期 | 完成项 | 备注 |
|------|--------|------|
| 2026-03-26 | ESLint 配置 | eslint@10 + typescript-eslint + eslint-plugin-vue |

---

**维护说明**：完成一项后，在对应 checkbox 打勾 `[x]`，并在完成记录表格中添加记录。
