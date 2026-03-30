---
title: 'Mapbox 图片使用实践'
description: 'Mapbox 中加载图片、动态图片（apng、gif）的方法与实践'
category: 'gis'
date: '2026-3-29'
author: '王森'
tags: ['GIS', 'Mapbox', '图片', 'Canvas']
path: '/gis/mapbox-image-practice'
---

在GIS项目开发，尤其是可视化大屏项目开发中，个性化的图标/图片的使用对于可视化效果的提升非常明显。动效和交互可以让用户的体验更加良好。但是同时需要注意图片的大小，避免图片过大影响页面的加载。本文将介绍mapbox中的图片的一些使用实践.

## 一：如何在mapbox 中加载图片 、动态图片（apng，gif）

在mapbox中图片的使用通常是固定的图片格式png、webp、jpg三种，因为loadImage方法只支持这三种图片文件的URL。

### loadImage()

loadImage 方法 从外部URL加载图像以用于 addImage方法。

| Name          | **Description**                                                                    |
| ------------- | ---------------------------------------------------------------------------------- |
| url（string） | 图像文件的 URL。图像文件必须是 png、webp 或 jpg 格式。                             |
| callback      | `callback(error, data)` 。当图像加载完成时调用，或者在出现错误时使用错误参数调用。 |

```jsx
// Load an image from an external URL.
map.loadImage('<http://placekitten.com/50/50>', (error, image) => {
  if (error) throw error
  // Add the loaded image to the style's sprite with the ID 'kitten'.
  map.addImage('kitten', image)
})
```

回调函数返回的data 为 **ImageBitmap**，ImageBitmap表示一个位图图像，可以无延迟的绘制到canvas元素上。提供了一种异步且资源高效的途径，用于准备纹理以在 WebGL中渲染。

[ImageBitmap - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap)

### addImage()

addImage方法 是mapbox中加载图片的核心方法。用来向style中添加图像。使用图像的iD 与style中的雪碧图一样 可以在 icon-Image，background-pattern，fill-pattern，line-pattern等图层样式中使用。

[Map | Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addimage)

可以加载 `HTMLImageElement` 、 `ImageData` 、 `ImageBitmap` 作为图像，或具有 `width` 、 `height` 和 `data` 属性的对象，格式与 `ImageData` 相同。

上面提到的loadImage 返回的就是 ImageBitmap 格式。通常的使用方法也是先试用loadImage加载 图像，在试用addImage添加图像。

```jsx
// If the style's sprite does not already contain an image with ID 'cat',
// add the image 'cat-icon.png' to the style's sprite with the ID 'cat'.
map.loadImage(
  '<https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png>',
  (error, image) => {
    if (error) throw error
    if (!map.hasImage('cat')) map.addImage('cat', image)
  }
)
```

### styleImageInterface

[Properties and options | Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/properties/#styleimageinterface)

动态生成样式图像的接口，是一个开发者用于参考的规范，不是一个导出的方法或类。可以在每一帧找那个重新绘制图像。**用于动画化图标和图案**。

实现StyleImageInterface规范。就是具有 `width` 、 `height` 和 `data` 属性的对象，格式与 `ImageData` 相同。 可使用addImage进行添加在地图中使用。

[ImageData - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)

ImageData 是表示 canvas 元素区域底层的像素数据。 它使用 `ImageData()` 构造函数或 `CanvasRenderingContext2D` 对象上的创建方法来创建，该对象与 canvas 关联： `createImageData()` 和 `getImageData()` 。它也可以使用 `putImageData()` 来设置 canvas 的一部分。

具体的使用其实就是 使用 canvas 渲染我们需要的图像。然后使用 getImageData()方法 来获取ImageData 使用。

上面总共提到三个mapbox 方法

静态图片，png，jpeg，webp格式图层 使用 loadImage 和 addImage 两个接口即可。

动态图片，使用loadImage 和 StyleImageInterface。我们需要手写绘制逻辑或者引入第三方库来实现canvas 动画。但是效果也是比较好的，图标可以维持深度关系，能和其他图层维持层级关系，适用于各类矢量数据源。具体在实际中使用，只要canvas能够实现的渲染，都可以作为mapbox的图像。下面给出几个示例。

canvas图标-apng 动态图标

一个apng是有多个帧循环播放实现的动态效果,

![apng动态图标](/images/gis/图片实践-apng动态图标.png)

通过第三方库apng-js 获取apng图片的每一帧图像,frames是帧图像的数组,在canvas中循环渲染,

![apng帧解析](/images/gis/图片实践-apng帧解析.png)

```jsx
import { default as parseAPNG, APNG, isNotPNG, isNotAPNG } from 'apng-js'
import { map } from '../init-map'

// 设置图标尺寸
const widthSize = 32
const heightSize = 64

export const getApngIcon: any = (url: any) => {
  return {
    // 基础属性配置
    width: widthSize,
    height: heightSize,
    data: new Uint8Array(widthSize * heightSize * 4),
    context: null as CanvasRenderingContext2D | null,
    apng: null as APNG | null,
    currentFrame: 0,
    lastFrameTime: 0,
    frameDelay: 100,

    // 初始化函数
    onAdd: async function () {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      this.context = canvas.getContext('2d', { willReadFrequently: true })

      try {
        //获取APNG图片数据转为二进制格式数据
        const buffer = await fetch(url).then((res) => res.arrayBuffer())
        //解析二进制数据生成动画帧
        const result = parseAPNG(buffer)
        if (result instanceof Error) throw result

        this.apng = result
        this.frameDelay = this.apng.frames[0]?.delay || 100
        await this.drawFrame(0)
      } catch (error) {
        console.error('APNG loading failed:', error)
        this.renderFallback()
      }
    },

    // 绘制指定帧
    drawFrame: async function (frameIndex: number) {
      const frame = this.apng?.frames[frameIndex]
      if (!frame?.imageData || !this.context) return false

      // 创建并绘制图像
      const img = new Image()
      const blob = new Blob([frame.imageData], { type: 'image/png' })
      img.src = URL.createObjectURL(blob)

      try {
        await img.decode()
        this.context.clearRect(frame.left, frame.top, this.width, this.height)
        this.context.drawImage(img, frame.left, frame.top)
        this.data = this.context.getImageData(0, 0, this.width, this.height).data
      } finally {
        URL.revokeObjectURL(img.src)
      }
      return true
    },

    // 渲染动画
    render: function () {
      if (this.apng?.frames?.length) {
        const now = performance.now()
        // 按帧延迟时间更新动画
        if (now - this.lastFrameTime >= this.frameDelay) {
          this.drawFrame(this.currentFrame)
          this.currentFrame = (this.currentFrame + 1) % this.apng.frames.length
          this.lastFrameTime = now
        }
      } else {
        this.renderFallback()
      }
      map?.triggerRepaint()
      return true
    },

    // 降级渲染（当APNG加载失败时显示）
    renderFallback: function () {
      if (!this.context) return
      const radius = this.width / 4
      this.context.clearRect(0, 0, this.width, this.height)

      // 绘制动态外圈
      const t = (performance.now() % 1000) / 1000
      const outerRadius = radius * (1.5 + 0.5 * Math.sin(t * Math.PI * 2))
      this.context.beginPath()
      this.context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
      this.context.fillStyle = `rgba(255, 0, 0, ${0.6 - 0.3 * Math.sin(t * Math.PI * 2)})`
      this.context.fill()

      // 绘制内圈
      this.context.beginPath()
      this.context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
      this.context.fillStyle = 'rgba(255, 0, 0, 0.8)'
      this.context.fill()
      this.context.strokeStyle = 'white'
      this.context.lineWidth = 2
      this.context.stroke()

      this.data = this.context.getImageData(0, 0, this.width, this.height).data
    }
  }
}

```

```jsx
map.addImage(icon.name, getApngIcon(icon.url))
```

效果如下，使用和静态的symbol图层一致，非常nice

![apng效果展示](/images/gis/图片实践-apng效果展示.png)

### 多图片结合位一个icon 用于展示

```jsx
import { map } from './init-map'
// 设置图标尺寸
const widthSize = 64
const heightSize = 64

// 图片叠加配置接口
interface OverlayConfig {
  baseImage: string // 底图URL
  overlayImage: string // 叠加图URL
  overlayOffset?: { x: number; y: number } // 叠加图偏移量
  overlayOpacity?: number // 叠加图透明度
  overlayBlendMode?: GlobalCompositeOperation // 混合模式
  overlayScale?: number // 叠加图缩放比例
}

/**
 * 创建两个PNG图片叠加显示的图标
 * @param config 叠加配置
 * @returns Mapbox GL JS 图标对象
 */
export const getOverlayIcon = (config: OverlayConfig) => {
  return {
    // 基础属性配置
    width: widthSize,
    height: heightSize,
    data: new Uint8ClampedArray(widthSize * heightSize * 4),
    context: null as CanvasRenderingContext2D | null,
    baseImage: null as HTMLImageElement | null,
    overlayImage: null as HTMLImageElement | null,
    isLoaded: false,

    // 初始化函数
    onAdd: async function () {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      this.context = canvas.getContext('2d', { willReadFrequently: true })

      try {
        // 加载底图
        await this.loadBaseImage(config.baseImage)
        // 加载叠加图
        await this.loadOverlayImage(config.overlayImage)
        // 绘制叠加后的图片
        this.drawOverlayImage(config)
        this.isLoaded = true
      } catch (error) {
        console.error('图片叠加加载失败:', error)
        this.renderFallback()
      }
    },

    // 加载底图
    loadBaseImage: async function (url: string) {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          this.baseImage = img
          resolve()
        }
        img.onerror = () => reject(new Error(`底图加载失败: ${url}`))
        img.src = url
      })
    },

    // 加载叠加图
    loadOverlayImage: async function (url: string) {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          this.overlayImage = img
          resolve()
        }
        img.onerror = () => reject(new Error(`叠加图加载失败: ${url}`))
        img.src = url
      })
    },

    // 绘制叠加图片
    drawOverlayImage: function (config: OverlayConfig) {
      if (!this.context || !this.baseImage || !this.overlayImage) return

      // 清空画布
      this.context.clearRect(0, 0, this.width, this.height)

      // 绘制底图
      this.context.drawImage(this.baseImage, 0, 0, this.width, this.height)

      // 设置叠加图属性
      const offsetX = config.overlayOffset?.x || 0
      const offsetY = config.overlayOffset?.y || 0
      const opacity = config.overlayOpacity || 1
      const blendMode = config.overlayBlendMode || 'source-over'
      const scale = config.overlayScale || 1

      // 计算叠加图的实际尺寸
      const overlayWidth = this.overlayImage.width * scale
      const overlayHeight = this.overlayImage.height * scale

      // 计算叠加图在画布中的位置（居中显示）
      const overlayX = (this.width - overlayWidth) / 2 + offsetX
      const overlayY = (this.height - overlayHeight) / 2 + offsetY

      // 保存当前状态
      this.context.save()

      // 设置混合模式和透明度
      this.context.globalCompositeOperation = blendMode
      this.context.globalAlpha = opacity

      // 绘制叠加图
      this.context.drawImage(this.overlayImage, overlayX, overlayY, overlayWidth, overlayHeight)

      // 恢复状态
      this.context.restore()

      // 更新像素数据
      this.data = this.context.getImageData(0, 0, this.width, this.height).data
    },

    // 渲染函数
    render: function () {
      if (this.isLoaded) {
        // 如果图片已加载，直接返回当前状态
        map?.triggerRepaint()
        return true
      } else {
        // 如果图片未加载，显示降级效果
        this.renderFallback()
        return true
      }
    },

    // 降级渲染（当图片加载失败时显示）
    renderFallback: function () {
      if (!this.context) return

      const radius = this.width / 4
      this.context.clearRect(0, 0, this.width, this.height)

      // 绘制底图占位符（蓝色圆圈）
      this.context.beginPath()
      this.context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
      this.context.fillStyle = 'rgba(0, 100, 255, 0.8)'
      this.context.fill()
      this.context.strokeStyle = 'white'
      this.context.lineWidth = 2
      this.context.stroke()

      // 绘制叠加图占位符（红色小圆圈）
      const smallRadius = radius * 0.6
      this.context.beginPath()
      this.context.arc(this.width / 2, this.height / 2, smallRadius, 0, Math.PI * 2)
      this.context.fillStyle = 'rgba(255, 0, 0, 0.8)'
      this.context.fill()

      this.data = this.context.getImageData(0, 0, this.width, this.height).data
    }
  }
}

// 示例1：基础的两图片叠加
export const createBasicOverlayIcon = () => {
  const config = {
    baseImage: '/src/assets/images/map/map-tools/tool-background.png', // 底图路径
    overlayImage: '/src/assets/images/map/map-tools/reset.png', // 叠加图路径
    overlayOffset: { x: 0, y: 0 }, // 叠加图偏移量
    overlayOpacity: 1, // 叠加图透明度
    overlayBlendMode: 'source-over' as GlobalCompositeOperation, // 混合模式
    overlayScale: 1 // 叠加图缩放比例
  }

  return getOverlayIcon(config)
}

/**
 * 在地图上添加叠加图标的完整示例
 */
export const addOverlayIconToMap = (map: any) => {
  // 创建叠加图标
  const overlayIcon = createBasicOverlayIcon()

  // 添加图标到地图
  map.addImage('overlay-icon', overlayIcon)

  // 添加图层使用该图标
  map.addSource('overlay-points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [87.6177, 43.7928] // 乌鲁木齐坐标
          },
          properties: {
            name: '叠加图标示例'
          }
        }
      ]
    }
  })

  map.addLayer({
    id: 'overlay-points-layer',
    type: 'symbol',
    source: 'overlay-points',
    layout: {
      'icon-image': 'overlay-icon',
      'icon-size': 1.0,
      'icon-allow-overlap': true
    }
  })
}
```

![多图叠加示例1](/images/gis/图片实践-多图叠加示例1.png)

![多图叠加示例2](/images/gis/图片实践-多图叠加示例2.png)

其他示例，gif图片，lottie动画

[稀土掘金](https://juejin.cn/post/7313242107681947674#heading-5)

### SDF 的应用

[Using recolorable images in Mapbox maps | Help](https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/#what-are-signed-distance-fields-sdf)
