<template>
  <div ref="containerRef" class="three-background"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'

const containerRef = ref<HTMLElement | null>(null)
const colorMode = useColorMode()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number
let mousePosition = { x: 0, y: 0 }

// 根据设备性能调整粒子数量
const getParticleCount = () => {
  if (import.meta.client) {
    const width = window.innerWidth
    if (width < 768) return 600  // 移动端
    if (width < 1024) return 900 // 平板
    return 1500 // 桌面端
  }
  return 1500
}

// 根据主题获取粒子颜色
const getParticleColors = () => {
  const isDark = colorMode.value === 'dark'
  return {
    color: isDark ? 0x00d4dd : 0x0099dd,
    emissive: isDark ? 0x00a8aa : 0x0066aa
  }
}

const initScene = () => {
  if (!containerRef.value) return

  try {
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
    containerRef.value.appendChild(renderer.domElement)

    // 创建粒子系统
    createParticles()

    // 添加事件监听
    window.addEventListener('resize', onWindowResize)
    window.addEventListener('mousemove', onMouseMove)
  } catch (error) {
    console.error('ThreeBackground: Error initializing scene:', error)
  }
}

const createParticles = () => {
  const particleCount = getParticleCount()
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const particleColors = getParticleColors()
  const color = new THREE.Color(particleColors.color)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // 位置 - 创建球形分布
    const radius = Math.random() * 50 + 10
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    // 颜色
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // 增强的材质
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
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
    // 基础旋转
    particles.rotation.y += 0.002
    particles.rotation.x += 0.001

    // 鼠标跟随效果
    const targetRotationX = mousePosition.y * 0.8
    const targetRotationY = mousePosition.x * 0.8

    particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.08
    particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.08

    // 视差效果
    const targetX = mousePosition.x * 8
    const targetY = mousePosition.y * 8
    particles.position.x += (targetX - particles.position.x) * 0.03
    particles.position.y += (targetY - particles.position.y) * 0.03

    // 呼吸效果
    const breatheScale = 1 + Math.sin(Date.now() * 0.001) * 0.02
    particles.scale.setScalar(breatheScale)

    renderer.render(scene, camera)
  }
}

const updateTheme = () => {
  if (particles) {
    const particleColors = getParticleColors()
    const color = new THREE.Color(particleColors.color)

    const colorAttribute = particles.geometry.attributes.color
    if (colorAttribute) {
      const colors = colorAttribute.array as Float32Array

      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b
      }

      colorAttribute.needsUpdate = true
    }
  }
}

// 监听主题变化
watch(() => colorMode.value, updateTheme)

onMounted(() => {
  // 延迟初始化以确保 DOM 已准备好
  setTimeout(() => {
    initScene()
    animate()
  }, 100)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (import.meta.client) {
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('mousemove', onMouseMove)

    if (renderer && containerRef.value) {
      containerRef.value.removeChild(renderer.domElement)
      renderer.dispose()
    }

    if (particles) {
      particles.geometry.dispose()
      ;(particles.material as THREE.Material).dispose()
    }
  }
})
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  opacity: 0.9;
}

.three-background canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
