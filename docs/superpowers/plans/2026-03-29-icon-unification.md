# 图标统一实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将项目中所有功能性图标统一为 lucide-vue-next，移除 @ant-design/icons-vue 依赖，替换所有 Emoji 和内联 SVG 图标。

**Architecture:** 安装 lucide-vue-next 后按文件逐个替换图标，每个组件直接按需 import，保持一致的风格规范（默认 20px、currentColor 继承）。品牌/装饰组件（SvgLogo/SvgBackground/SvgDivider）保持不变。

**Tech Stack:** lucide-vue-next, Vue 3, Nuxt 3

---

### Task 1: 安装 lucide-vue-next 并移除 @ant-design/icons-vue

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 lucide-vue-next，移除 @ant-design/icons-vue**

```bash
pnpm add lucide-vue-next
pnpm remove @ant-design/icons-vue
```

- [ ] **Step 2: 验证安装成功**

```bash
pnpm ls lucide-vue-next
```

Expected: 显示 lucide-vue-next 版本号

- [ ] **Step 3: 提交依赖变更**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: 添加 lucide-vue-next，移除 @ant-design/icons-vue"
```

---

### Task 2: 替换 SearchModal.vue 中的图标

**Files:**
- Modify: `components/SearchModal.vue`

- [ ] **Step 1: 替换 import 语句**

将第 3 行：
```ts
import { SearchOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons-vue'
```
替换为：
```ts
import { Search, X, FileText } from 'lucide-vue-next'
```

- [ ] **Step 2: 替换 template 中的图标组件**

将所有 `<SearchOutlined` 替换为 `<Search`，`<CloseOutlined` 替换为 `<X`，`<FileTextOutlined` 替换为 `<FileText`。

具体位置：
- 第 174 行 `<SearchOutlined />` → `<Search :size="16" />`
- 第 191 行 `<SearchOutlined class="search-icon" />` → `<Search :size="16" class="search-icon" />`
- 第 209 行 `<CloseOutlined />` → `<X :size="16" />`
- 第 224 行 `<FileTextOutlined class="no-results-icon" />` → `<FileText :size="48" class="no-results-icon" />`

- [ ] **Step 3: 提交**

```bash
git add components/SearchModal.vue
git commit -m "refactor: SearchModal 图标替换为 Lucide"
```

---

### Task 3: 替换 CodeBlock.vue 中的图标

**Files:**
- Modify: `components/CodeBlock.vue`

- [ ] **Step 1: 替换 import 语句**

将第 26 行：
```ts
import { CopyOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
```
替换为：
```ts
import { Copy, Check, CircleX } from 'lucide-vue-next'
```

- [ ] **Step 2: 替换 template 中的图标组件**

- 第 12 行 `<CheckOutlined v-if="isCopied" class="check-icon" />` → `<Check v-if="isCopied" :size="16" class="check-icon" />`
- 第 13 行 `<CloseCircleOutlined v-else-if="copyError" class="error-icon" />` → `<CircleX v-else-if="copyError" :size="16" class="error-icon" />`
- 第 14 行 `<CopyOutlined v-else class="copy-icon" />` → `<Copy v-else :size="16" class="copy-icon" />`

- [ ] **Step 3: 提交**

```bash
git add components/CodeBlock.vue
git commit -m "refactor: CodeBlock 图标替换为 Lucide"
```

---

### Task 4: 替换 ThemeToggle.vue 中的 Emoji

**Files:**
- Modify: `components/ThemeToggle.vue`

- [ ] **Step 1: 添加 import 并替换 template**

在 script setup 中添加：
```ts
import { Moon, Sun } from 'lucide-vue-next'
```

将第 9-10 行：
```vue
<span v-if="isDark">🌙</span>
<span v-else>☀️</span>
```
替换为：
```vue
<Moon v-if="isDark" :size="18" />
<Sun v-else :size="18" />
```

- [ ] **Step 2: 提交**

```bash
git add components/ThemeToggle.vue
git commit -m "refactor: ThemeToggle 图标替换为 Lucide"
```

---

### Task 5: 替换 StatsOverview.vue 中的 Emoji

**Files:**
- Modify: `components/StatsOverview.vue`

- [ ] **Step 1: 添加 import 并替换 template**

在 script setup 中添加：
```ts
import { Eye, Users, FileText } from 'lucide-vue-next'
```

将第 46、53、60 行的 Emoji 替换：
- `<div class="stat-icon">👁️</div>` → `<div class="stat-icon"><Eye :size="20" /></div>`
- `<div class="stat-icon">👥</div>` → `<div class="stat-icon"><Users :size="20" /></div>`
- `<div class="stat-icon">📄</div>` → `<div class="stat-icon"><FileText :size="20" /></div>`

- [ ] **Step 2: 提交**

```bash
git add components/StatsOverview.vue
git commit -m "refactor: StatsOverview 图标替换为 Lucide"
```

---

### Task 6: 替换 pages/index.vue 中的内联 SVG

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: 添加 import 并替换内联 SVG**

在 script setup 中添加：
```ts
import { ArrowRight } from 'lucide-vue-next'
```

将第 55-57 行的内联 SVG：
```vue
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M5 12h14M12 5l7 7-7 7" />
</svg>
```
替换为：
```vue
<ArrowRight :size="16" />
```

- [ ] **Step 2: 验证 hover 动画仍生效**

确认 CSS 中 `svg` 选择器的过渡动画对 Lucide 组件（渲染为 SVG）仍然有效。如不生效，将 CSS 选择器从 `svg` 改为组件的 class。

- [ ] **Step 3: 提交**

```bash
git add pages/index.vue
git commit -m "refactor: 首页箭头图标替换为 Lucide"
```

---

### Task 7: 替换 pages/posts/index.vue 中的内联 SVG

**Files:**
- Modify: `pages/posts/index.vue`

- [ ] **Step 1: 添加 import 并替换内联 SVG**

在 script setup 中添加：
```ts
import { ArrowRight, FileQuestion } from 'lucide-vue-next'
```

将第 119-122 行的内联 SVG 箭头：
```vue
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M5 12h14M12 5l7 7-7 7" />
</svg>
```
替换为：
```vue
<ArrowRight :size="20" />
```

将第 129-131 行的空状态 SVG：
```vue
<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>
```
替换为：
```vue
<FileQuestion :size="48" class="empty-icon" />
```

- [ ] **Step 2: 验证 CSS 样式兼容**

确认 `.post-arrow` 和 `.empty-icon` 的 CSS 样式对 Lucide 组件仍然有效。

- [ ] **Step 3: 提交**

```bash
git add pages/posts/index.vue
git commit -m "refactor: 文章列表页图标替换为 Lucide"
```

---

### Task 8: 替换 pages/posts/[...slug].vue 中的内联 SVG

**Files:**
- Modify: `pages/posts/[...slug].vue`

- [ ] **Step 1: 添加 import 并替换内联 SVG**

在 script setup 中添加：
```ts
import { ArrowLeft } from 'lucide-vue-next'
```

将两处返回箭头内联 SVG（第 83-85 行和第 148-150 行）：
```vue
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M19 12H5M12 19l-7-7 7-7" />
</svg>
```
都替换为：
```vue
<ArrowLeft :size="16" />
```

- [ ] **Step 2: 验证 hover 动画仍生效**

确认 `svg` 选择器的 CSS 过渡动画对 Lucide 组件有效。

- [ ] **Step 3: 提交**

```bash
git add pages/posts/[...slug].vue
git commit -m "refactor: 文章详情页图标替换为 Lucide"
```

---

### Task 9: 替换 pages/about.vue 中的内联 SVG

**Files:**
- Modify: `pages/about.vue`

- [ ] **Step 1: 添加 import 并替换内联 SVG**

在 script setup 中添加：
```ts
import { Github, ExternalLink } from 'lucide-vue-next'
```

将第 62-64 行的 GitHub SVG：
```vue
<svg v-if="link.icon === 'github'" class="link-icon" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0c-6.626 0-12 ..."/>
</svg>
```
替换为：
```vue
<Github v-if="link.icon === 'github'" :size="20" class="link-icon" />
```

将第 66-68 行的外部链接 SVG：
```vue
<svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M7 17L17 7M17 7H7M17 7v10" />
</svg>
```
替换为：
```vue
<ExternalLink :size="16" class="link-arrow" />
```

- [ ] **Step 2: 验证 `.link-icon` 和 `.link-arrow` 样式兼容**

确认 CSS 样式对 Lucide 组件仍然有效。

- [ ] **Step 3: 提交**

```bash
git add pages/about.vue
git commit -m "refactor: 关于页图标替换为 Lucide"
```

---

### Task 10: 替换 error.vue 中的 Emoji

**Files:**
- Modify: `error.vue`

- [ ] **Step 1: 添加 import 并替换所有 Emoji**

在 script setup 中添加：
```ts
import { Home, BookOpen, User, ArrowLeft } from 'lucide-vue-next'
```

替换 template 中的 Emoji：
- 第 57 行 `<span>🏠</span>` → `<Home :size="16" />`
- 第 63 行 `<span>←</span>` → `<ArrowLeft :size="16" />`
- 第 74 行 `<span class="link-icon">🏠</span>` → `<Home :size="20" class="link-icon" />`
- 第 78 行 `<span class="link-icon">📝</span>` → `<BookOpen :size="20" class="link-icon" />`
- 第 82 行 `<span class="link-icon">👤</span>` → `<User :size="20" class="link-icon" />`

- [ ] **Step 2: 验证 `.link-icon` 样式兼容**

- [ ] **Step 3: 提交**

```bash
git add error.vue
git commit -m "refactor: 错误页图标替换为 Lucide"
```

---

### Task 11: 清理 @ant-design/icons-vue 残留引用

**Files:**
- Modify: `assets/styles/ant.scss`（如有图标样式覆盖需清理）

- [ ] **Step 1: 检查是否有残留引用**

```bash
grep -r "@ant-design/icons-vue" --include="*.vue" --include="*.ts" --include="*.scss" .
```

Expected: 无结果

- [ ] **Step 2: 检查 ant.scss 中的图标样式覆盖**

查看 `assets/styles/ant.scss` 中是否有针对 `.anticon` 的样式覆盖，如有则清理。

- [ ] **Step 3: 构建验证**

```bash
pnpm run build
```

Expected: 构建成功，无报错

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "chore: 清理图标残留引用，验证构建"
```

---

### Task 12: 最终验证

- [ ] **Step 1: 启动开发服务器验证**

```bash
pnpm run dev
```

逐页检查所有图标是否正确显示：
- 首页：浏览文章箭头
- 文章列表：箭头指示、空状态
- 文章详情：返回箭头
- 关于页：GitHub、外部链接
- 搜索弹窗：搜索、关闭、文档图标
- 主题切换：月/日图标
- 代码块：复制/成功/错误图标
- 404 页面：导航图标

- [ ] **Step 2: 检查图标风格一致性**

确认所有图标视觉风格统一（线条粗细、圆角、尺寸比例）。
