<script setup lang="ts">
// Defer non-critical fonts CSS to avoid render-blocking
// layout.css is critical and loaded in nuxt.config (contains grid structure)
// fonts.css is only needed when text renders and doesn't affect initial layout
useHead({
  link: [
    {
      rel: 'preload',
      as: 'style',
      href: '/_nuxt/assets/css/fonts.css',
      onload: `this.rel='stylesheet'`,
    },
  ],
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
