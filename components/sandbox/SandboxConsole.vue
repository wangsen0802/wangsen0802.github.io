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
