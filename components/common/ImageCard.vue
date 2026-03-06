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
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: '100%',
  backgroundColor: 'bg-gray-100',
})

/** Emits 'click' event when the card is clicked */
const emit = defineEmits<{
  click: []
}>()

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
const handleClick = (): void => {
  emit('click')
}
</script>

<template>
  <div class="h-full w-full">
    <article
      class="overflow-hidden rounded-card shadow-drop"
      :class="backgroundColor"
      :style="cardStyle"
      @click="handleClick"
    >
      <NuxtImg
        :src="imageSrc"
        width="480"
        height="600"
        format="webp"
        :alt="alt"
        quality="80"
        sizes="xs:100vw sm:50vw lg:34vw xl:26vw"
        fit="cover"
        loading="lazy"
        fetchpriority="low"
        class="w-full h-full object-cover"
      />
    </article>
  </div>
</template>
