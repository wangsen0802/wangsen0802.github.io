---
title: 'Vue 3 Composition API 详解'
description: '深入了解Vue 3 Composition API的使用方法和最佳实践'
date: '2024-10-24'
author: '王森'
tags: ['Vue3', 'Composition API', '前端框架']
---

# Vue 3 Composition API 详解

Vue 3 引入的 Composition
API 是一个重大的变化，它提供了更灵活的代码组织方式和更好的 TypeScript 支持。

## 什么是 Composition API？

Composition API 是 Vue
3 中的一套新的 API，它允许我们使用函数的方式来组织组件逻辑。

## 基本语法

### setup() 函数

```vue
<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })

    // 计算属性
    const doubledCount = computed(() => count.value * 2)

    // 方法
    const increment = () => {
      count.value++
    }

    // 监听器
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    return {
      count,
      state,
      doubledCount,
      increment
    }
  }
}
</script>
```

### `<script setup>` 语法糖

Vue 3.2+ 提供了更简洁的语法：

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue'

// 响应式数据
const count = ref(0)
const state = reactive({
  name: 'Vue 3',
  version: '3.0'
})

// 计算属性
const doubledCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 监听器
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
</script>
```

## 核心概念

### ref() vs reactive()

- **ref()**: 用于创建响应式的基本类型值
- **reactive()**: 用于创建响应式对象

### 计算属性

使用 `computed()` 函数创建计算属性，支持 getter 和 setter：

```javascript
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: newValue => {
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

### 生命周期钩子

Composition API 中的生命周期钩子需要导入使用：

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onUpdated(() => {
      console.log('组件已更新')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
```

## 优势

1. **更好的 TypeScript 支持**
2. **更灵活的代码组织**
3. **更好的逻辑复用**
4. **更小的包体积**

## 总结

Composition API 为 Vue
3 带来了更强大和灵活的开发体验，是现代 Vue 开发的推荐方式。
