<script setup>
import { ref, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  articleContent: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const renderedContent = ref('')

onMounted(() => {
  renderContent()
})

// 在内容更新时重新渲染
watch(() => [props.article, props.articleContent], () => {
  renderContent()
}, { deep: true })

// 渲染内容
const renderContent = () => {
  // 如果有API获取的文章内容
  if (props.articleContent && props.articleContent.content) {
    renderedContent.value = md.render(props.articleContent.content)
  } 
  // 回退到文章对象中的内容（兼容旧版本）
  else if (props.article && props.article.content) {
    renderedContent.value = md.render(props.article.content)
  } else {
    renderedContent.value = ''
  }
}

// 关闭模态窗口
const closeModal = () => {
  emit('close')
}

// 防止点击内容区域时关闭模态窗口
const preventClose = (e) => {
  e.stopPropagation()
}
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" 
         class="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         @click="closeModal">
      <div 
        class="relative backdrop-blur-xl dark:bg-glass-dark bg-glass-light max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-lg border dark:border-dark-lighter/50 border-light-darker/50"
        @click="preventClose">
        <!-- 文章头部 -->
        <div class="sticky top-0 px-6 py-4 border-b dark:border-dark-lighter/50 border-light-darker/50 flex justify-between items-center backdrop-blur-lg dark:bg-dark-lighter/90 bg-light-darker/90 z-10">
          <h2 class="text-2xl font-bold text-primary truncate mr-6">{{ article.title }}</h2>
          <button 
            @click="closeModal" 
            class="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
            aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 文章元信息 -->
        <div class="px-6 py-3 dark:bg-dark-lighter/30 bg-light-darker/10 flex justify-between items-center">
          <span class="text-sm text-primary/80">{{ article.date }}</span>
          <a 
            v-if="article.originalUrl"
            :href="article.originalUrl" 
            target="_blank" 
            class="text-primary hover:underline text-sm flex items-center">
            <span>查看原文</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        
        <!-- 文章内容滚动区域 -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- 文章描述 -->
          <p class="text-lg dark:text-light-dark text-dark-light mb-6 border-l-4 border-primary/50 pl-4 py-2 italic">
            {{ article.description }}
          </p>
          
          <!-- 加载中状态 -->
          <div v-if="isLoading" class="flex flex-col items-center py-10">
            <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p class="text-primary">正在加载文章内容...</p>
          </div>
          
          <!-- 渲染的Markdown内容 -->
          <div v-else-if="renderedContent" class="markdown-body" v-html="renderedContent"></div>
          
          <!-- 没有内容的提示 -->
          <div v-else class="text-center py-10 dark:text-light-dark/70 text-dark-light/70">
            <p>没有可显示的内容</p>
            <a v-if="article.originalUrl" :href="article.originalUrl" target="_blank" class="text-primary hover:underline inline-block mt-2">
              查看原文以获取完整内容
            </a>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.markdown-body {
  @apply dark:text-light-dark text-dark-light;
}

.markdown-body :deep(h1) {
  @apply text-3xl font-bold mb-6 mt-8 dark:text-light text-dark;
}

.markdown-body :deep(h2) {
  @apply text-2xl font-bold mb-4 mt-6 dark:text-light text-dark;
}

.markdown-body :deep(h3) {
  @apply text-xl font-bold mb-3 mt-5 dark:text-light text-dark;
}

.markdown-body :deep(h4) {
  @apply text-lg font-bold mb-2 mt-4 dark:text-light text-dark;
}

.markdown-body :deep(p) {
  @apply mb-4 leading-relaxed;
}

.markdown-body :deep(ul) {
  @apply list-disc pl-6 mb-4;
}

.markdown-body :deep(ol) {
  @apply list-decimal pl-6 mb-4;
}

.markdown-body :deep(li) {
  @apply mb-2;
}

.markdown-body :deep(a) {
  @apply text-primary hover:underline;
}

.markdown-body :deep(blockquote) {
  @apply border-l-4 border-primary/50 pl-4 py-2 my-4 dark:bg-dark-lighter/30 bg-light-darker/10 italic;
}

.markdown-body :deep(code:not(pre code)) {
  @apply px-1.5 py-0.5 rounded dark:bg-dark-lighter/70 bg-light-darker/20 font-mono text-sm;
}

.markdown-body :deep(pre) {
  @apply p-4 rounded-lg dark:bg-dark-lighter/70 bg-light-darker/20 overflow-x-auto mb-4;
}

.markdown-body :deep(pre code) {
  @apply font-mono text-sm dark:text-light-dark text-dark-light;
}

.markdown-body :deep(img) {
  @apply max-w-full rounded-lg my-4;
}

.markdown-body :deep(table) {
  @apply w-full border-collapse mb-4;
}

.markdown-body :deep(th) {
  @apply dark:bg-dark-lighter/70 bg-light-darker/20 px-4 py-2 text-left dark:text-light text-dark;
}

.markdown-body :deep(td) {
  @apply border dark:border-dark-lighter/50 border-light-darker/50 px-4 py-2;
}

.markdown-body :deep(hr) {
  @apply border-t dark:border-dark-lighter/50 border-light-darker/50 my-6;
}
</style> 