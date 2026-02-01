// nuxt.config.ts

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
        /^\/\.netlify\/images/,
        /^\/ipx/
      ]
    },
    compressPublicAssets: true,
    routeRules: {
      // Cache static pages for 1 hour (revalidate in background)
      '/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' 
        } 
      },
      // Cache images for 1 year (immutable)
      '/images/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      // Cache optimized images for 1 year
      '/_ipx/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      // Cache static assets (CSS, JS, fonts) for 1 year
      '/_nuxt/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      // Cache JSON data for 1 hour with stale-while-revalidate
      '/data/**': { 
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
    },
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
    '~/assets/css/layout.css'
  ],

  image: {
    provider: 'ipx',
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
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
})
