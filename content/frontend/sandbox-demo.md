---
title: 代码沙盒演示
description: 展示在线代码编辑器和实时预览功能
category: frontend
tags: ["JavaScript", "HTML", "代码编辑"]
author: wangsen
date: 2026-03-29
---

# 代码沙盒演示

这个页面展示了项目的代码沙盒功能，你可以在编辑器中修改代码，并实时查看运行结果。

## HTML 沙盒示例

:::sandbox{title="按钮点击示例"}
```html
<div style="text-align: center; padding: 20px; font-family: 'DM Sans', sans-serif;">
  <h2 style="color: #1c1917;">计数器</h2>
  <p style="font-size: 2rem; font-weight: 600; color: #4a7c59;" id="display">0</p>
  <div style="display: flex; gap: 8px; justify-content: center;">
    <button onclick="update(-1)" style="padding: 8px 20px; border: 1px solid #e7e5e4; border-radius: 4px; background: #f5f5f4; cursor: pointer; font-size: 1rem;">-</button>
    <button onclick="reset()" style="padding: 8px 20px; border: 1px solid #e7e5e4; border-radius: 4px; background: #f5f5f4; cursor: pointer; font-size: 1rem;">重置</button>
    <button onclick="update(1)" style="padding: 8px 20px; border: 1px solid #4a7c59; border-radius: 4px; background: #4a7c59; color: white; cursor: pointer; font-size: 1rem;">+</button>
  </div>
</div>

<script>
  let count = 0;
  const display = document.getElementById('display');

  function update(delta) {
    count += delta;
    display.textContent = count;
  }

  function reset() {
    count = 0;
    display.textContent = 0;
  }
</script>
```

:::

## JS 沙盒示例

:::sandbox{title="数组操作" lang="js"}

```js
const fruits = ['苹果', '香蕉', '橙子', '葡萄', '西瓜'];
console.log('原始数组:', fruits);

const filtered = fruits.filter(f => f.length <= 2);
console.log('两个字的水果:', filtered);

const upper = fruits.map(f => f.toUpperCase());
console.log('大写:', upper);

console.log('总共', fruits.length, '种水果');
```

:::

## 使用方法

1. 在文章中使用 `:::sandbox` 指令嵌入沙盒
2. 使用 `lang="html"` 或 `lang="js"` 指定语言模式
3. 代码将在 iframe 中安全执行
4. 读者可以实时修改代码并查看结果
