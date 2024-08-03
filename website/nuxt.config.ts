// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-08-03',
  devtools: { enabled: true },
  modules: ['radix-vue/nuxt', '@nuxtjs/tailwindcss', '../aioli/src/nuxt'],
  future: {
    compatibilityVersion: 4,
  },
  app: {
    baseURL: '/aioli/',
  },
})
