<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <button
    aria-label="Toggle menu"
    class="flex flex-col gap-1.5 w-8 h-8 justify-center text-white"
    @click="$emit('toggle')"
  >
    <span
      class="h-0.5 bg-current transition"
      :class="open && 'rotate-45 translate-y-2'"
    />
    <span
      class="h-0.5 bg-current transition"
      :class="open && 'opacity-0'"
    />
    <span
      class="h-0.5 bg-current transition"
      :class="open && '-rotate-45 -translate-y-2'"
    />
  </button>
</template>
