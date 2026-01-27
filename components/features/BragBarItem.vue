<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  text: string
}

defineProps<Props>()
</script>


<template>
  <article
    class="w-[80%] min-w-fit p-4 transition-all duration-300
           hover:bg-primary-800 flex items-center"
  >
    <div class="flex items-center gap-4">
      <div
        class="flex-shrink-0 text-primary"
        aria-hidden="true"
      >
        <component
          :is="icon"
          class="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] fill-current"
        />
      </div>

      <p class="m-0 text-xl text-white font-semibold">
        {{ text }}
      </p>
    </div>
  </article>
</template>
