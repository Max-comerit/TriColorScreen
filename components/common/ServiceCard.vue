<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import { TAP_ANIMATION_TIME } from '~/constants/ui'

/**
 * ServiceCard Component
 *
 * A reusable card for displaying a service with image, title and description.
 */

// ===== PROPS & EMITS =====
/** Props interface for ServiceCard component */
interface Props {
  /** Image source URL for the service card */
  imageSrc: string
  /** Title text displayed on the card */
  title: string
  /** Description text displayed below the title */
  description?: string
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
  /** Responsive sizes hint for the image — match your layout's column widths */
  imgSizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxLines: 3,
  description: '',
  width: '100%',
  height: '100%',
  backgroundColor: 'bg-primary-50',
  textColor: 'black',
  link: '',
  alt: 'Service Image',
  imgSizes: '80vw sm:50vw lg:33vw xl:25vw'
})

// ===== COMPOSABLES & STORES =====
const router = useRouter()

// ===== STATE =====
// (No additional state variables needed)

// ===== COMPUTED =====
/** Computes dynamic style object for card dimensions and transition duration */
const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

/** Formats the text color prop into a Tailwind class name */
const textColorClass = computed(() => `text-${props.textColor}`)

/** Computes inline style for line clamping based on maxLines prop */
const descriptionStyle = computed((): CSSProperties => {
  const style: Record<string, string | number> = {
    display: '-webkit-box',
    overflow: 'hidden',
  }
  style['-webkit-box-orient'] = 'vertical'
  style['-webkit-line-clamp'] = props.maxLines
  style['user-select'] = 'none'
  style['-webkit-user-drag'] = 'none'
  return style as CSSProperties
})

// ===== METHODS =====
/**
 * Handle NuxtLink click - delay navigation to allow tap animation to complete
 */
async function handleLinkClick(event: MouseEvent): Promise<void> {
  event.preventDefault()
  // Delay navigation TAP_ANIMATION_TIME ms to allow tap animation to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))
  await router.push(props.link)
}
</script>

<template>
  <div class="h-full w-full">
    <!-- Link variant - semantic <a> tag for navigation -->
    <NuxtLink
      v-if="link"
      :key="`link-${link}`"
      class="service-card-link group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-card h-full block"
      @click="handleLinkClick"
    >
      <!-- Article wrapper for semantic content -->
      <article
        class="flex flex-col p-5 overflow-hidden rounded-card shadow-drop transition-all active:scale-[0.98] active:shadow-none cursor-pointer"
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
            quality="75"
            :sizes="imgSizes"
            densities="x1"
            fit="cover"
            loading="lazy"
            fetchpriority="low"
            draggable="false"
            style="user-select: none; -webkit-user-drag: none;"
            class="w-full object-cover transition-transform duration-300 overflow-hidden rounded-t-card"
          />
        </div>

        <!-- Text content section with title and description -->
        <div class="flex flex-1 flex-col gap-1">
          <!-- Service title -->
          <h3 :class="['text-lg font-semibold line-clamp-1', textColorClass]" style="user-select: none; -webkit-user-drag: none;">
            {{ title }}
          </h3>
          <!-- Service description -->
          <slot name="description" :description-style="descriptionStyle">
            <p :class="['text-sm leading-relaxed', textColorClass]" :style="descriptionStyle">
              {{ description }}
            </p>
          </slot>
        </div>
      </article>
    </NuxtLink>

    <!-- Article variant - semantic <article> for standalone content -->
    <article
      v-else
      :key="`article-${title}`"
      class="group flex flex-col p-5 overflow-hidden rounded-card"
      :class="backgroundColor"
      :style="cardStyle"
    >
      <!-- Note that width & height are set to reduce layout shifts -->
      <div class="w-full max-h-[75%] align-middle bg-gray-200 rounded-t-card overflow-hidden">
        <NuxtImg
          :src="imageSrc"
          width="300"
          height="200"
          format="webp"
          :alt="alt || title"
          quality="75"
          :sizes="imgSizes"
          densities="x1"
          fit="cover"
          loading="lazy"
          fetchpriority="low"
          draggable="false"
          style="user-select: none; -webkit-user-drag: none;"
          class="w-full object-cover transition-transform duration-300 overflow-hidden rounded-t-card"
        />
      </div>

      <!-- Text content section with title and description -->
      <div class="flex flex-1 flex-col gap-1">
        <!-- Service title -->
        <h3 :class="['text-lg font-semibold line-clamp-1', textColorClass]" style="user-select: none; -webkit-user-drag: none;">
          {{ title }}
        </h3>
        <!-- Service description -->
        <slot name="description" :description-style="descriptionStyle">
          <p :class="['text-sm leading-relaxed', textColorClass]" :style="descriptionStyle">
            {{ description }}
          </p>
        </slot>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Apply CSS variable transition duration to articles */
article {
  transition-duration: var(--tap-duration);
}
</style>
