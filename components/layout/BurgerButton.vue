<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <button
    aria-label="Toggle menu"
    class="relative w-10 h-10 text-white"
    @click="$emit('toggle')"
  >
<!-- Top bar -->
<span
  class="absolute left-1/2 top-1/2 w-10 h-0.5 bg-current transition-transform duration-200"
  :class="open
    ? 'rotate-45 -translate-x-1/2 -translate-y-1/2'
    : '-translate-x-1/2 -translate-y-3'"
/>

<!-- Middle bar -->
<span
  class="absolute left-1/2 top-1/2 w-10 h-0.5 bg-current transition-opacity duration-200
         -translate-x-1/2"
  :class="open ? 'opacity-0' : ''"
/>

<!-- Bottom bar -->
<span
  class="absolute left-1/2 top-1/2 w-10 h-0.5 bg-current transition-transform duration-200"
  :class="open
    ? '-rotate-45 -translate-x-1/2 -translate-y-1/2'
    : '-translate-x-1/2 translate-y-3'"
/>
  </button>
</template>
