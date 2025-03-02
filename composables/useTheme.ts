import { ref, watch, onMounted } from 'vue'

export const useTheme = () => {
  const theme = ref<'dark' | 'light'>('dark')

  // 初始化主题设置
  onMounted(() => {
    // 检查本地存储中是否已有主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme
      applyTheme(savedTheme)
    } else {
      // 如果没有保存的主题设置，则默认使用深色主题
      applyTheme('dark')
    }
  })

  // 当主题变化时应用到DOM
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const applyTheme = (newTheme: 'dark' | 'light') => {
    // 应用主题到HTML元素以便Tailwind可以使用dark类
    const htmlEl = document.documentElement
    if (newTheme === 'dark') {
      htmlEl.classList.add('dark')
    } else {
      htmlEl.classList.remove('dark')
    }
  }

  return {
    theme,
    toggleTheme
  }
} 