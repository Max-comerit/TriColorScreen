// layouts/default.vue

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

// Dynamic canonical — covers pages that don't define their own (e.g. about)
// Pages setting their own canonical via useHead/useSeoMeta will override this.
const siteUrl = useSiteUrl()
const route = useRoute()

// format-detection and preload - all other defaults live in nuxt.config.ts app.head
useHead({
  meta: [
    { name: 'format-detection', content: 'telephone=no' },
  ],
  link: computed(() => [
    // Canonical — pages that define their own will override this
    { rel: 'canonical', href: `${siteUrl}${route.path}` },
    // Preload tcs-wallpaper.webp image for eager loading
    {
      rel: 'preload',
      as: 'image',
      href: '/images/tcs-wallpaper.webp',
      type: 'image/webp',
      fetchpriority: 'low', // decorative → low priority
    },
  ]),
})
</script>

<template>
  <div class="min-h-[100svh] bg-tiled-logo flex flex-col">
    <!-- Skip to main content link for keyboard navigation -->
    <a
      href="#main-content"
      class="skip-link"
    >
      Hoppa till huvudinnehåll
    </a>

    <div>
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
  position: absolute;
  inset: 0;
  content: '';
  background-repeat: repeat;
  opacity: 0.3;
  z-index: -10;

  /* WebP first, PNG fallback for older browsers */
  background-image: url('/images/tcs-wallpaper.webp');
  
  /* fallback for browsers that don't support WebP */
  @supports not (background-image: url('/images/tcs-wallpaper.webp')) {
    background-image: url('/images/tcs-wallpaper.png');
  }

  background-size: 12.5%;
}
</style>
