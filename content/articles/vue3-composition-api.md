---
title:
  zh: Vue3 组合式 API 最佳实践
  en: Vue3 Composition API Best Practices
description:
  zh: Vue3 组合式 API 提供了一种全新的组织组件逻辑的方式，本文将探讨其最佳实践，帮助你编写更加可维护的代码。
  en: Vue3's Composition API provides a new way to organize component logic. This article explores best practices to help you write more maintainable code.
date: 2023-12-10
originalUrl: https://juejin.cn/user/3702810894152983/posts
---

# Vue3 组合式 API 最佳实践

## 引言

Vue3 的组合式 API 为我们提供了一种全新的组织组件逻辑的方式，相比 Options API，它具有更好的代码组织性、可复用性和类型推导。本文将深入探讨 Vue3 Composition API 的最佳实践，帮助你编写更加可维护的代码。

## 为什么选择组合式 API？

组合式 API 解决了以下几个问题：

1. **逻辑关注点分离**：不再需要按选项类型组织代码，而是可以将相同逻辑关注点的代码放在一起
2. **代码复用**：通过可复用的组合式函数轻松提取和重用逻辑
3. **更好的类型推导**：对 TypeScript 提供了更好的支持
4. **更小的生产包体积**：通过摇树优化可以移除未使用的代码

## 基本结构

一个使用组合式 API 的组件通常遵循以下结构：

```vue
<script setup>
// 1. 导入
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from './stores/user'

// 2. 状态定义
const count = ref(0)
const userStore = useUserStore()

// 3. 计算属性
const doubleCount = computed(() => count.value * 2)

// 4. 方法
function increment() {
  count.value++
}

// 5. 生命周期钩子
onMounted(() => {
  console.log('Component mounted')
})

// 6. 侦听器
watch(count, (newValue) => {
  console.log(`Count changed to ${newValue}`)
})
</script>
```

## 最佳实践

### 1. 使用 `<script setup>`

`<script setup>` 是组合式 API 的编译时语法糖，相比普通的 `setup()` 函数，它具有更简洁的语法和更好的性能：

- 更少的样板代码
- 能够使用 await 顶层
- 自动暴露变量和函数到模板中

### 2. 逻辑模块化

将相关逻辑封装到可复用的组合式函数中：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement
  }
}
```

然后在组件中使用：

```vue
<script setup>
import { useCounter } from './composables/useCounter'

const { count, doubleCount, increment, decrement } = useCounter()
</script>
```

### 3. 保持 ref 的一致性

当使用响应式数据时，保持一致的风格有助于避免混淆：

- 使用 `ref()` 而不是混用 `ref()` 和 `reactive()`
- 使用解构时，确保使用 `toRefs()` 保持响应性
- 在访问 ref 值时始终使用 `.value`

### 4. 生命周期钩子的正确使用

- 使用 `onMounted` 进行初始化逻辑
- 使用 `onUnmounted` 清理资源
- 考虑使用 `onActivated` 和 `onDeactivated` 用于缓存组件

### 5. 有效管理依赖

- 使用 `watchEffect` 自动追踪依赖
- 在 `watch` 中明确指定依赖
- 利用 `computed` 缓存计算结果

## 结论

组合式 API 为 Vue 开发提供了更灵活、更强大的工具，让我们能够更好地组织和复用代码。通过遵循这些最佳实践，你可以充分发挥组合式 API 的优势，编写出更加可维护、可扩展的代码。

记住，好的代码不仅仅是能工作，更重要的是能够被理解和维护。组合式 API 给了我们更好的工具来实现这一目标。 