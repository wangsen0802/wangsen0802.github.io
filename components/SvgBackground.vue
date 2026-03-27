<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const svgRef = ref<SVGSVGElement | null>(null)
const mouseX = ref(50)
const mouseY = ref(50)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth) * 100
  mouseY.value = (e.clientY / window.innerHeight) * 100
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="svg-background">
    <svg
      ref="svgRef"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      class="bg-svg"
    >
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--svg-line-1)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--svg-line-2)" stop-opacity="0.1" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--svg-line-2)" stop-opacity="0.2" />
          <stop offset="100%" stop-color="var(--svg-line-1)" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--svg-accent)" stop-opacity="0.15" />
          <stop offset="100%" stop-color="var(--svg-accent)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 背景层 -->
      <rect width="100%" height="100%" fill="var(--svg-bg)" />

      <!-- 浮动圆圈 -->
      <g class="float-element float-delay-0">
        <circle
          class="circle-path circle-1"
          cx="200"
          cy="150"
          r="80"
          fill="none"
          stroke="url(#circleGradient)"
          stroke-width="1"
        />
      </g>
      <g class="float-element float-delay-2">
        <circle
          class="circle-path circle-2"
          cx="1200"
          cy="600"
          r="120"
          fill="none"
          stroke="url(#circleGradient)"
          stroke-width="0.5"
        />
      </g>
      <g class="float-element float-delay-4">
        <circle
          class="circle-path circle-3"
          cx="700"
          cy="750"
          r="60"
          fill="none"
          stroke="url(#circleGradient)"
          stroke-width="1"
        />
      </g>

      <!-- 流动线条 -->
      <path
        class="line-path line-path-1"
        d="M-100,200 Q400,100 720,300 T1440,200"
        fill="none"
        stroke="url(#lineGradient1)"
        stroke-width="1"
        stroke-linecap="round"
      />
      <path
        class="line-path line-path-2"
        d="M-100,400 Q300,300 600,450 T1200,350 T1540,450"
        fill="none"
        stroke="url(#lineGradient2)"
        stroke-width="0.5"
        stroke-linecap="round"
      />
      <path
        class="line-path line-path-3"
        d="M-100,600 Q500,500 800,650 T1440,550"
        fill="none"
        stroke="url(#lineGradient1)"
        stroke-width="0.75"
        stroke-linecap="round"
      />
      <path
        class="line-path line-path-4"
        d="M1440,100 Q1000,200 600,100 T-100,150"
        fill="none"
        stroke="url(#lineGradient2)"
        stroke-width="0.5"
        stroke-linecap="round"
      />
      <path
        class="line-path line-path-5"
        d="M1440,800 Q900,700 400,850 T-100,750"
        fill="none"
        stroke="url(#lineGradient1)"
        stroke-width="0.75"
        stroke-linecap="round"
      />

      <!-- 装饰点 -->
      <circle class="dot dot-1" cx="300" cy="250" r="3" fill="var(--svg-accent)" />
      <circle class="dot dot-2" cx="900" cy="180" r="2" fill="var(--svg-accent)" />
      <circle class="dot dot-3" cx="600" cy="500" r="4" fill="var(--svg-accent)" />
      <circle class="dot dot-4" cx="1100" cy="400" r="2.5" fill="var(--svg-accent)" />
      <circle class="dot dot-5" cx="200" cy="700" r="3" fill="var(--svg-accent)" />

      <!-- 几何装饰 -->
      <g class="float-element float-delay-1">
        <polygon
          points="1300,100 1330,150 1270,150"
          fill="none"
          stroke="var(--svg-accent)"
          stroke-width="0.5"
          opacity="0.3"
        />
      </g>
      <g class="float-element float-delay-3">
        <rect
          x="100"
          y="500"
          width="40"
          height="40"
          fill="none"
          stroke="var(--svg-accent)"
          stroke-width="0.5"
          opacity="0.2"
          transform="rotate(45 120 520)"
        />
      </g>

      <!-- 交叉线 -->
      <line
        class="line-path line-path-1"
        x1="500"
        y1="0"
        x2="700"
        y2="900"
        stroke="var(--svg-line-1)"
        stroke-width="0.3"
        opacity="0.15"
      />
      <line
        class="line-path line-path-2"
        x1="900"
        y1="0"
        x2="1100"
        y2="900"
        stroke="var(--svg-line-2)"
        stroke-width="0.3"
        opacity="0.1"
      />
    </svg>

    <!-- 渐变遮罩 -->
    <div class="gradient-overlay" />
  </div>
</template>

<style scoped lang="scss">
.svg-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.bg-svg {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%),
    transparent 0%,
    var(--bg-primary) 70%
  );
  pointer-events: none;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

/* SVG 动画样式 - 使用 :deep 穿透到 SVG 内部 */
:deep(.line-path) {
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: drawLine 8s ease-out forwards;
}

:deep(.line-path-1) { animation-delay: 0s; }
:deep(.line-path-2) { animation-delay: 0.5s; }
:deep(.line-path-3) { animation-delay: 1s; }
:deep(.line-path-4) { animation-delay: 1.5s; }
:deep(.line-path-5) { animation-delay: 2s; }

:deep(.circle-path) {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawCircle 6s ease-out forwards;
}

:deep(.circle-1) { animation-delay: 0.3s; }
:deep(.circle-2) { animation-delay: 0.8s; }
:deep(.circle-3) { animation-delay: 1.3s; }

:deep(.dot) {
  animation: dotPulse 4s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

:deep(.dot-1) { animation-delay: 0s; }
:deep(.dot-2) { animation-delay: 0.5s; }
:deep(.dot-3) { animation-delay: 1s; }
:deep(.dot-4) { animation-delay: 1.5s; }
:deep(.dot-5) { animation-delay: 2s; }

:deep(.float-element) {
  animation: float 20s ease-in-out infinite;
}

:deep(.float-delay-0) { animation-delay: 0s; }
:deep(.float-delay-1) { animation-delay: 1s; }
:deep(.float-delay-2) { animation-delay: 2s; }
:deep(.float-delay-3) { animation-delay: 3s; }
:deep(.float-delay-4) { animation-delay: 4s; }

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(2deg);
  }
  50% {
    transform: translateY(-10px) rotate(-1deg);
  }
  75% {
    transform: translateY(-30px) rotate(1deg);
  }
}
</style>
