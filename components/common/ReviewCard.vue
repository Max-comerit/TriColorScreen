<script setup lang="ts">
/**
 * ReviewCard Component
 *
 * A reusable card for displaying customer reviews with reviewer information.
 * Features responsive layout with vertical separator and customizable styling.
 */

/** Props interface for ReviewCard component */
interface Props {
  /** Review text content */
  review: string
  /** Name of the reviewer */
  name: string
  /** Date of the review */
  date: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 'auto',
  backgroundColor: 'bg-primary-50',
})

/** Computes dynamic style object for card dimensions */
const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<template>
  <!-- Review card container -->
  <article
    class="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-card shadow-drop"
    :class="backgroundColor"
    :style="cardStyle"
  >
    <!-- Review text section -->
    <div class="flex-1">
      <blockquote class="text-sm md:text-base leading-relaxed text-gray-700 italic">
        "{{ review }}"
      </blockquote>
    </div>

    <!-- Vertical separator -->
    <div class="hidden md:block w-px bg-gray-300"></div>
    <!-- Horizontal separator for mobile -->
    <div class="md:hidden h-px bg-gray-300"></div>

    <!-- Reviewer information section -->
    <div class="flex flex-col justify-center md:min-w-fit">
      <!-- Reviewer name -->
      <p class="font-semibold text-gray-900 text-sm md:text-base">
        {{ name }}
      </p>
      <!-- Review date -->
      <p class="text-xs md:text-sm text-gray-500">
        {{ date }}
      </p>
    </div>
  </article>
</template>

<style scoped>
/* ReviewCard Component Styles */

/* Blockquote styling for better semantic structure */
blockquote {
  margin: 0;
  padding: 0;
}
</style>
