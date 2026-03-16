<script setup lang="ts">
import NavBar from '~/components/layout/NavBar.vue'
import { useNavigationStore } from '~/stores/navigationStore'

/**
 * AppHeader Component
 *
 * @description Desktop header with logo and navigation bar
 */

// ===== COMPOSABLES & STORES =====
const navigationStore = useNavigationStore()

// ===== STATE =====
const scrolled = ref(false)

// ===== LIFECYCLE HOOKS =====
onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 20
    navigationStore.setHeaderScrolled(scrolled.value)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header class="py-[10px] min-h-[80px] bg-neutral-900 sticky top-0 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.25)] shadow-black/50 transition-all duration-300" :class="scrolled ? 'min-h-[60px]' : 'min-h-[80px]'">
    <div class="min-w-[100px] mx-auto max-w-full px-3 lg:px-5 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        to="/"
        aria-label="Gå till hemsida"
        class="p-0 flex items-center transition-opacity duration-200 hover:opacity-80 focus-visible:rounded"
      >
        <picture class=" active:scale-95 transition-all" style="transition-duration: var(--tap-duration);">
          <!-- WebP -->
          <source
            type="image/webp"
            srcset="
              /images/header/tcs-logo-100.webp 1x,
              /images/header/tcs-logo-200.webp 2x
            "
          >
          <!-- PNG fallback -->
          <img
            src="/images/header/tcs-logo-100.png"
            srcset="/images/header/tcs-logo-200.png 2x"
            alt="Tricolor Screen logotyp"
            :width="scrolled ? 60 : 100"
            :height="scrolled ? 60 : 100"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            draggable="false"
            class="object-contain transition-all duration-300"
            :class="scrolled ? 'min-w-[60px]' : 'min-w-[100px]'"
            style="image-rendering: crisp-edges;"
          >
        </picture>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <NavBar class="px-[10px]" />

      <!-- Dummy layout element -->
      <div
        class="hidden sm:block transition-all duration-300"
        :class="scrolled ? 'w-[60px] min-h-[60px]' : 'w-[100px] min-h-[100px]'"
        aria-hidden="true"
      />

    </div>
  </header>
</template>
