<script setup lang="ts">
import NavBar from '~/components/layout/NavBar.vue'

/**
 * AppHeader Component
 *
 * @description Desktop header with logo and navigation bar
 */

// ===== COMPOSABLES =====
const router = useRouter()

// ===== METHODS =====
/**
 * Handle navigation to home
 */
const handleNavigation = async (href: string): Promise<void> => {
  await router.push(href)
}
</script>

<template>
  <header class="bg-neutral-900 px-5 sticky top-0 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.25)] shadow-black/50">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between min-h-[80px]">
      <!-- Logo -->
      <NuxtLink to="/" aria-label="Gå till hemsida" class="logo-link">
        <NuxtImg
          src="/images/header/tcs-logo.png"
          alt="Tricolor Screen logotyp"
          width="174"
          height="169"
          format="webp"
          loading="eager"
          decoding="async"
          class="h-[50px] w-[50px] block"
        />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <NavBar />
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
