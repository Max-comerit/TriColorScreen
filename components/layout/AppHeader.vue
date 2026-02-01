<script setup lang="ts">
import NavBar from '~/components/layout/NavBar.vue'

/**
 * AppHeader Component
 *
 * @description Desktop header with logo and navigation bar
 */

</script>

<template>
  <header class="bg-neutral-900 sticky top-0 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.25)] shadow-black/50">
    <div class="mx-auto max-w-full px-3 lg:px-5 flex items-center justify-between min-h-[80px]">
      <!-- Logo -->
      <NuxtLink to="/" aria-label="Gå till hemsida" class="logo-link">
        <picture>
          <source srcset="/images/header/tcs-logo-60.webp 1x, /images/header/tcs-logo-120.webp 2x" type="image/webp">
          <img
            src="/images/header/tcs-logo-60.png"
            width="60"
            height="60"
            loading="eager"
            fetchpriority="high"
            alt="Tricolor Screen logotyp"
            decoding="async"
            class="h-[60px] w-[60px] object-contain"
            style="image-rendering: crisp-edges;"
          >
        </picture>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <NavBar />

      <!-- Dummy layout element -->
      <div class="hidden sm:block min-w-[60px] min-h-[60px]" aria-hidden="true"/>

    </div>
  </header>
</template>

<style scoped>
/* Logo link - custom styles for opacity transition */
.logo-link {
  @apply flex items-center transition-opacity duration-200;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-link:focus-visible {
  @apply outline-2 outline-layout-text-on-dark outline-offset-4 rounded;
}
</style>
