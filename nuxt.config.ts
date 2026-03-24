// nuxt.config.ts

// https://nuxt.com/docs/api/configuration/nuxt-config

import svgLoader from 'vite-svg-loader'

// On Netlify deploy previews, SITE_URL is cleared so DEPLOY_PRIME_URL (the actual deploy URL) is used instead
const siteUrl = process.env.SITE_URL || process.env.DEPLOY_PRIME_URL || 'https://www.tricolorscreen.se'

export default defineNuxtConfig({
  vite: {
    plugins: [svgLoader()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split heavy dependencies into separate chunks
            if (id.includes('fabric')) return 'fabric'
            if (id.includes('zod')) return 'zod'
            if (id.includes('embla-carousel')) return 'embla-carousel'
            
            // Extract Vue Router to shared chunk (used across app)
            if (id.includes('vue-router')) return 'vue-router'
          }
        }
      }
    }
  },
  ssr: true,

  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      ignore: [
        /^\/\.netlify\/images/,
        /^\/_ipx/
      ]
    },
    compressPublicAssets: true,
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

  runtimeConfig: {
    public: {
      appUrl: siteUrl,
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
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s | Tricolor Screen',
      meta: [
        { name: 'robots', content: 'index, follow' },
        {
          name: 'description',
          content:
            'Tricolor Screen erbjuder kompletta trycklösningar: screentryck, brodyr, textiltryck, bildekor, bilfoliering och grafisk design. Mer än 25 år av expertis i Stockholm.',
        },
        { name: 'theme-color', content: '#009fe3' },
        { name: 'author', content: 'Tricolor Screen' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Tricolor Screen' },
        { property: 'og:locale', content: 'sv_SE' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Inter-Bold.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/DMSans-Bold.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/DMSans-SemiBold.woff2', crossorigin: '' },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',     // Critical: base resets
    '~/assets/css/layout.css',   // Critical: layout grid (prevents CLS)
    '~/assets/css/fonts.css',    // Critical: font definitions
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
