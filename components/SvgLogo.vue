<script setup lang="ts">
defineProps<{
  size?: number
  animated?: boolean
}>()
</script>

<template>
  <svg
    :width="size || 40"
    :height="size || 40"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-svg"
    :class="{ animated }"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-primary)" />
        <stop offset="100%" stop-color="var(--accent-secondary)" />
      </linearGradient>
    </defs>

    <!-- 外圈 -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="var(--text-primary)"
      stroke-width="1"
      class="outer-circle"
    />

    <!-- W 字母路径 -->
    <path
      d="M20 70 L30 30 L50 55 L70 30 L80 70"
      fill="none"
      stroke="url(#logoGradient)"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="letter-path"
    />

    <!-- G 字母路径 -->
    <path
      d="M55 45 L75 45 L75 60 Q75 70 65 70 L55 70 Q45 70 45 60 L45 45 Q45 35 55 35"
      fill="none"
      stroke="url(#logoGradient)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="letter-path-g"
      opacity="0.7"
    />

    <!-- 装饰点 -->
    <circle cx="50" cy="15" r="2" fill="var(--accent-primary)" class="accent-dot dot-1" />
    <circle cx="85" cy="50" r="1.5" fill="var(--accent-secondary)" class="accent-dot dot-2" />
    <circle cx="50" cy="85" r="1.5" fill="var(--accent-primary)" class="accent-dot dot-3" />
  </svg>
</template>

<style scoped lang="scss">
.logo-svg {
  display: block;

  &.animated {
    :deep(.outer-circle) {
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
      animation: drawCircle 1.5s ease-out forwards;
    }

    :deep(.letter-path) {
      stroke-dasharray: 150;
      stroke-dashoffset: 150;
      animation: drawLetter 1.2s ease-out 0.3s forwards;
    }

    :deep(.letter-path-g) {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: drawLetter 1s ease-out 0.6s forwards;
    }

    :deep(.accent-dot) {
      opacity: 0;
      animation: dotAppear 0.4s ease-out forwards;

      &.dot-1 { animation-delay: 0.8s; }
      &.dot-2 { animation-delay: 1s; }
      &.dot-3 { animation-delay: 1.2s; }
    }
  }

  &:hover {
    :deep(.outer-circle) {
      stroke: var(--accent-primary);
      transition: stroke 0.3s ease;
    }
  }
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawLetter {
  to { stroke-dashoffset: 0; }
}

@keyframes dotAppear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
