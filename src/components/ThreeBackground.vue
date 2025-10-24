<template>
  <div ref="container" class="three-background"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useAppStore } from '@/stores'

const container = ref<HTMLElement>()
const appStore = useAppStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number
let mousePosition = { x: 0, y: 0 }

// 根据设备性能调整粒子数量
const getParticleCount = () => {
  const width = window.innerWidth
  if (width < 768) return 800  // 移动端
  if (width < 1024) return 1200 // 平板
  return 2000 // 桌面端
}

// 根据主题获取粒子颜色
const getParticleColors = () => {
  const isDark = appStore.theme === 'dark'
  return {
    color: isDark ? 0x4a9eff : 0x0066cc,
    emissive: isDark ? 0x2a7fff : 0x004499
  }
}

const initScene = () => {
  if (!container.value) return

  // 创建场景
  scene = new THREE.Scene()

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 50

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // 创建粒子系统
  createParticles()

  // 添加事件监听
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
}

const createParticles = () => {
  const particleCount = getParticleCount()
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)

  const particleColors = getParticleColors()
  const color = new THREE.Color(particleColors.color)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // 位置 - 创建球形分布
    const radius = Math.random() * 100 + 20
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    // 颜色 - 添加一些变化
    const colorVariation = 0.3
    colors[i3] = color.r + (Math.random() - 0.5) * colorVariation
    colors[i3 + 1] = color.g + (Math.random() - 0.5) * colorVariation
    colors[i3 + 2] = color.b + (Math.random() - 0.5) * colorVariation

    // 大小
    scales[i] = Math.random() * 2 + 0.5

    // 速度
    speeds[i] = Math.random() * 0.02 + 0.005
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))

  // 创建着色器材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mousePosition: { value: new THREE.Vector2(0, 0) },
      pixelRatio: { value: renderer.getPixelRatio() }
    },
    vertexShader: `
      attribute float scale;
      attribute float speed;
      uniform float time;
      uniform vec2 mousePosition;
      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 基础动画
        float animationTime = time * speed;
        pos.x += sin(animationTime + position.y * 0.01) * 2.0;
        pos.y += cos(animationTime + position.x * 0.01) * 2.0;

        // 鼠标交互效果
        vec2 mouseEffect = mousePosition - pos.xy;
        float distance = length(mouseEffect);
        float influence = max(0.0, 1.0 - distance / 30.0);

        pos.x += mouseEffect.x * influence * 5.0;
        pos.y += mouseEffect.y * influence * 5.0;
        pos.z += influence * 10.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // 根据距离调整大小
        float pointSize = scale * (300.0 / -mvPosition.z) * pixelRatio;
        gl_PointSize = pointSize * (1.0 + influence);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float distance = length(uv);

        if (distance > 0.5) discard;

        // 创建渐变效果
        float opacity = 1.0 - (distance * 2.0);
        opacity = pow(opacity, 2.0);

        gl_FragColor = vec4(vColor, opacity * 0.8);
      }
    `,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const onMouseMove = (event: MouseEvent) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
}

const onWindowResize = () => {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  if (particles && renderer && scene && camera) {
    // 更新着色器制服
    const material = particles.material as THREE.ShaderMaterial
    if (material.uniforms?.time) {
      material.uniforms.time.value += 0.01
    }
    if (material.uniforms?.mousePosition) {
      material.uniforms.mousePosition.value.set(mousePosition.x, mousePosition.y)
    }

    // 旋转粒子系统
    particles.rotation.y += 0.001
    particles.rotation.x += 0.0005

    renderer.render(scene, camera)
  }
}

const updateTheme = () => {
  if (particles) {
    const particleColors = getParticleColors()
    const color = new THREE.Color(particleColors.color)

    // 更新粒子颜色
    const colorAttribute = particles.geometry.attributes.color
    if (colorAttribute) {
      const colors = colorAttribute.array as Float32Array
      const colorVariation = 0.3

      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = color.r + (Math.random() - 0.5) * colorVariation
        colors[i + 1] = color.g + (Math.random() - 0.5) * colorVariation
        colors[i + 2] = color.b + (Math.random() - 0.5) * colorVariation
      }

      colorAttribute.needsUpdate = true
    }
  }
}

// 监听主题变化
watch(() => appStore.theme, updateTheme)

onMounted(() => {
  initScene()
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('mousemove', onMouseMove)

  if (renderer && container.value) {
    container.value.removeChild(renderer.domElement)
    renderer.dispose()
  }

  if (particles) {
    particles.geometry.dispose()
    ;(particles.material as THREE.Material).dispose()
  }
})
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.three-background canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>