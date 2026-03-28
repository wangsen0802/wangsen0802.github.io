# 代码沙盒模块实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在博客文章中嵌入可交互的代码沙盒，支持 HTML/CSS/JS 和 TS/JS 代码片段的实时编辑与预览。

**Architecture:** Monaco Editor 编辑代码 → 组装 HTML → iframe srcdoc 隔离执行 → 实时预览。通过 @nuxt/content 的自定义 Prose 组件（`ProseSandbox`）匹配 `:::sandbox` Markdown 指令渲染。Monaco 懒加载，仅在进入视口时加载。

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Monaco Editor, @nuxt/content v3, TypeScript, SCSS

**Design Spec:** `docs/superpowers/specs/2026-03-29-code-sandbox-design.md`

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `composables/useSandbox.ts` | 新增 | 沙盒核心逻辑：代码组装、iframe 通信、console 捕获 |
| `components/sandbox/SandboxPreview.vue` | 新增 | iframe 预览面板，接收组装后的 HTML 渲染 |
| `components/sandbox/SandboxConsole.vue` | 新增 | console 输出面板，展示 JS/TS 执行结果 |
| `components/sandbox/SandboxEditor.vue` | 新增 | Monaco 编辑器封装，懒加载 + 视口检测 |
| `components/content/ProseSandbox.vue` | 新增 | @nuxt/content Prose 组件，匹配 `:::sandbox` 指令 |
| `package.json` | 修改 | 添加 monaco-editor 依赖 |
| `nuxt.config.ts` | 修改 | 添加 Vite Monaco 配置 |

---

### Task 1: 安装 Monaco Editor 依赖

**Files:**
- Modify: `package.json`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: 安装 monaco-editor**

Run:
```bash
pnpm add monaco-editor
```

Expected: `package.json` 中新增 `"monaco-editor": "^0.x.0"`

- [ ] **Step 2: 配置 nuxt.config.ts 支持 Monaco Worker**

在 `nuxt.config.ts` 的 `vite` 配置中添加 Monaco Worker 支持：

```ts
// vite 配置中添加
vite: {
  optimizeDeps: {
    include: ['monaco-editor'],
  },
},
```

- [ ] **Step 3: 验证安装**

Run:
```bash
pnpm run dev
```

Expected: 开发服务器正常启动，无报错

- [ ] **Step 4: 提交**

```bash
git add package.json pnpm-lock.yaml nuxt.config.ts
git commit -m "chore: 添加 monaco-editor 依赖"
```

---

### Task 2: 实现 useSandbox composable

**Files:**
- Create: `composables/useSandbox.ts`

这是沙盒的核心逻辑层，负责代码组装和 iframe 通信。

- [ ] **Step 1: 创建 composable 文件**

创建 `composables/useSandbox.ts`：

```ts
import { ref, onMounted, onUnmounted } from 'vue'

export type SandboxLang = 'html' | 'js' | 'ts'

export interface SandboxConsoleEntry {
  type: 'log' | 'error' | 'warn'
  args: string[]
}

export function useSandbox(lang: SandboxLang = 'html') {
  const consoleOutput = ref<SandboxConsoleEntry[]>([])
  const isRunning = ref(false)

  /** 组装 HTML 模板用于 iframe srcdoc */
  function buildSrcdoc(code: string): string {
    if (lang === 'html') {
      return code
    }

    // JS/TS 模式：包裹 console 捕获模板
    const escapedCode = code.replace(/<\/script>/g, '<\\/script>')
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<script>
(function() {
  var _logs = [];
  var _origLog = console.log;
  var _origError = console.error;
  var _origWarn = console.warn;

  function _sendLogs() {
    parent.postMessage({ type: 'sandbox-console', logs: _logs }, '*');
  }

  console.log = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
      catch(e) { return String(a); }
    });
    _logs.push({ type: 'log', args: args });
    _origLog.apply(console, arguments);
    _sendLogs();
  };

  console.error = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) { return String(a); });
    _logs.push({ type: 'error', args: args });
    _origError.apply(console, arguments);
    _sendLogs();
  };

  console.warn = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) { return String(a); });
    _logs.push({ type: 'warn', args: args });
    _origWarn.apply(console, arguments);
    _sendLogs();
  };

  try {
    ${escapedCode}
  } catch(e) {
    _logs.push({ type: 'error', args: [e.message] });
    _sendLogs();
  }
})();
<\/script>
</body></html>`
  }

  /** 处理 iframe postMessage */
  function handleMessage(event: MessageEvent) {
    if (event.data?.type === 'sandbox-console' && Array.isArray(event.data.logs)) {
      consoleOutput.value = event.data.logs.map((entry: { type: string; args: string[] }) => ({
        type: entry.type as SandboxConsoleEntry['type'],
        args: entry.args,
      }))
    }
  }

  /** 清空 console 输出 */
  function clearConsole() {
    consoleOutput.value = []
  }

  onMounted(() => {
    window.addEventListener('message', handleMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })

  return {
    consoleOutput,
    isRunning,
    buildSrcdoc,
    clearConsole,
  }
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run:
```bash
pnpm nuxi typecheck 2>&1 | head -20
```

Expected: 无类型错误（或仅有已存在的错误）

- [ ] **Step 3: 提交**

```bash
git add composables/useSandbox.ts
git commit -m "feat: 添加 useSandbox composable 沙盒核心逻辑"
```

---

### Task 3: 实现 SandboxPreview 组件

**Files:**
- Create: `components/sandbox/SandboxPreview.vue`

- [ ] **Step 1: 创建预览组件**

创建 `components/sandbox/SandboxPreview.vue`：

```vue
<script setup lang="ts">
interface Props {
  srcdoc: string
}

const props = defineProps<Props>()

const iframeRef = ref<HTMLIFrameElement | null>(null)

/** 重新加载 iframe 内容 */
function reload() {
  if (iframeRef.value) {
    // 通过重新赋值 srcdoc 触发刷新
    const doc = props.srcdoc
    iframeRef.value.srcdoc = ''
    nextTick(() => {
      if (iframeRef.value) {
        iframeRef.value.srcdoc = doc
      }
    })
  }
}

defineExpose({ reload })
</script>

<template>
  <div class="sandbox-preview">
    <iframe
      ref="iframeRef"
      class="sandbox-iframe"
      sandbox="allow-scripts"
      :srcdoc="srcdoc"
    />
  </div>
</template>

<style scoped lang="scss">
.sandbox-preview {
  flex: 1;
  min-height: 120px;
  background: #fff;
  overflow: hidden;
}

.sandbox-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
}

.dark .sandbox-preview {
  background: #1c1917;
}

.dark .sandbox-iframe {
  background: #1c1917;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/sandbox/SandboxPreview.vue
git commit -m "feat: 添加 SandboxPreview iframe 预览组件"
```

---

### Task 4: 实现 SandboxConsole 组件

**Files:**
- Create: `components/sandbox/SandboxConsole.vue`

- [ ] **Step 1: 创建 console 输出组件**

创建 `components/sandbox/SandboxConsole.vue`：

```vue
<script setup lang="ts">
import type { SandboxConsoleEntry } from '~/composables/useSandbox'

interface Props {
  entries: SandboxConsoleEntry[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="entries.length > 0" class="sandbox-console">
    <div class="console-header">
      <span class="console-title">Console</span>
    </div>
    <div class="console-entries">
      <div
        v-for="(entry, i) in entries"
        :key="i"
        class="console-entry"
        :class="entry.type"
      >
        <span class="entry-prefix">{{ entry.type === 'error' ? '✕' : entry.type === 'warn' ? '⚠' : '›' }}</span>
        <span class="entry-text">{{ entry.args.join(' ') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sandbox-console {
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.console-header {
  padding: 4px 12px;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
}

.console-title {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.console-entries {
  max-height: 150px;
  overflow-y: auto;
  padding: 4px 0;
}

.console-entry {
  padding: 2px 12px;
  display: flex;
  gap: 6px;
  align-items: flex-start;

  &.log {
    color: var(--text-primary);
  }

  &.error {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }

  &.warn {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }
}

.entry-prefix {
  flex-shrink: 0;
  opacity: 0.6;
}

.entry-text {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/sandbox/SandboxConsole.vue
git commit -m "feat: 添加 SandboxConsole 输出面板组件"
```

---

### Task 5: 实现 SandboxEditor 组件

**Files:**
- Create: `components/sandbox/SandboxEditor.vue`

这是最复杂的组件，封装 Monaco Editor 并实现懒加载。

- [ ] **Step 1: 创建编辑器组件**

创建 `components/sandbox/SandboxEditor.vue`：

```vue
<script setup lang="ts">
import type { SandboxLang } from '~/composables/useSandbox'

interface Props {
  modelValue: string
  lang: SandboxLang
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement | null>(null)
const isEditorLoaded = ref(false)
const isInView = ref(false)
let editorInstance: any = null

/** Monaco 语言映射 */
const langMap: Record<SandboxLang, string> = {
  html: 'html',
  js: 'javascript',
  ts: 'typescript',
}

/** 视口检测：进入视口时才加载 Monaco */
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!editorContainer.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !isInView.value) {
        isInView.value = true
        loadEditor()
      }
    },
    { rootMargin: '200px' }
  )

  observer.observe(editorContainer.value)
})

onUnmounted(() => {
  observer?.disconnect()
  editorInstance?.dispose()
})

/** 动态加载 Monaco Editor */
async function loadEditor() {
  try {
    const monaco = await import('monaco-editor')

    // 设置 Worker
    const workerUrl = await import('monaco-editor/esm/vs/editor/editor.worker?worker')
    self.MonacoEnvironment = {
      getWorker() {
        return new workerUrl.default()
      },
    }

    if (!editorContainer.value) return

    editorInstance = monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: langMap[props.lang],
      theme: 'vs-dark',
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      fontSize: 13,
      lineHeight: 20,
      padding: { top: 8, bottom: 8 },
      renderLineHighlight: 'none',
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
      wordWrap: 'on',
      automaticLayout: true,
    })

    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance.getValue()
      emit('update:modelValue', value)
    })

    isEditorLoaded.value = true
  } catch (error) {
    console.error('Monaco 加载失败:', error)
  }
}

/** 外部更新代码时同步到编辑器 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance && editorInstance.getValue() !== newVal) {
      editorInstance.setValue(newVal)
    }
  }
)
</script>

<template>
  <div class="sandbox-editor">
    <div v-if="!isEditorLoaded" class="editor-loading">
      <textarea
        class="editor-textarea"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <div v-if="isInView" class="loading-hint">编辑器加载中...</div>
    </div>
    <div ref="editorContainer" class="editor-monaco" />
  </div>
</template>

<style scoped lang="scss">
.sandbox-editor {
  flex: 1;
  min-height: 120px;
  min-width: 0;
  position: relative;
  overflow: hidden;
}

.editor-loading {
  width: 100%;
  height: 100%;
  position: relative;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  tab-size: 2;
}

.loading-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.editor-monaco {
  width: 100%;
  height: 100%;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/sandbox/SandboxEditor.vue
git commit -m "feat: 添加 SandboxEditor Monaco 编辑器组件"
```

---

### Task 6: 实现 ProseSandbox 主组件

**Files:**
- Create: `components/content/ProseSandbox.vue`

这是 @nuxt/content 的自定义 Prose 组件，匹配 `:::sandbox` 指令。组合编辑器、预览、console 三个子组件。

- [ ] **Step 1: 创建 Prose 组件**

创建 `components/content/ProseSandbox.vue`：

```vue
<script setup lang="ts">
import { Play, RotateCcw } from 'lucide-vue-next'
import type { SandboxLang } from '~/composables/useSandbox'

interface Props {
  title?: string
  lang?: SandboxLang
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  lang: 'html' as SandboxLang,
})

// @nuxt/content 会将 :::sandbox 内的代码块作为 slot 传入
const slots = useSlots()

/** 从 slot 中提取代码文本 */
const initialCode = computed(() => {
  const children = slots.default?.()
  if (!children) return ''

  // 遍历 slot 子节点，提取文本内容
  function extractText(vnodes: any[]): string {
    let text = ''
    for (const vnode of vnodes) {
      if (typeof vnode.children === 'string') {
        text += vnode.children
      } else if (Array.isArray(vnode.children)) {
        text += extractText(vnode.children)
      } else if (vnode.children?.default) {
        text += extractText(vnode.children.default())
      }
    }
    return text
  }

  return extractText(children).trim()
})

const currentCode = ref('')

// 初始化代码
watch(
  initialCode,
  (code) => {
    if (code && !currentCode.value) {
      currentCode.value = code
    }
  },
  { immediate: true }
)

const { consoleOutput, buildSrcdoc, clearConsole } = useSandbox(props.lang)

/** 当前 srcdoc 内容 */
const srcdoc = ref('')

/** 运行代码 */
function runCode() {
  clearConsole()
  srcdoc.value = buildSrcdoc(currentCode.value)
}

/** 重置代码 */
function resetCode() {
  currentCode.value = initialCode.value
  clearConsole()
  srcdoc.value = buildSrcdoc(currentCode.value)
}

// 初始自动运行
onMounted(() => {
  if (currentCode.value) {
    runCode()
  }
})

// 自动运行（debounce）
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(currentCode, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    runCode()
  }, 500)
})
</script>

<template>
  <div class="prose-sandbox">
    <!-- 工具栏 -->
    <div class="sandbox-toolbar">
      <span class="sandbox-title">{{ title || '代码示例' }}</span>
      <div class="sandbox-actions">
        <button class="sandbox-btn" title="运行" @click="runCode">
          <Play :size="14" />
          <span>运行</span>
        </button>
        <button class="sandbox-btn" title="重置" @click="resetCode">
          <RotateCcw :size="14" />
          <span>重置</span>
        </button>
      </div>
    </div>

    <!-- 编辑器 + 预览 -->
    <div class="sandbox-body">
      <SandboxEditor v-model="currentCode" :lang="lang" />
      <SandboxPreview :srcdoc="srcdoc" />
    </div>

    <!-- Console 输出（JS/TS 模式） -->
    <SandboxConsole v-if="lang !== 'html'" :entries="consoleOutput" />
  </div>
</template>

<style scoped lang="scss">
.prose-sandbox {
  margin: 1.5rem 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
  overflow: hidden;
  background: var(--bg-primary);
}

.sandbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.sandbox-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.sandbox-actions {
  display: flex;
  gap: 6px;
}

.sandbox-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  font-family: var(--font-mono);

  &:hover {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    background: var(--accent-subtle);
  }

  &:active {
    transform: scale(0.97);
  }
}

.sandbox-body {
  display: flex;
  height: 240px;
}

/* 响应式：移动端上下分栏 */
@media (max-width: 768px) {
  .sandbox-body {
    flex-direction: column;
    height: auto;

    > * {
      height: 180px;
    }
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/content/ProseSandbox.vue
git commit -m "feat: 添加 ProseSandbox 文章内嵌代码沙盒组件"
```

---

### Task 7: 创建测试文章验证功能

**Files:**
- Create: `content/frontend/sandbox-demo.md`

- [ ] **Step 1: 创建包含沙盒示例的测试文章**

创建 `content/frontend/sandbox-demo.md`：

```markdown
---
title: 代码沙盒演示
description: 演示博客内嵌代码沙盒功能
category: frontend
date: 2026-03-29
author: wangsen
tags: ["demo", "sandbox"]
---

# 代码沙盒演示

这是一个 HTML 沙盒示例：

::sandbox{title="按钮点击示例"}
```html
<div style="text-align: center; padding: 20px;">
  <h2>Hello Sandbox!</h2>
  <button id="btn" style="padding: 8px 24px; background: #4a7c59; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
    点击计数: 0
  </button>
</div>

<script>
  let count = 0;
  const btn = document.getElementById('btn');
  btn.addEventListener('click', () => {
    count++;
    btn.textContent = '点击计数: ' + count;
  });
</script>
```
::

这是一个 JS 沙盒示例：

::sandbox{title="数组操作" lang="js"}
```js
const fruits = ['苹果', '香蕉', '橙子', '葡萄', '西瓜'];
console.log('原始数组:', fruits);

const filtered = fruits.filter(f => f.length <= 2);
console.log('两个字的水果:', filtered);

const upper = fruits.map(f => f.toUpperCase());
console.log('大写:', upper);
```
::
```

- [ ] **Step 2: 启动开发服务器验证**

Run:
```bash
pnpm run dev
```

打开浏览器访问该文章页面，检查：
1. 沙盒组件是否正确渲染
2. Monaco 编辑器是否加载并显示初始代码
3. 预览面板是否实时显示 HTML 效果
4. JS 模式 console 输出是否正常
5. 运行/重置按钮是否工作
6. 响应式布局在移动端是否切换为上下分栏

Expected: 所有功能正常

- [ ] **Step 3: 提交测试文章**

```bash
git add content/frontend/sandbox-demo.md
git commit -m "docs: 添加代码沙盒演示文章"
```

---

### Task 8: 最终验证与清理

- [ ] **Step 1: 运行构建验证**

Run:
```bash
pnpm run build
```

Expected: 构建成功，无错误

- [ ] **Step 2: 检查所有文件已提交**

Run:
```bash
git status
```

Expected: 工作区干净

- [ ] **Step 3: 更新 ARCHITECTURE.md 状态**

在 `docs/ARCHITECTURE.md` Phase 4 部分将代码沙盒标记为已完成：

```markdown
- [x] 开发代码沙盒组件
```

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: 更新架构文档，标记代码沙盒为已完成"
```
