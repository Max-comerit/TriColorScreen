// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'static'
  },

  typescript: {
    strict: true // enables strict type-checking
  },
    
  css: ['~/assets/css/main.css'],
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/tailwindcss']
})
