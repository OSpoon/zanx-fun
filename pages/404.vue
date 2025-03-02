<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-dark dark:to-dark-light from-light-dark to-light dark:text-light text-dark">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
      <p class="text-2xl mb-8 dark:text-light text-dark">页面不存在</p>
      <NuxtLink to="/" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'error'
})
</script> 