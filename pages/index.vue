<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
import ArticlePreview from '~/components/ArticlePreview.vue'

const { locale, t } = useI18n()
const { theme, toggleTheme } = useTheme()
const currentLocale = ref(locale.value)

// 文章预览状态
const isPreviewOpen = ref(false)
const selectedArticle = ref({})
const selectedArticleContent = ref({})
const isLoadingArticle = ref(false)

// 打开文章预览并加载完整内容
const openArticlePreview = async (article) => {
  selectedArticle.value = article
  isPreviewOpen.value = true
  isLoadingArticle.value = true
  
  try {
    // 从API获取完整文章内容
    const { data } = await useFetch(`/api/articles?slug=${article.slug}`)
    selectedArticleContent.value = data.value
  } catch (error) {
    console.error('Error fetching article content:', error)
  } finally {
    isLoadingArticle.value = false
  }
}

// 关闭文章预览
const closeArticlePreview = () => {
  isPreviewOpen.value = false
  selectedArticleContent.value = {}
}

// 联系表单数据
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})
const isSubmitting = ref(false)
const formSubmitted = ref(false)
const formError = ref('')

// 提交表单到GitHub Issues
const submitContactForm = async () => {
  // 表单验证
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    formError.value = t('contact.form.validation')
    return
  }

  try {
    isSubmitting.value = true
    formError.value = ''

    // 准备要提交到GitHub Issues的数据
    const issueTitle = `网站留言: ${contactForm.value.name}`
    const issueBody = `
**访客信息**
- 姓名: ${contactForm.value.name}
- 邮箱: ${contactForm.value.email}

**留言内容**
${contactForm.value.message}

---
*此留言通过个人网站的联系表单自动创建*
*时间: ${new Date().toLocaleString()}*
    `

    // 调用serverless API来创建GitHub Issue
    const response = await fetch('/api/create-github-issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '提交失败')
    }

    // 提交成功
    formSubmitted.value = true
    // 重置表单
    contactForm.value = {
      name: '',
      email: '',
      message: ''
    }
  } catch (error) {
    formError.value = error.message || t('contact.form.error')
  } finally {
    isSubmitting.value = false
  }
}

// 技能列表数据
const zhSkills = ["Vue.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Vite", "Webpack", "微前端", "性能优化", "工程化"]
const enSkills = ["Vue.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Vite", "Webpack", "Micro-Frontend", "Performance Optimization", "Engineering"]

// 根据当前语言获取技能列表
const skillItems = computed(() => {
  return locale.value === 'zh' ? zhSkills : enSkills
})

// 文章分页数据
const currentPage = ref(1)
const articlesPerPage = 2
const totalArticles = computed(() => blogArticles.value?.length || 0)
const totalPages = computed(() => Math.ceil(totalArticles.value / articlesPerPage))

// 从API获取博客文章
const { data: apiArticles, pending: articlesLoading } = useFetch('/api/articles')

// 博客文章数据
const generateBlogArticles = () => {
  if (!apiArticles.value) return []
  
  const isZh = locale.value === 'zh'
  return apiArticles.value.map(article => ({
    ...article,
    title: isZh ? article.title.zh : article.title.en,
    description: isZh ? article.description.zh : article.description.en,
    date: article.date,
    originalUrl: article.originalUrl,
    slug: article.slug
  }))
}

const blogArticles = computed(() => generateBlogArticles())

// 分页逻辑
const currentArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return blogArticles.value?.slice(start, end) || []
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 添加平滑滚动到博客区域
    const blogSection = document.getElementById('blog')
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 语言切换功能
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  currentLocale.value = locale.value
}

// 判断是否在客户端环境
const isClient = process.client

// 初始化
onMounted(() => {
  // 设置默认语言
  if (isClient) {
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      locale.value = savedLang
      currentLocale.value = savedLang
    }

    // 监听语言变化并保存
    watch(locale, (newLocale) => {
      localStorage.setItem('language', newLocale)
      currentLocale.value = newLocale
    })
  }
})

// 监听语言变化，重置分页到第一页
watch(locale, () => {
  currentPage.value = 1
})

// 分页UI优化，计算要显示的页码
const visiblePageNumbers = computed(() => {
  // 如果总页数小于等于5，则显示所有页码
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  // 否则，我们显示当前页附近的页码以及首尾页
  let result = [1, totalPages.value]
  
  // 当前页附近的页码
  for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(totalPages.value - 1, currentPage.value + 1); i++) {
    result.push(i)
  }
  
  // 排序并去重
  result = [...new Set(result)].sort((a, b) => a - b)
  
  // 添加省略号
  const withEllipsis = []
  for (let i = 0; i < result.length; i++) {
    withEllipsis.push(result[i])
    
    // 如果当前页和下一页之间有间隔，添加省略号
    if (i < result.length - 1 && result[i + 1] - result[i] > 1) {
      withEllipsis.push('...')
    }
  }
  
  return withEllipsis
})
</script>

<template>
  <div>
    <!-- 引用原app.vue的内容 -->
    <div class="min-h-screen bg-gradient-to-br dark:from-dark dark:to-dark-light from-light-dark to-light dark:text-light text-dark">
      <div class="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10"></div>

      <div class="container mx-auto px-4 py-8">
        <!-- 玻璃拟态导航栏 -->
        <nav class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-4 mb-8 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <h1 class="text-2xl font-bold text-primary mb-4 md:mb-0">{{ $t('nav.title', '前端小鑫同学') }}</h1>
            <div class="flex items-center space-x-6">
              <a href="#about" class="dark:text-light-dark text-dark-light hover:text-primary transition-colors">{{ $t('nav.about') }}</a>
              <a href="#projects" class="dark:text-light-dark text-dark-light hover:text-primary transition-colors">{{ $t('nav.projects') }}</a>
              <a href="#blog" class="dark:text-light-dark text-dark-light hover:text-primary transition-colors">{{ $t('nav.blog') }}</a>
              <a href="#contact" class="dark:text-light-dark text-dark-light hover:text-primary transition-colors">{{ $t('nav.contact') }}</a>
              
              <!-- 主题切换按钮 -->
              <button @click="toggleTheme" class="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              
              <!-- 语言切换按钮 -->
              <button @click="toggleLanguage" class="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <span class="text-primary font-medium">{{ currentLocale === 'zh' ? 'EN' : '中' }}</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- 主要内容区域 -->
        <main>
          <!-- 个人简介卡片 -->
          <div id="about" class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-8 mb-8 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50">
            <div class="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div class="avatar-container w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-primary/50 mx-auto md:mx-0 flex-shrink-0 relative group">
                <div class="avatar-glow absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img src="https://avatars.githubusercontent.com/OSpoon" alt="头像" class="w-full h-full object-cover important-rounded avatar-image" style="border-radius: 9999px !important;" />
                <div class="avatar-ring absolute inset-0 border-4 border-transparent rounded-full group-hover:border-primary group-hover:scale-110 transition-all duration-300"></div>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-primary mb-4">{{ $t('home.greeting') }}</h2>
                <p class="text-lg dark:text-light-dark text-dark-light mb-4">
                  {{ $t('home.intro') }}
                </p>
                <p class="dark:text-light-dark text-dark-light">
                  {{ $t('home.experience') }}
                </p>
              </div>
            </div>
          </div>

          <!-- 技能展示 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 h-full">
              <h3 class="text-xl font-bold text-primary mb-4">{{ $t('skills.title') }}</h3>
              <div class="flex flex-wrap gap-3">
                <span v-for="(item, index) in skillItems" :key="index" class="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">{{ item }}</span>
              </div>
            </div>
            <div class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 h-full">
              <h3 class="text-xl font-bold text-primary mb-4">{{ $t('social.title') }}</h3>
              <div class="grid grid-cols-2 gap-4">
                <a href="https://github.com/OSpoon" target="_blank" class="flex items-center dark:text-light-dark text-dark-light hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {{ $t('social.github') }}
                </a>
                <a href="https://juejin.cn/user/3702810894152983" target="_blank" class="flex items-center dark:text-light-dark text-dark-light hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22L3.82047 7L20.1795 7L12 22Z"/>
                  </svg>
                  {{ $t('social.juejin') }}
                </a>
                <a href="https://blog.csdn.net/hongwei5204" target="_blank" class="flex items-center dark:text-light-dark text-dark-light hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 3H22V21H2V3ZM4 5V19H20V5H4Z"/>
                  </svg>
                  {{ $t('social.csdn') }}
                </a>
                <a href="https://www.zhihu.com/people/chai-zi-hao-34-76" target="_blank" class="flex items-center dark:text-light-dark text-dark-light hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078H16.5s-.234 1.152-.468 1.74h-2.669v10.18h-2.333v-10.18h-3.58L7.45 4.078zm10.629 5.315c0-.702-.145-1.91-.482-2.337-.336-.43-1.382-.636-1.96-.702h-.016c.077.149.231.702.231 1.301v.152h-3.336V7.5c0-.351.336-.585.336-.585h3.336v-1.26s-.165-.585-.585-.622c-.42-.035-6.571 0-6.571 0S8.032 7.5 8.001 9.315c-.03 1.818.475 2.944.598 3.104 0 0 1.458-.039 2.318-.039h.918c0 .4-.117 2.192-.806 3.104h2.606c-.324-.93-.713-2.337-.713-3.104h1.46c.402 4 1.969 4.09 1.969 4.09 0-1.653.06-3.628.06-3.628h1.763v3.59c.88-.7 2.333-1.167 2.333-3.59-.001-2.42-2.143-3.72-2.143-3.669z"/>
                  </svg>
                  {{ $t('social.zhihu') }}
                </a>
              </div>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 mb-8">
            <h3 class="text-2xl font-bold text-primary mb-6">{{ $t('work.title') }}</h3>
            <div class="space-y-6">
              <div class="relative pl-8 border-l border-primary/30">
                <div class="absolute w-4 h-4 bg-primary rounded-full -left-2 mt-1"></div>
                <h4 class="text-xl font-semibold dark:text-light text-dark">{{ $t('work.job1.title') }}</h4>
                <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <p class="text-primary/80">{{ $t('work.job1.company').split('|')[0].trim() }}</p>
                  <p class="text-primary/90 font-medium">{{ $t('work.job1.company').split('|')[1]?.trim() }}</p>
                </div>
                <p class="dark:text-light-dark text-dark-light mt-2">
                  {{ $t('work.job1.description') }}
                </p>
              </div>
              <div class="relative pl-8 border-l border-primary/30">
                <div class="absolute w-4 h-4 bg-primary rounded-full -left-2 mt-1"></div>
                <h4 class="text-xl font-semibold dark:text-light text-dark">{{ $t('work.job2.title') }}</h4>
                <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <p class="text-primary/80">{{ $t('work.job2.company').split('|')[0].trim() }}</p>
                  <p class="text-primary/90 font-medium">{{ $t('work.job2.company').split('|')[1]?.trim() }}</p>
                </div>
                <p class="dark:text-light-dark text-dark-light mt-2">
                  {{ $t('work.job2.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- 最新项目 -->
          <div id="projects" class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 mb-8">
            <h3 class="text-2xl font-bold text-primary mb-6">{{ $t('projects.title') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50 transform hover:scale-105 transition-all">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h4 class="text-lg font-semibold dark:text-light text-dark">{{ $t('projects.project1.title') }}</h4>
                </div>
                <p class="dark:text-light-dark text-dark-light mb-3">{{ $t('projects.project1.description') }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs bg-primary/20 text-primary py-1 px-2 rounded">Vue3</span>
                  <a href="https://github.com/OSpoon/vxe-table-plugin" target="_blank" class="text-primary hover:underline">{{ $t('projects.viewCode') }}</a>
                </div>
              </div>
              
              <div class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50 transform hover:scale-105 transition-all">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 class="text-lg font-semibold dark:text-light text-dark">{{ $t('projects.project2.title') }}</h4>
                </div>
                <p class="dark:text-light-dark text-dark-light mb-3">{{ $t('projects.project2.description') }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs bg-primary/20 text-primary py-1 px-2 rounded">Vue</span>
                  <a href="https://github.com/OSpoon/mini-vue-router" target="_blank" class="text-primary hover:underline">{{ $t('projects.viewCode') }}</a>
                </div>
              </div>
              
              <div class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50 transform hover:scale-105 transition-all">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h4 class="text-lg font-semibold dark:text-light text-dark">{{ $t('projects.project3.title') }}</h4>
                </div>
                <p class="dark:text-light-dark text-dark-light mb-3">{{ $t('projects.project3.description') }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs bg-primary/20 text-primary py-1 px-2 rounded">JavaScript</span>
                  <a href="https://github.com/OSpoon/fe-monitor" target="_blank" class="text-primary hover:underline">{{ $t('projects.viewCode') }}</a>
                </div>
              </div>
            </div>
          </div>

          <!-- 博客文章 -->
          <div id="blog" class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 mb-8">
            <h3 class="text-2xl font-bold text-primary mb-6">{{ $t('blog.title') }}</h3>
            <div class="space-y-6">
              <!-- 加载状态 -->
              <div v-if="articlesLoading" class="flex flex-col items-center py-8">
                <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p class="text-primary">{{ locale === 'zh' ? '正在加载文章...' : 'Loading articles...' }}</p>
              </div>
              
              <!-- 没有文章时显示 -->
              <div v-else-if="currentArticles.length === 0" class="text-center py-8 dark:text-light-dark/70 text-dark-light/70">
                <p>{{ locale === 'zh' ? '暂无文章' : 'No articles available' }}</p>
              </div>
              
              <!-- 文章列表 -->
              <template v-else>
                <div v-for="(article, index) in currentArticles" :key="index" class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50">
                  <h4 class="text-xl font-semibold dark:text-light text-dark mb-2">{{ article.title }}</h4>
                  <p class="dark:text-light-dark text-dark-light mb-3">{{ article.description }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-primary/80">{{ article.date }}</span>
                    <div class="flex space-x-3">
                      <button 
                        @click="openArticlePreview(article)" 
                        class="text-primary hover:underline flex items-center"
                      >
                        <span>{{ locale === 'zh' ? '阅读全文' : 'Read Article' }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <a 
                        v-if="article.originalUrl" 
                        :href="article.originalUrl" 
                        target="_blank" 
                        class="text-primary hover:underline flex items-center"
                      >
                        <span>{{ $t('blog.readMore') }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- 分页控件 -->
              <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-6">
                <button 
                  @click="goToPage(currentPage - 1)" 
                  :disabled="currentPage === 1" 
                  class="px-3 py-1 rounded-md dark:bg-dark-lighter/70 bg-light-darker/30 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/20"
                >
                  {{ locale === 'zh' ? '上一页' : 'Prev' }}
                </button>
                
                <div class="flex space-x-1">
                  <template v-for="item in visiblePageNumbers" :key="item">
                    <!-- 省略号 -->
                    <span 
                      v-if="item === '...'" 
                      class="w-8 h-8 flex items-center justify-center dark:text-light-dark text-dark-light"
                    >
                      {{ item }}
                    </span>
                    
                    <!-- 页码按钮 -->
                    <button 
                      v-else
                      @click="goToPage(item)" 
                      :class="[
                        'w-8 h-8 rounded-md flex items-center justify-center transition-colors',
                        currentPage === item 
                          ? 'bg-primary text-white' 
                          : 'dark:bg-dark-lighter/70 bg-light-darker/30 text-primary hover:bg-primary/20'
                      ]"
                    >
                      {{ item }}
                    </button>
                  </template>
                </div>
                
                <button 
                  @click="goToPage(currentPage + 1)" 
                  :disabled="currentPage === totalPages" 
                  class="px-3 py-1 rounded-md dark:bg-dark-lighter/70 bg-light-darker/30 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/20"
                >
                  {{ locale === 'zh' ? '下一页' : 'Next' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 联系我 -->
          <div id="contact" class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-6 shadow-lg border dark:border-dark-lighter/50 border-light-darker/50 mb-8">
            <h3 class="text-2xl font-bold text-primary mb-6">{{ $t('contact.title') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50">
                <h4 class="text-lg font-semibold dark:text-light text-dark mb-4">{{ $t('contact.form.title') }}</h4>
                <div v-if="formSubmitted" class="p-4 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                  <p class="text-green-700 dark:text-green-300">{{ $t('contact.form.success') }}</p>
                </div>
                <div v-if="formError" class="p-4 bg-red-100 dark:bg-red-900 rounded-lg mb-4">
                  <p class="text-red-700 dark:text-red-300">{{ formError }}</p>
                </div>
                <div v-if="!formSubmitted" class="space-y-4">
                  <div>
                    <label class="block dark:text-light-dark text-dark-light mb-2">{{ $t('contact.form.name') }}</label>
                    <input 
                      v-model="contactForm.name" 
                      type="text" 
                      class="w-full p-2 rounded dark:bg-dark-light bg-light border dark:border-dark-lighter/70 border-light-darker/50 dark:text-light text-dark focus:outline-none focus:ring-2 focus:ring-primary/50">
                  </div>
                  <div>
                    <label class="block dark:text-light-dark text-dark-light mb-2">{{ $t('contact.form.email') }}</label>
                    <input 
                      v-model="contactForm.email" 
                      type="email" 
                      class="w-full p-2 rounded dark:bg-dark-light bg-light border dark:border-dark-lighter/70 border-light-darker/50 dark:text-light text-dark focus:outline-none focus:ring-2 focus:ring-primary/50">
                  </div>
                  <div>
                    <label class="block dark:text-light-dark text-dark-light mb-2">{{ $t('contact.form.message') }}</label>
                    <textarea 
                      v-model="contactForm.message" 
                      class="w-full p-2 rounded dark:bg-dark-light bg-light border dark:border-dark-lighter/70 border-light-darker/50 dark:text-light text-dark focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      rows="4"></textarea>
                  </div>
                  <button 
                    :disabled="isSubmitting" 
                    @click="submitContactForm" 
                    class="w-full py-2 bg-primary hover:bg-primary/80 text-light font-medium rounded transition-colors flex justify-center items-center">
                    <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-light border-t-transparent rounded-full animate-spin mr-2"></span>
                    {{ $t('contact.form.send') }}
                  </button>
                </div>
              </div>
              <div class="dark:bg-dark-lighter/50 bg-light-darker/20 rounded-lg p-5 shadow-md border dark:border-dark-lighter/70 border-light-darker/50">
                <h4 class="text-lg font-semibold dark:text-light text-dark mb-4">{{ $t('contact.other.title') }}</h4>
                
                <!-- 微信二维码 - 显示在顶部突出位置 -->
                <div class="mb-6 flex flex-col items-center">
                  <div class="w-40 h-40 mx-auto bg-white p-1 rounded shadow-md">
                    <img src="/images/qrcode.jpg" alt="公众号二维码" class="w-full h-full object-cover">
                  </div>
                  <p class="dark:text-light-dark text-dark-light text-center mt-3 font-medium">{{ $t('contact.other.followWechat') }}</p>
                  <div class="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    <span class="text-primary font-medium">{{ $t('contact.other.wechatName') }}</span>
                  </div>
                </div>
                
                <!-- 分隔线 -->
                <div class="border-t border-primary/20 my-4"></div>
                
                <!-- 其他联系方式 -->
                <div class="mt-4">
                  <div class="flex items-center bg-primary/5 p-3 rounded-lg mb-3 hover:bg-primary/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h5 class="dark:text-light text-dark font-medium">{{ $t('contact.other.email') }}</h5>
                      <p class="dark:text-light-dark text-dark-light">zxin088@gmail.com</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center mt-6">
                    <!-- GitHub -->
                    <a href="https://github.com/OSpoon" target="_blank" class="mx-2 p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    
                    <!-- 掘金 -->
                    <a href="https://juejin.cn/user/3702810894152983" target="_blank" class="mx-2 p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22L3.82047 7L20.1795 7L12 22Z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 页脚 -->
        <footer class="backdrop-blur-xl dark:bg-glass-dark bg-glass-light rounded-xl p-4 text-center dark:text-light-dark/70 text-dark-light/70 border dark:border-dark-lighter/50 border-light-darker/50">
          <p>{{ $t('footer.copyright') }}</p>
        </footer>
      </div>
    </div>
    
    <!-- 文章预览模态窗口 -->
    <ArticlePreview 
      :article="selectedArticle" 
      :article-content="selectedArticleContent"
      :is-open="isPreviewOpen" 
      :is-loading="isLoadingArticle"
      @close="closeArticlePreview" 
    />
  </div>
</template>

<style lang="postcss">
body {
  @apply bg-light dark:bg-dark;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-light-dark dark:bg-dark-light;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/30 dark:bg-primary/30 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-primary/50 dark:bg-primary/50;
}

/* 确保头像总是圆形的 */
.rounded-full {
  border-radius: 9999px !important;
}

img.rounded-full,
.rounded-full img {
  border-radius: 9999px !important;
}

.important-rounded {
  border-radius: 9999px !important;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

/* 确保头像容器保持固定尺寸和圆形 */
.w-32.h-32.rounded-full {
  min-width: 8rem;
  min-height: 8rem;
  max-width: 8rem;
  max-height: 8rem;
  border-radius: 50% !important;
  overflow: hidden;
}

/* 头像悬停效果 */
.avatar-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.avatar-container:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(96, 165, 250, 0.5);
}

.avatar-image {
  transition: transform 0.3s ease;
}

.avatar-glow {
  filter: blur(10px);
  z-index: -1;
}

.avatar-ring {
  z-index: 2;
  pointer-events: none;
}
</style> 