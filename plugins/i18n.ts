import { createI18n } from 'vue-i18n'
import zh from '../i18n/zh.json'
import en from '../i18n/en.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'zh', // 默认语言
    fallbackLocale: 'zh', // 回退语言
    silentTranslationWarn: true, // 静默翻译警告
    silentFallbackWarn: true, // 静默回退警告
    warnHtmlMessage: false, // 关闭HTML消息警告
    messages: {
      zh,
      en
    }
  })

  vueApp.use(i18n)
}) 