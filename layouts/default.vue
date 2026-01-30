<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

// Base SEO meta tags for all pages
useHead({
  htmlAttrs: {
    lang: 'sv',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'author', content: 'Tricolor Screen' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Tricolor Screen' },
    { property: 'og:locale', content: 'sv_SE' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://tricolorscreen.se' },
    // Preload tcs-wallpaper images for eager loading
    { rel: 'preload', as: 'image', href: '/images/tcs-wallpaper.webp', type: 'image/webp', fetchpriority: 'high' },
    { rel: 'preload', as: 'image', href: '/images/tcs-wallpaper.png', type: 'image/png', fetchpriority: 'high' },
  ],
})
</script>

<template>
  <div>
    <!-- Skip to main content link for keyboard navigation -->
    <a
      href="#main-content"
      class="skip-link"
    >
      Hoppa till huvudinnehåll
    </a>

    <div class="min-h-screen bg-tiled-logo flex flex-col">
      <AppHeader />
      <main id="main-content" role="main" aria-label="Huvudinnehåll" tabindex="-1" class="flex-1">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
.skip-link {
  @apply absolute -top-10 left-0 z-[100] px-4 py-2 bg-neutral-900 text-white no-underline rounded-br font-semibold;
}

.skip-link:focus {
  @apply top-0;
}

.bg-tiled-logo {
  @apply relative;
}

.bg-tiled-logo::before {
  @apply absolute inset-0 bg-repeat opacity-30 -z-10;
  content: '';
  background-image: image-set(
    url('/images/tcs-wallpaper.webp') type('image/webp'),
    url('/images/tcs-wallpaper.png') type('image/png')
  ) !important;
  background-size: 12.5% !important;
}
</style>
