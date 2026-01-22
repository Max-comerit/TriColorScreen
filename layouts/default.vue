<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen bg-tiled-logo">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style scoped>
.bg-tiled-logo {
  position: relative;
}

.bg-tiled-logo::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: image-set(
    url('/assets/images/tcs-wallpaper.webp') type('image/webp'),
    url('/assets/images/tcs-wallpaper.png') type('image/png')
  );
  background-repeat: repeat;
  background-size: 50%;
  opacity: 0.3;
  z-index: -1;
}
</style>
