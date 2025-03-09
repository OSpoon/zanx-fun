// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: '前端小鑫同学 - 个人网站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '前端开发者小鑫的个人网站 - OSpoon' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  vite: {
    server: {
      host: '0.0.0.0',
      hmr: {
        clientPort: 443,
        protocol: 'wss',
      },
      allowedHosts: ["3000-7d7fb7f014f5-web.clackypaas.com"],
    }
  }
})