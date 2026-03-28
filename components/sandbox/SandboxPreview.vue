<script setup lang="ts">
interface Props {
  srcdoc: string
}

const props = defineProps<Props>()

const iframeRef = ref<HTMLIFrameElement | null>(null)

/** Reload iframe content */
function reload() {
  if (iframeRef.value) {
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
