// https://nuxt.com/docs/api/configuration/nuxt-config

import svgLoader from 'vite-svg-loader'
export default defineNuxtConfig({  
  vite: {
    plugins: [svgLoader()],
  },
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
    prerender: {
      crawlLinks: true,
      ignore: [
        /^\/\.netlify\/images/
      ]
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

  image: {
    provider: 'ipx',
    screens: {
      sm: 640,
      md: 768,
      lg: 1024
    }
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
})
