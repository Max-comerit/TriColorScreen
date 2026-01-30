<script setup lang="ts">
/**
 * HorizontalCard Component
 *
 * A responsive, semantic horizontal card with image and description.
 * - Props for title, image, description, sizing and background
 * - Emits a `click` event on activation (mouse/tap/keyboard)
 */

interface Props {
  /** Card title */
  title: string
  /** Whether the image appears before (left of) the content on wide screens */
  imageFirst?: boolean
  /** Image source URL */
  imageSrc: string
  /** Image alt text for accessibility */
  imageAlt?: string
  /** Description text shown next to the image */
  description: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageFirst: true,
  imageAlt: undefined,
  width: '80%',
  height: 'auto',
  backgroundColor: 'bg-primary-50',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

/** Computed style for width/height props */
const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

/** Order classes so image can be shown first or second on wide screens */
const imageOrderClass = computed(() => (props.imageFirst ? 'order-1 md:order-1' : 'order-1 md:order-2'))
const contentOrderClass = computed(() => (props.imageFirst ? 'order-2 md:order-2' : 'order-2 text-right md:order-1'))

</script>

<template>
  <!-- Semantic article wrapper; focusable and keyboard accessible -->
  <article
    class="group rounded-card shadow-drop overflow-hidden cursor-pointer p-6 mx-auto"
    :class="backgroundColor"
    :style="cardStyle"
    tabindex="0"
    role="button"
    :aria-label="title"
    @click="emit('click')"
    @keydown.enter.prevent="emit('click')"
    @keydown.space.prevent="emit('click')"
  >
    <!-- Title above image and content -->
    <h3 class="text-lg md:text-xl font-display font-medium mb-4 text-neutral-900 w-fit mx-auto my-0">
      {{ title }}
    </h3>

    <!-- Image and description row -->
    <div class="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
      <!-- Image container -->
      <div :class="[imageOrderClass, 'w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-card']">
        <NuxtImg
          :src="imageSrc"
          :alt="imageAlt || title"
          class="w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-card"
          format="webp"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      <!-- Content container -->
      <div :class="[contentOrderClass, 'flex-1 flex flex-col justify-center']">
        <p class="text-sm md:text-base text-neutral-700 leading-relaxed line-clamp-4">
          {{ description }}
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Ensure the card uses theme font stacks and respects rounded clipping for the image */
</style>