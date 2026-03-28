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

/** Monaco language mapping */
const langMap: Record<SandboxLang, string> = {
  html: 'html',
  js: 'javascript',
  ts: 'typescript',
}

/** Viewport detection: load Monaco only when in view */
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
    { rootMargin: '200px' },
  )

  observer.observe(editorContainer.value)
})

onUnmounted(() => {
  observer?.disconnect()
  editorInstance?.dispose()
})

/** Dynamically load Monaco Editor */
async function loadEditor() {
  try {
    const monaco = await import('monaco-editor')

    // Set up Worker
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
  }
  catch (error) {
    console.error('Monaco 加载失败:', error)
  }
}

/** Sync external code changes to editor */
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance && editorInstance.getValue() !== newVal) {
      editorInstance.setValue(newVal)
    }
  },
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
