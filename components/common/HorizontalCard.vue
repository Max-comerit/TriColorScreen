<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'

/**
 * HorizontalCard Component
 *
 * A responsive, semantic horizontal card with image and description.
 * - Props for title, image, description, sizing and background
 * - Emits a `click` event on activation (mouse/tap/keyboard)
 */

// ===== PROPS & EMITS =====
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
  /** Maximum number of lines to display in description - default: 4 */
  maxLines?: number
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
  /** Tailwind text color class for description */
  textColor?: string
  /** Cursor style for the card */
  cursor?:
  | 'auto'
  | 'default'
  | 'pointer'
  | 'text'
  | 'wait'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | string // allow custom CSS values if needed
  size?: 'fixed' | 'fit'
  /** Navigation link for the card (only focusable if provided) */
  link?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageFirst: true,
  imageAlt: undefined,
  width: '80%',
  height: 'auto',
  backgroundColor: 'bg-primary-50',
  textColor: 'text-neutral-700',
  cursor: 'default',
  size: 'fixed',
  link: '',
  maxLines: 4,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

// ===== COMPOSABLES & STORES =====
const attrs = useAttrs()

// ===== STATE =====
// (No additional state variables needed)

// ===== COMPUTED =====
/** Computed style for width/height props */
const cardStyle = computed(() => {
  if (props.size === 'fit') return {}

  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  }
})

const sizeClass = computed(() =>
  props.size === 'fit' ? 'w-fit h-fit max-w-[80vw]' : ''
)

/** Computes inline style for line clamping based on maxLines prop */
const descriptionStyle = computed((): CSSProperties => {
  const style: Record<string, string | number> = {
    display: '-webkit-box',
    overflow: 'hidden',
  }
  style['-webkit-box-orient'] = 'vertical'
  style['-webkit-line-clamp'] = props.maxLines
  return style as CSSProperties
})

/** Order classes so image can be shown first or second on wide screens */
const imageOrderClass = computed(() => (props.imageFirst ? 'order-1 md:order-1' : 'order-1 md:order-2'))
const contentOrderClass = computed(() => (props.imageFirst ? 'order-2 md:order-2' : 'order-2 md:text-right md:order-1'))

/** Merges inherited classes with component classes to prevent hydration mismatch */
const articleClass = computed(() => [
  'group rounded-card shadow-drop overflow-hidden p-6 mx-auto transition-transform duration-200',
  props.backgroundColor,
  attrs.class,
])

/** Merges inherited classes with link variant classes */
const linkArticleClass = computed(() => [
  'rounded-card shadow-drop overflow-hidden p-6 mx-auto transition-transform duration-200 hover:-translate-y-1',
  props.backgroundColor,
  sizeClass,
  attrs.class,
])

// ===== METHODS =====
/** Handles card click when no link is provided */
const handleCardClick = () => {
  emit('click')
}

</script>

<template>
  <div class="h-full w-full">
    <!-- Link variant - semantic <a> tag for navigation -->
    <NuxtLink
      v-if="link"
      :key="`link-${link}`"
      :to="link"
      class="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-card h-full block"
    >
      <!-- Article wrapper for semantic content -->
      <article
        :class="linkArticleClass"
        :style="cardStyle"
      >
        <!-- Title above image and content -->
        <h3 class="text-lg md:text-xl font-display font-medium mb-4 text-neutral-900 w-fit mx-auto my-0">
          {{ title }}
        </h3>

        <!-- Image and description row -->
        <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <!-- Image container -->
          <div
            :class="[
            imageOrderClass,
            'w-full md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden rounded-card'
          ]">
            <NuxtImg
              :src="imageSrc" 
              :alt="imageAlt || title"
              class="w-full object-cover transition-transform duration-300 group-hover:scale-105" 
              format="webp"
              sizes="544px sm:240px lg:325px xl:400px 2xl:400px"
              densities="x1"
              loading="lazy" 
              width="400" 
              height="300" />
          </div>

          <!-- Content container -->
          <div :class="[contentOrderClass, 'flex-1 flex flex-col justify-center']">
            <p class="text-sm md:text-base leading-relaxed " :class="props.textColor" :style="descriptionStyle">
              {{ description }}
            </p>
          </div>
        </div>
      </article>
    </NuxtLink>

    <!-- Article variant - semantic <article> for standalone content -->
    <article
      v-else
      :key="`article-${title}`"
      :class="articleClass"
      :style="{ ...cardStyle, cursor: cursor }" tabindex="0" role="button" :aria-label="title" @click="handleCardClick"
      @keydown.enter.prevent="handleCardClick" @keydown.space.prevent="handleCardClick">
      <!-- Title above image and content -->
      <h3 class="text-lg md:text-xl font-display font-semibold mb-4 text-neutral-900 w-fit mx-auto my-0">
        {{ title }}
      </h3>

      <!-- Image and description row -->
      <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <!-- Image container -->
        <div
          :class="[
          imageOrderClass,
          'w-full md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden rounded-card'
        ]">
          <NuxtImg
            :src="imageSrc" 
            :alt="imageAlt || title"
            class="w-full object-cover transition-transform duration-300" 
            format="webp"
            sizes="544px sm:240px lg:325px xl:400px 2xl:400px"
            densities="x1" 
            loading="lazy" 
            width="400" 
            height="300" />
        </div>

        <!-- Content container -->
        <div :class="[contentOrderClass, 'flex-1 flex flex-col justify-center']">
          <p class="text-sm md:text-base leading-relaxed " :class="props.textColor" :style="descriptionStyle">
            {{ description }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>