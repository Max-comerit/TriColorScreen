<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

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
  /** Maximum number of lines to display in description - default: 3 */
  maxLines?: number
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
  /** Text color for title and description */
  textColor?: string
  /** Navigation link for the card (only focusable if provided) */
  link?: string
  /** Alt text for the image */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxLines: 3,
  width: '100%',
  height: '100%',
  backgroundColor: 'bg-primary-50',
  textColor: 'black',
  link: '',
  alt: 'Service Image'
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

/** Computes inline style for line clamping based on maxLines prop */
const descriptionStyle = computed((): CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: props.maxLines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}))

/** Handles card click when no link is provided */
const handleCardClick = () => {
  emit('click')
}
</script>

<template>
  <!-- Link variant - semantic <a> tag for navigation -->
  <NuxtLink
    v-if="link"
    :key="`link-${link}`"
    :to="link"
    class="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-card"
  >
    <!-- Article wrapper for semantic content -->
    <article
      class="flex flex-col p-5 overflow-hidden rounded-card shadow-drop transition-transform duration-200 hover:-translate-y-1"
      :class="backgroundColor"
      :style="cardStyle"
    >
      <!-- Image container with zoom effect on hover --> 
      <!-- Note that width & height are set to reduce layout shifts -->
      <div class="w-full max-h-[75%] align-middle bg-gray-200 rounded-t-card overflow-hidden">
        <NuxtImg
          :src="imageSrc"
          width="300"
          height="200"
          format="webp"
          :alt="alt || title"
          quality="80"
          sizes="100vw sm:50vw lg:33vw xl:25vw"
          densities="x1 x2"
          fit="cover"
          loading="lazy"
          fetchpriority="low"
          class="w-full object-cover transition-transform duration-300 overflow-hidden rounded-t-card"
        />
      </div>

      <!-- Text content section with title and description -->
      <div class="flex flex-1 flex-col gap-1 ">
        <!-- Service title -->
        <h3 :class="['text-lg font-semibold line-clamp-1', textColorClass]">
          {{ title }}
        </h3>
        <!-- Service description -->
        <p :class="['text-sm leading-relaxed', textColorClass]" :style="descriptionStyle">
          {{ description }}
        </p>
      </div>
    </article>
  </NuxtLink>

  <!-- Article variant - semantic <article> for standalone content -->
  <article
    v-else
    :key="`article-${title}`"
    class="group flex flex-col p-5 overflow-hidden rounded-card shadow-drop transition-transform duration-200"
    :class="backgroundColor"
    :style="cardStyle"
    @click="handleCardClick"
    @keydown.enter.prevent="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <!-- Note that width & height are set to reduce layout shifts -->
    <div class="w-full max-h-[75%] align-middle bg-gray-200 rounded-t-card overflow-hidden">
      <NuxtImg
        :src="imageSrc"
        width="300"
        height="200"
        format="webp"
        :alt="alt || title"
        quality="80"
        sizes="100vw sm:50vw lg:33vw xl:25vw"
        densities="x1 x2"
        fit="cover"
        loading="lazy"
        fetchpriority="low"
        class="w-full object-cover transition-transform duration-300 overflow-hidden rounded-t-card"
      />
    </div>

    <!-- Text content section with title and description -->
    <div class="flex flex-1 flex-col gap-1 ">
      <!-- Service title -->
      <h3 :class="['text-lg font-semibold line-clamp-1', textColorClass]">
        {{ title }}
      </h3>
      <!-- Service description -->
      <p :class="['text-sm leading-relaxed', textColorClass]" :style="descriptionStyle">
        {{ description }}
      </p>
    </div>
  </article>
</template>
