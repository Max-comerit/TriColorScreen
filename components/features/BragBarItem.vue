

<script setup lang="ts">
interface Props {
  icon: string
  text: string
}
const props = defineProps<Props>()
</script>

<template>
  <div
    class="w-full p-4 transition-all duration-300 cursor-pointer rounded-card hover:bg-black/5 hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div class="flex items-center gap-4 flex-wrap md:flex-nowrap">
      <div class="flex-shrink-0 text-primary text-2xl md:text-xl sm:text-lg" aria-hidden="true">
        <i :class="icon" />
      </div>
      <div class="flex-1 min-w-[150px]">
        <p class="m-0 text-base font-medium text-neutral-800 md:text-sm sm:text-[0.95rem]">
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>
