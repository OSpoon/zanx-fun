<script setup>
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
import BookmarkList from '~/components/BookmarkList.vue'

const { t } = useI18n()
const { theme } = useTheme()

// 设置页面元数据
useHead({
  title: computed(() => t('bookmarks.pageTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('bookmarks.pageDescription'))
    }
  ]
})
</script>

<template>
  <div class="bookmarks-page min-h-screen">
    <!-- 页面内容容器 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <div class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 mb-8 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50">
        <h1 class="text-3xl font-bold text-primary mb-2">{{ t('bookmarks.title') }}</h1>
        <p class="dark:text-light-dark text-dark-light">{{ t('bookmarks.description') }}</p>
      </div>

      <!-- 书签列表区域 -->
      <div class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50">
        <BookmarkList />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-page {
  @apply bg-gradient-to-br dark:from-dark dark:to-dark-light from-light-dark to-light dark:text-light text-dark;
}
</style>