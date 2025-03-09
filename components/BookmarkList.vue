<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
import BookmarkItem from '~/components/BookmarkItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { theme } = useTheme()

// 定义组件状态
const bookmarks = ref([])
const isLoading = ref(true)
const error = ref(null)
const categories = ref([])
const selectedCategory = ref('all')

// 获取书签数据
const fetchBookmarks = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/bookmarks')
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    bookmarks.value = data
    
    // 提取所有不重复的分类
    const uniqueCategories = [...new Set(data.map(bookmark => bookmark.category))]
    categories.value = uniqueCategories
  } catch (err) {
    console.error('Failed to fetch bookmarks:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// 根据分类过滤书签
const filteredBookmarks = computed(() => {
  if (selectedCategory.value === 'all') {
    return bookmarks.value
  }
  return bookmarks.value.filter(bookmark => bookmark.category === selectedCategory.value)
})

// 切换分类筛选
const changeCategory = (category) => {
  selectedCategory.value = category
}

// 页面加载时获取书签数据
onMounted(() => {
  fetchBookmarks()
})
</script>

<template>
  <div class="bookmark-list-container">
    <!-- 分类筛选 -->
    <div class="filter-container mb-6">
      <h2 class="text-xl font-bold mb-3 dark:text-light-dark text-dark-light">{{ t('bookmarks.categories') }}</h2>
      <div class="flex flex-wrap gap-2">
        <button 
          @click="changeCategory('all')" 
          :class="[
            'px-3 py-1 rounded-full text-sm transition-all',
            selectedCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'dark:bg-dark-lighter bg-light-darker/20 dark:text-light-dark text-dark-light hover:bg-primary/20'
          ]"
        >
          {{ t('bookmarks.allCategories') }}
        </button>
        
        <button 
          v-for="category in categories" 
          :key="category"
          @click="changeCategory(category)"
          :class="[
            'px-3 py-1 rounded-full text-sm transition-all',
            selectedCategory === category 
              ? 'bg-primary text-white' 
              : 'dark:bg-dark-lighter bg-light-darker/20 dark:text-light-dark text-dark-light hover:bg-primary/20'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
      <p class="text-red-700 dark:text-red-400">{{ t('bookmarks.error') }}: {{ error }}</p>
      <button 
        @click="fetchBookmarks" 
        class="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
      >
        {{ t('bookmarks.retry') }}
      </button>
    </div>
    
    <!-- 空数据提示 -->
    <div v-else-if="filteredBookmarks.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      <h3 class="text-lg font-medium dark:text-light-dark text-dark-light">{{ t('bookmarks.noBookmarks') }}</h3>
      <p class="text-sm dark:text-light-dark/70 text-dark-light/70 mt-1">
        {{ selectedCategory === 'all' ? t('bookmarks.emptyList') : t('bookmarks.noCategoryItems') }}
      </p>
    </div>
    
    <!-- 书签列表 -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:gap-6">
      <BookmarkItem 
        v-for="bookmark in filteredBookmarks" 
        :key="bookmark.id" 
        :bookmark="bookmark" 
      />
    </div>
  </div>
</template>

<style scoped>
.bookmark-list-container {
  @apply max-w-6xl mx-auto transition-colors;
}

.filter-container {
  @apply sticky top-0 z-10 backdrop-blur-lg dark:bg-dark-lighter/50 bg-light-darker/20 p-4 rounded-xl;
}
</style>