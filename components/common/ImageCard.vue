<script setup lang="ts">
/**
 * ImageCard Component
 *
 * A reusable card for displaying a single image without text overlay.
 */

// ===== IMPORTS =====
// (Auto-imported by Nuxt: computed)

// ===== PROPS & EMITS =====
/** Props interface for ImageCard component */
interface Props {
  /** Image source URL */
  imageSrc: string
  /** Alt text for the image */
  alt?: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
  /** Responsive sizes hint for the image — match your layout's column widths */
  imgSizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: '100%',
  backgroundColor: 'bg-gray-100',
  imgSizes: "80vw sm:370px lg:330px xl:400px"
})

// ===== COMPOSABLES & STORES =====
// (No composables or stores needed)

// ===== STATE =====
// (No state needed)

// ===== COMPUTED =====
const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

// ===== METHODS =====

</script>

<template>
  <div class="h-full w-full">
    <article
      class="overflow-hidden rounded-card"
      :class="backgroundColor"
      :style="cardStyle"
    >
      <NuxtImg
        :src="imageSrc"
        width="480"
        height="600"
        format="webp"
        :alt="alt"
        quality="70"
        :sizes="imgSizes"
        densities="x1"
        fit="cover"
        loading="lazy"
        fetchpriority="low"
        style="user-select: none; -webkit-user-drag: none;"
        class="w-full object-cover"
      />
    </article>
  </div>
</template>
