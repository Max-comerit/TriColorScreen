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
    class="w-full p-2 sm:p-3 transition-all duration-300
           flex items-center md:justify-center bg-primary-700 hover:bg-primary-800 "
  >
    <div class="flex items-center gap-2 sm:gap-2 min-w-0" style="user-select: none; -webkit-user-drag: none;">
      <div
        class="flex-shrink-0 text-primary"
        aria-hidden="true"
      >
        <component
          :is="icon"
          class="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] fill-current"
        />
      </div>

      <p class="m-0 text-lg  text-white font-semibold min-w-0">
        {{ text }}
      </p>
    </div>
  </article>
</template>
