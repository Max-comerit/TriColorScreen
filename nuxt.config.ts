// https://nuxt.com/docs/api/configuration/nuxt-config

import svgLoader from 'vite-svg-loader'
export default defineNuxtConfig({  
  vite: {
    plugins: [svgLoader()],
  },
  ssr: true,

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      ignore: [
        /^\/\.netlify\/images/
      ]
    },
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

  image: {
    provider: 'ipx',
    netlify: {
      baseURL: process.env.IMAGES_URL
    },
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
