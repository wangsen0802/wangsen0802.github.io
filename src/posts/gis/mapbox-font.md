---
title: 'mapbox中的font使用'
description: '自定义地图字体，个性化显示'
date: '2024-10-24'
author: '王森'
tags: ['GIS', 'Mapbox', '地图']
---

字体文件(ttf/otf)一般比较大，一般在10M左右，在网页中加载比较耗时。

mapbox加载的字体是经过处理的，加工成pbf格式。pbf格式文件是基于Google的Protocol
Buffer协议进行组织的，是一种二进制文件。Mapbox的矢量瓦片、字体都是采用这种数据结构进行存储、压缩的。

因此在mapbox 中想要使用自定义的字体样式，需要进行格式转换，将ttf/otf字体转换为pbf格式。

### tff转换为pbf格式的方法

https://github.com/mapbox/node-fontnik

https://github.com/mapbox/fontnik

与 node-fontnik 相比，fontnik 是纯 JavaScript，它不会在初始阶段将字体栅格化，而是在数据仍为矢量形式时实现了大部分算法。

这里我们使用 fontnik

```jsx
const fontnik = require('fontnik')
const fs = require('fs').promises
const path = require('path')

// 将 fontnik.range 转换为 Promise 形式
function generatePBF(font, start, end) {
  return new Promise((resolve, reject) => {
    fontnik.range({ font, start, end }, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

// 确保目录存在
async function ensureDir(dir) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

// 转换单个范围的字符
async function convertRange(font, start, end, outputDir) {
  try {
    const pbfData = await generatePBF(font, start, end)
    const outputFile = path.join(outputDir, `${start}-${end}.pbf`)
    await fs.writeFile(outputFile, pbfData)
    console.log(`成功生成 ${start}-${end}.pbf`)
  } catch (err) {
    console.error(`生成 ${start}-${end}.pbf 失败:`, err)
    throw err
  }
}

// 主转换函数
async function convert(fontPath, outputDir) {
  try {
    // 确保路径是绝对路径
    const absoluteFontPath = path.resolve(__dirname, fontPath)
    const absoluteOutputDir = path.resolve(__dirname, outputDir)

    // 确保输出目录存在
    await ensureDir(absoluteOutputDir)

    // 读取字体文件
    const font = await fs.readFile(absoluteFontPath)

    // 生成所有范围的转换任务
    const tasks = []
    for (let start = 0; start <= 65535; start += 256) {
      const end = Math.min(start + 255, 65535)
      tasks.push(convertRange(font, start, end, absoluteOutputDir))
    }

    // 并行执行所有任务
    await Promise.all(tasks)
    console.log('所有 PBF 文件生成完成！')
  } catch (err) {
    console.error('转换过程中发生错误:', err)
    throw err
  }
}

// 使用示例
convert('./fonts/textfont.ttf', './fonts/pbfs/textfont/').catch(err =>
  console.error('转换失败:', err)
)
```

使用node 16 及之前的版本运行

```
node convert.js
```

因为 fontnik 包含了原生 C++ 模块，这些模块需要针对特定的 Node.js 版本进行编译

### 样式文件设置

在样式文件中的 glyphs 中设置成相应的字体服务，本地的字体地址如下

```jsx
glyphs: '…/fonts/{fontstack}/{range}.pbf'
```

Mapbox对 CJK（Chinese，Japanese，Korean）中日韩 和部分东亚的字体做了限制。他们认为这些地方的字体文件太大，加载耗时，默认使用’本地‘字体。就是电脑本身或者手机本身的字体，就不需要再去请求了。为了避免这种情况，我们需要在初始化Map对象时，设置 localIdeographFontFamily 属性为空字符串 “”。不使用本地字体，就用自定义字体。

![Mapbox字体设置示例](/src/assets/images/posts/gis/mapbox-font-example.png)

###
