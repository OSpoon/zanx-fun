<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light sticky top-0 z-50 shadow-sm border-b dark:border-dark-lighter/50 border-light-darker/50">
      <div class="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <!-- 网站标题 -->
        <NuxtLink to="/" class="text-xl font-bold text-primary">
          {{ $t('nav.title') }}
        </NuxtLink>
        
        <!-- 导航链接 -->
        <div class="hidden md:flex space-x-6 items-center">
          <NuxtLink to="/#about" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            {{ $t('nav.about') }}
          </NuxtLink>
          <NuxtLink to="/#projects" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            {{ $t('nav.projects') }}
          </NuxtLink>
          <NuxtLink to="/#blog" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            {{ $t('nav.blog') }}
          </NuxtLink>
          <NuxtLink to="/bookmarks" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            {{ $t('bookmarks.title') }}
          </NuxtLink>
          <NuxtLink to="/#contact" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            {{ $t('nav.contact') }}
          </NuxtLink>
        </div>
        
        <!-- 右侧控件：语言和主题切换 -->
        <div class="flex items-center space-x-4">
          <!-- 语言切换 -->
          <div class="relative">
            <button @click="toggleLanguage" class="flex items-center space-x-1 text-sm dark:text-light text-dark hover:text-primary transition-colors">
              <span>{{ currentLang === 'en' ? 'EN' : 'ZH' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <!-- 主题切换 -->
          <button @click="toggleTheme" class="text-sm dark:text-light text-dark hover:text-primary transition-colors">
            <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <!-- 移动端菜单按钮 -->
          <button @click="toggleMobileMenu" class="md:hidden text-sm dark:text-light text-dark hover:text-primary transition-colors">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-if="mobileMenuOpen" class="md:hidden backdrop-blur-xl dark:bg-glass-dark bg-glass-light shadow-lg border-t dark:border-dark-lighter/50 border-light-darker/50 pb-4 px-4">
        <div class="flex flex-col space-y-4">
          <NuxtLink 
            to="/#about" 
            class="text-sm dark:text-light text-dark hover:text-primary transition-colors py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.about') }}
          </NuxtLink>
          <NuxtLink 
            to="/#projects" 
            class="text-sm dark:text-light text-dark hover:text-primary transition-colors py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.projects') }}
          </NuxtLink>
          <NuxtLink 
            to="/#blog" 
            class="text-sm dark:text-light text-dark hover:text-primary transition-colors py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.blog') }}
          </NuxtLink>
          <NuxtLink 
            to="/bookmarks" 
            class="text-sm dark:text-light text-dark hover:text-primary transition-colors py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('bookmarks.title') }}
          </NuxtLink>
          <NuxtLink 
            to="/#contact" 
            class="text-sm dark:text-light text-dark hover:text-primary transition-colors py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.contact') }}
          </NuxtLink>
        </div>
      </div>
    </nav>
    
    <!-- 主要内容 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- 页脚 -->
    <footer class="mt-auto py-6 backdrop-blur-xl dark:bg-glass-dark bg-glass-light border-t dark:border-dark-lighter/50 border-light-darker/50">
      <div class="container mx-auto px-4 text-center text-sm dark:text-light/60 text-dark/60">
        {{ $t('footer.copyright') }}
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '~/composables/useTheme'

const { locale } = useI18n()
const { theme, toggleTheme } = useTheme()

const mobileMenuOpen = ref(false)

const currentLang = computed(() => locale.value)

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style>
body {
  @apply transition-colors duration-300 ease-in-out;
}

.dark body {
  @apply bg-dark text-light;
}

body {
  @apply bg-light text-dark;
}

:root {
  --color-primary: #3b82f6;
  --color-secondary: #93c5fd;
}

.dark .bg-glass-dark {
  @apply bg-dark-lighter/60;
}

.bg-glass-light {
  @apply bg-light-darker/60;
}
</style>