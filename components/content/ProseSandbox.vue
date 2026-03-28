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

// @nuxt/content passes code block content as slot
const slots = useSlots()

/** Extract code text from slot VNodes */
const initialCode = computed(() => {
  const children = slots.default?.()
  if (!children) return ''

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

// Initialize code from slot
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

/** Current srcdoc content */
const srcdoc = ref('')

const previewRef = ref<InstanceType<typeof SandboxPreview> | null>(null)

/** Run code */
function runCode() {
  clearConsole()
  const newSrcdoc = buildSrcdoc(currentCode.value)
  if (newSrcdoc === srcdoc.value) {
    // Same code: force iframe reload
    previewRef.value?.reload()
  } else {
    srcdoc.value = newSrcdoc
  }
}

/** Reset code to initial */
function resetCode() {
  currentCode.value = initialCode.value
  clearConsole()
  srcdoc.value = buildSrcdoc(currentCode.value)
}

// Auto-run on mount
onMounted(() => {
  if (currentCode.value) {
    runCode()
  }
})

// Auto-run with debounce
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
    <!-- Toolbar -->
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

    <!-- Editor + Preview -->
    <div class="sandbox-body">
      <SandboxEditor v-model="currentCode" :lang="lang" />
      <SandboxPreview ref="previewRef" :srcdoc="srcdoc" />
    </div>

    <!-- Console output (JS/TS mode only) -->
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

/* Responsive: vertical on mobile */
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
