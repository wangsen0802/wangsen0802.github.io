<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: number
  animated?: boolean
}>(), {
  size: 40,
  animated: false,
})

const detailed = computed(() => props.size >= 60)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-svg"
    :class="{ animated }"
  >
    <defs>
      <!-- Globe gradient -->
      <radialGradient id="logoGlobeGrad" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#7DD3FC" />
        <stop offset="55%" stop-color="#3B82F6" />
        <stop offset="100%" stop-color="#1E3A8A" />
      </radialGradient>
      <!-- Globe highlight -->
      <radialGradient id="logoGlobeShine" cx="32%" cy="28%" r="35%">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
      <!-- Globe clip -->
      <clipPath id="logoGlobeClip">
        <circle cx="100" cy="100" r="44" />
      </clipPath>
      <!-- Text orbit path (only needed in detailed mode) -->
      <path
        v-if="detailed"
        id="logoTextOrbit"
        d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
        fill="none"
      />
    </defs>

    <!-- Orbit ring (behind globe, detailed mode only) -->
    <circle
      v-if="detailed"
      cx="100" cy="100" r="78"
      fill="none"
      class="orbit-ring"
      stroke-width="1"
      stroke-dasharray="4 8"
    />

    <!-- Globe group -->
    <g class="globe-group">
      <!-- Globe body with grid (clipped) -->
      <g clip-path="url(#logoGlobeClip)">
        <circle cx="100" cy="100" r="44" fill="url(#logoGlobeGrad)" class="globe-base" />
        <!-- Meridians -->
        <ellipse cx="100" cy="100" rx="17" ry="44" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".9" class="grid-line meridian" />
        <ellipse cx="100" cy="100" rx="33" ry="44" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width=".7" class="grid-line meridian" />
        <line x1="100" y1="56" x2="100" y2="144" stroke="#fff" stroke-opacity=".2" stroke-width=".8" class="grid-line" />
        <!-- Parallels -->
        <line x1="56" y1="78" x2="144" y2="78" stroke="#fff" stroke-opacity=".15" stroke-width=".7" class="grid-line parallel" />
        <line x1="56" y1="100" x2="144" y2="100" stroke="#fff" stroke-opacity=".25" stroke-width=".9" class="grid-line parallel" />
        <line x1="56" y1="122" x2="144" y2="122" stroke="#fff" stroke-opacity=".15" stroke-width=".7" class="grid-line parallel" />
      </g>
      <!-- Shine overlay -->
      <circle cx="100" cy="100" r="44" fill="url(#logoGlobeShine)" />
      <!-- Outline -->
      <circle cx="100" cy="100" r="44" fill="none" class="globe-outline" stroke-width="1.5" />
    </g>

    <!-- Location pin -->
    <g class="pin-group" transform="translate(118,72)">
      <path
        d="M0-10C5.5-10 10-5.5 10 0 10 6.3 0 14 0 14S-10 6.3-10 0C-10-5.5-5.5-10 0-10z"
        fill="#F97316"
        stroke="#fff"
        stroke-width="1.5"
      />
      <circle r="3.5" fill="#fff" />
    </g>

    <!-- Text orbit (detailed mode only) -->
    <template v-if="detailed">
      <text
        class="orbit-text"
        font-size="20"
        font-weight="700"
        letter-spacing="3"
        font-family="'DM Sans',system-ui,sans-serif"
      >
        <textPath href="#logoTextOrbit" startOffset="12%">
          wan<tspan class="text-accent" font-weight="800">GIS</tspan>en
        </textPath>
      </text>
    </template>
  </svg>
</template>

<style scoped lang="scss">
.logo-svg {
  display: block;
}

/* Theme-aware element styles */
.globe-outline {
  stroke: #60A5FA;
}

.orbit-ring {
  stroke: var(--border-primary);
  opacity: 0.4;
}

.orbit-text {
  fill: var(--text-primary);
}

.text-accent {
  fill: var(--accent-primary);
}

/* Hover effect */
.logo-svg:hover {
  :deep(.globe-outline) {
    stroke: var(--accent-primary);
    transition: stroke 0.3s ease;
  }
}

/* ============================================
   Animation
   ============================================ */
.logo-svg.animated {
  /* Globe fade in */
  :deep(.globe-base) {
    opacity: 0;
    animation: fadeIn 0.8s ease-out 0.2s forwards;
  }

  /* Grid lines draw */
  :deep(.grid-line) {
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;

    &.meridian { animation-delay: 0.5s; }
    &.parallel { animation-delay: 0.7s; }
  }

  /* Globe outline draw */
  :deep(.globe-outline) {
    stroke-dasharray: 276;
    stroke-dashoffset: 276;
    animation: drawCircle 1.2s ease-out 0.3s forwards;
  }

  /* Pin pop in */
  :deep(.pin-group) {
    opacity: 0;
    transform-origin: 118px 72px;
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;
  }

  /* Orbit ring draw */
  :deep(.orbit-ring) {
    stroke-dasharray: 490;
    stroke-dashoffset: 490;
    animation: drawCircle 1.5s ease-out 1s forwards;
  }

  /* Orbit text fade in */
  :deep(.orbit-text) {
    opacity: 0;
    animation: fadeIn 0.8s ease-out 1.5s forwards;
  }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes popIn {
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
