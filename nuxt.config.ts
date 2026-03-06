// nuxt.config.ts

// https://nuxt.com/docs/api/configuration/nuxt-config

import svgLoader from 'vite-svg-loader'
export default defineNuxtConfig({
  vite: {
    plugins: [svgLoader()],
  },
  ssr: true,

  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      ignore: [
        /^\/\.netlify\/images/,
        /^\/ipx/
      ]
    },
    compressPublicAssets: true,
    routeRules: {
      // Cache HTML pages for 1 hour (revalidate in background)
      // Static asset caching (images, fonts, JS, CSS) is handled in netlify.toml
      '/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        } 
      },
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
      meta: [
        {
          name: 'robots',
          content: 'index, follow'
        }
      ]
    },
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
    '~/assets/css/layout.css'
  ],

  image: {
    provider: process.env.NETLIFY === 'true' ? 'netlify' : 'ipx',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
})
