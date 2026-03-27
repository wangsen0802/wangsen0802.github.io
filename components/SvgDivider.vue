<script setup lang="ts">
defineProps<{
  variant?: 'wave' | 'line' | 'dots' | 'zen'
}>()
</script>

<template>
  <div class="svg-divider" :class="variant || 'zen'">
    <!-- 禅意风格 - 简约线条 -->
    <svg v-if="variant === 'zen' || !variant" viewBox="0 0 400 20" class="divider-svg">
      <line
        x1="50"
        y1="10"
        x2="175"
        y2="10"
        stroke="var(--border-primary)"
        stroke-width="0.5"
        class="zen-line left"
      />
      <circle cx="200" cy="10" r="3" fill="var(--accent-primary)" class="zen-dot center" />
      <line
        x1="225"
        y1="10"
        x2="350"
        y2="10"
        stroke="var(--border-primary)"
        stroke-width="0.5"
        class="zen-line right"
      />
    </svg>

    <!-- 波浪风格 -->
    <svg v-else-if="variant === 'wave'" viewBox="0 0 400 30" class="divider-svg">
      <path
        d="M0,15 Q50,5 100,15 T200,15 T300,15 T400,15"
        fill="none"
        stroke="var(--accent-primary)"
        stroke-width="1"
        class="wave-path"
      />
    </svg>

    <!-- 点阵风格 -->
    <svg v-else-if="variant === 'dots'" viewBox="0 0 400 20" class="divider-svg">
      <circle v-for="i in 5" :key="i" :cx="140 + i * 30" cy="10" r="2" fill="var(--accent-primary)" class="dot-item" :style="{ animationDelay: `${i * 0.1}s` }" />
    </svg>

    <!-- 直线风格 -->
    <svg v-else-if="variant === 'line'" viewBox="0 0 400 20" class="divider-svg">
      <line x1="100" y1="10" x2="300" y2="10" stroke="var(--border-primary)" stroke-width="0.5" class="simple-line" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-divider {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  opacity: 0.8;
}

.divider-svg {
  width: 400px;
  height: 20px;
  max-width: 100%;
  display: block;
}

// Zen variant
:deep(.zen-line) {
  stroke-dasharray: 125;
  stroke-dashoffset: 125;
  animation: drawLine 1s ease-out forwards;

  &.left { animation-delay: 0s; }
  &.right { animation-delay: 0.3s; }
}

:deep(.zen-dot) {
  opacity: 0;
  animation: dotFade 0.5s ease-out 0.5s forwards;
}

// Wave variant
:deep(.wave-path) {
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: drawWave 2s ease-out forwards;
}

// Dots variant
:deep(.dot-item) {
  opacity: 0;
  animation: dotPop 0.4s ease-out forwards;
  transform-origin: center;
}

// Line variant
:deep(.simple-line) {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 0.8s ease-out forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes drawWave {
  to { stroke-dashoffset: 0; }
}

@keyframes dotFade {
  to { opacity: 1; }
}

@keyframes dotPop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
