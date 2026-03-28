# 代码沙盒模块设计文档

> 日期：2026-03-29

## 概述

在博客文章中嵌入可交互的代码示例，读者可以实时编辑和运行代码并查看结果。

**核心决策：**
- 用途：嵌入文章内的可交互代码示例
- 语言支持：HTML/CSS/JS + TS/JS 代码片段
- 执行方式：纯客户端 iframe 隔离执行
- 编辑器：Monaco Editor（懒加载）
- 嵌入方式：@nuxt/content Markdown 指令（`:::sandbox`）
- 布局：响应式 — 桌面端左右分栏，移动端上下分栏

---

## 1. Markdown 指令语法

### HTML/CSS/JS 模式

````markdown
::sandbox{title="按钮样式示例"}
```html
<button class="btn">点击我</button>

<style>
  .btn {
    background: #333;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

<script>
  document.querySelector('.btn').addEventListener('click', () => {
    alert('Hello!');
  });
</script>
```
::
````

### 纯 JS/TS 模式

````markdown
::sandbox{title="数组去重" lang="js"}
```js
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];
console.log('结果:', unique);
```
::
````

### 指令参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | string | 否 | - | 示例标题，显示在沙盒头部 |
| `lang` | string | 否 | `html` | `html` / `js` / `ts`，决定执行模式 |

---

## 2. 组件架构

```
components/
├── content/
│   └── ProseSandbox.vue      # @nuxt/content 自定义 Prose 组件
├── sandbox/
│   ├── SandboxEditor.vue     # Monaco 编辑器封装（懒加载）
│   ├── SandboxPreview.vue    # iframe 预览面板
│   └── SandboxConsole.vue    # console 输出面板（JS/TS 模式）
```

### 数据流

```
Markdown :::sandbox 指令
  → @nuxt/content 解析
  → ProseSandbox.vue 接收 props (code, lang, title)
  → SandboxEditor.vue 展示代码、允许编辑
  → 用户编辑/点击运行
  → SandboxPreview.vue 组装 HTML 注入 iframe srcdoc
  → 实时渲染预览
```

### 组件职责

**ProseSandbox.vue**：由 @nuxt/content 自动匹配 `:::sandbox` 指令渲染。解析代码块内容，将初始代码、语言、标题作为 props 传递给子组件。管理运行状态和代码重置逻辑。

**SandboxEditor.vue**：封装 Monaco Editor。通过 `defineAsyncComponent` 懒加载，使用 `IntersectionObserver` 在进入视口时才加载。加载期间显示 textarea 占位。接收和同步代码内容。

**SandboxPreview.vue**：HTML 模式下将完整内容注入 iframe `srcdoc` 渲染。JS/TS 模式下将代码包裹在捕获 console 的模板中执行。使用 `sandbox="allow-scripts"` 属性隔离。

**SandboxConsole.vue**：接收 iframe 通过 `postMessage` 发送的 console 输出和错误信息，以列表形式展示。仅 JS/TS 模式显示。

**composables/useSandbox.ts**：沙盒核心逻辑。负责代码组装（HTML 模式直接输出，JS/TS 模式包裹 console 捕获模板）、iframe 消息监听、console 输出状态管理。

---

## 3. 交互与执行机制

### HTML 模式（默认）

1. 编辑器展示完整 HTML（可含 `<style>` 和 `<script>`）
2. 用户编辑时 debounce 500ms 自动运行，或点击"▶ 运行"手动触发
3. 完整内容直接注入 iframe `srcdoc`
4. 预览面板实时渲染视觉效果

### JS/TS 模式

1. 编辑器展示纯 JS/TS 代码
2. 点击"运行"将代码包裹在 iframe 内执行：

```html
<html><body><script>
  const _logs = [];
  const _origLog = console.log;
  console.log = (...args) => {
    _logs.push(args.map(a => JSON.stringify(a)).join(' '));
    _origLog.apply(console, args);
    parent.postMessage({ type: 'sandbox-console', logs: _logs }, '*');
  };
  try {
    // 用户代码注入位置
  } catch(e) {
    parent.postMessage({ type: 'sandbox-error', message: e.message }, '*');
  }
</script></body></html>
```

3. TS 代码通过 iframe 内引入编译器转译后执行
4. 输出展示在底部的 SandboxConsole 面板

### 工具栏

| 按钮 | 功能 |
|------|------|
| ▶ 运行 | 手动触发执行 |
| ↺ 重置 | 恢复初始代码 |

- 默认自动运行（debounce 500ms），可通过工具栏切换为手动模式

### Monaco 加载策略

- 使用 `IntersectionObserver` 检测沙盒进入视口
- 进入视口时才动态 import Monaco
- 加载期间显示 textarea 占位 + "编辑器加载中..." 提示

### iframe 安全

- 使用 `sandbox="allow-scripts"` 属性，禁止访问父页面、发送网络请求等
- JS/TS 模式通过 `postMessage` 白名单通信，仅处理 `{ type: 'sandbox-console' }` 和 `{ type: 'sandbox-error' }` 消息

---

## 4. UI 布局

### 响应式布局

- **桌面端（> 768px）**：左右分栏 — 编辑器在左，预览在右
- **移动端（<= 768px）**：上下分栏 — 编辑器在上，预览在下

### 沙盒结构

```
┌──────────────────────────────────────────┐
│ [标题]              [▶ 运行] [↺ 重置]     │ ← 工具栏
├──────────────────┬───────────────────────┤
│                  │                       │
│   Monaco Editor  │     iframe 预览       │ ← 桌面端左右
│                  │                       │
├──────────────────┴───────────────────────┤
│              Console 输出（JS/TS 模式）   │ ← 可选
└──────────────────────────────────────────┘
```

---

## 5. 依赖与文件变更

### 新增依赖

| 包名 | 用途 |
|------|------|
| `monaco-editor` | Monaco Editor 核心 |

### 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `components/content/ProseSandbox.vue` | 新增 | Prose 组件，匹配 `:::sandbox` 指令 |
| `components/sandbox/SandboxEditor.vue` | 新增 | Monaco 编辑器封装，懒加载 |
| `components/sandbox/SandboxPreview.vue` | 新增 | iframe 预览面板 |
| `components/sandbox/SandboxConsole.vue` | 新增 | console 输出面板 |
| `composables/useSandbox.ts` | 新增 | 沙盒核心逻辑 |
| `nuxt.config.ts` | 修改 | Monaco 相关配置 |
| `package.json` | 修改 | 添加 monaco-editor 依赖 |

### 不在本次范围

- `server/api/sandbox/execute.post.ts` — 纯客户端执行，不需要服务端 API
- 模板系统（Vue Playground、React 演示等）— 后续按需扩展
- 代码分享/URL 持久化 — YAGNI
