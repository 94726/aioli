// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['radix-vue/nuxt', '@nuxtjs/tailwindcss', '../aioli/src/nuxt'],
  app: {
    baseURL: '/aioli/',
  },
})
