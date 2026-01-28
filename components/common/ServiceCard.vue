<script setup lang="ts">
/**
 * ServiceCard Component
 *
 * A reusable card for displaying a service with image, title and description.
 */

/** Props interface for ServiceCard component */
interface Props {
  /** Image source URL for the service card */
  imageSrc: string
  /** Title text displayed on the card */
  title: string
  /** Description text displayed below the title */
  description: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
  /** Text color for title and description */
  textColor?: string
  /** Navigation link for the card */
  link?: string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  backgroundColor: 'bg-primary-50',
  textColor: 'black',
  link: '#',
  alt: 'Service Image',
})

/** Emits 'click' event when the card is clicked or activated via keyboard */
const emit = defineEmits<{
  (e: 'click'): void
}>()

/** Computes dynamic style object for card dimensions */
const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

/** Formats the text color prop into a Tailwind class name */
const textColorClass = computed(() => `text-${props.textColor}`)
</script>

<template>
  <!-- Navigation link wrapper for the entire card -->
  <NuxtLink :to="link">
    <!-- Main card container with accessibility and interaction features -->
    <article
      class="group flex flex-col p-5 overflow-hidden rounded-card shadow-drop transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1 cursor-pointer"
      :class="backgroundColor"
      :style="cardStyle"
      tabindex="0"
      @click="emit('click')"
      @keydown.enter.prevent="emit('click')"
      @keydown.space.prevent="emit('click')"
    >
      <!-- Image container with zoom effect on hover --> 
      <div class="w-full align-middle bg-gray-200 rounded-t-card overflow-hidden">
        <NuxtImg
          :src="imageSrc"
          :alt="alt"
          quality="80"
          sizes="sm:100vw md:100vw"
          format="webp"
          loading="lazy"
          fetchpriority="low"
          class="w-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105  rounded-t-card"
        />
      </div>

      <!-- Text content section with title and description -->
      <div class="flex flex-1 flex-col gap-2 py-4">
        <!-- Service title -->
        <h3 :class="['text-lg font-semibold line-clamp-2', textColorClass]">
          {{ title }}
        </h3>
        <!-- Service description -->
        <p :class="['text-sm leading-relaxed line-clamp-3', textColorClass]">
          {{ description }}
        </p>
      </div>
    </article>
  </NuxtLink>
</template>
