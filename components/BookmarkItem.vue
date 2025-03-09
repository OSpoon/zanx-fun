<script setup>
import { useTheme } from '~/composables/useTheme'

const { theme } = useTheme()

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
    validator: (value) => {
      return [
        'id', 
        'title', 
        'url', 
        'description', 
        'category', 
        'createdAt'
      ].every(key => key in value)
    }
  }
})

// 格式化日期
const formattedDate = computed(() => {
  if (!props.bookmark.createdAt) return ''
  
  const date = new Date(props.bookmark.createdAt)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
})

// 获取hostname用于显示
const hostname = computed(() => {
  try {
    const url = new URL(props.bookmark.url)
    return url.hostname
  } catch (e) {
    return props.bookmark.url
  }
})
</script>

<template>
  <div class="bookmark-item backdrop-blur-xl dark:bg-glass-dark bg-glass-light p-4 rounded-xl shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 mb-4 transition-all hover:shadow-xl">
    <div class="flex items-start space-x-3">
      <!-- 网站图标 -->
      <div v-if="bookmark.favicon" class="flex-shrink-0">
        <img :src="bookmark.favicon" alt="Favicon" class="w-6 h-6 rounded object-cover" />
      </div>
      <div v-else class="flex-shrink-0 w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
        </svg>
      </div>

      <!-- 书签内容 -->
      <div class="flex-grow">
        <h3 class="text-lg font-semibold text-primary mb-1 line-clamp-1">{{ bookmark.title }}</h3>
        
        <a 
          :href="bookmark.url" 
          target="_blank" 
          class="text-sm text-primary/70 hover:text-primary hover:underline mb-2 inline-block"
          rel="noopener noreferrer"
        >
          {{ hostname }}
          <span class="inline-block ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </a>
        
        <p v-if="bookmark.description" class="text-sm dark:text-light-dark text-dark-light mb-3 line-clamp-2">
          {{ bookmark.description }}
        </p>

        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center">
            <span class="text-xs dark:bg-dark-lighter bg-light-darker/20 dark:text-light-dark text-dark-light rounded-full px-3 py-1">
              {{ bookmark.category }}
            </span>
          </div>
          <span class="text-xs dark:text-light-dark/70 text-dark-light/70">{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark-item {
  @apply hover:scale-[1.01] transition-transform duration-200;
}

.bookmark-item:hover {
  @apply dark:border-primary/30 border-primary/40;
}
</style>