// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'static',
    rollupConfig: {
      external: ['@nuxt/nitro-server'],
      onwarn(warning, warn) {
        // Suppress warnings from node_modules
        if (warning.id?.includes('node_modules')) return
        if (warning.ids?.some(id => id.includes('node_modules'))) return
        if (warning.code === 'UNRESOLVED_IMPORT') return
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' &&
          warning.ids?.some(id => id.includes('node_modules'))
        )
          return
        warn(warning)
      },
    },
  },

  typescript: {
    strict: true, // enables strict type-checking
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'sv',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
})
