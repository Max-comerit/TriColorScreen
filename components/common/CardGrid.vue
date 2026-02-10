// components/common/CardGrid.vue

<script setup lang="ts">
/**
 * CardGrid Component
 *
 * A responsive grid container for displaying card components.
 * Features semantic HTML, auto-responsive layout using CSS Grid auto-fill,
 * and flexible sizing options. Wraps cards in a section element with proper
 * accessibility attributes.
 */

// ===== IMPORTS =====
import type { CardItem } from '~/types/CardContent'
import ServiceCard from '~/components/common/ServiceCard.vue'
import ReviewCard from '~/components/common/ReviewCard.vue'

// ===== PROPS & EMITS =====

interface Props {
  /** Card content array (ServiceCard or ReviewCard content) */
  cardContentArr: CardItem[]
  /** Width of the grid (CSS value or pixel number) */
  width?: string | number
  /** Height of the grid (CSS value or pixel number) */
  height?: string | number
  /** Minimum item width for responsive grid */
  minItemWidth?: string | number
  /** Make all cards the same height (height of the tallest card) */
  sameItemHeight?: boolean
  /** Gap between grid items */
  gap?: number
  /** Aria label for accessibility */
  ariaLabel?: string
  /** Optional section ID */
  sectionId?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 'auto',
  minItemWidth: '200px',
  sameItemHeight: true,
  gap: 24,
  ariaLabel: undefined,
  sectionId: undefined,
})

// ===== STATE =====
const isMobile = ref(true)

// ===== COMPUTED =====
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: isMobile.value ? '1fr' : `repeat(auto-fit, minmax(${typeof props.minItemWidth === 'number' ? `${props.minItemWidth}px` : props.minItemWidth}, 1fr))`,
  gridAutoRows: props.sameItemHeight ? '1fr' : 'auto',
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  gap: `${props.gap}px`,
  minHeight: '300px',
}))

// ===== LIFECYCLE HOOKS =====
onMounted(() => {
  // Check initial viewport width
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640 // Tailwind sm breakpoint
  }

  checkMobile()

  // Listen for resize events
  window.addEventListener('resize', checkMobile)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

</script>

<template>
  <!-- Semantic section wrapper for accessibility -->
  <section
    :id="sectionId"
    ref="sectionElement"
    :aria-label="ariaLabel"
    class="w-full"
  >
    <!-- Responsive grid container with auto-fill -->
    <div :style="gridStyle" class="w-full">
      <!-- Render ServiceCard or ReviewCard based on item type -->
      <template v-for="(card, index) in props.cardContentArr" :key="card.type === 'service' ? card.data.title : `${card.data.date}:${card.data.name}`">
        <ServiceCard
          v-if="card.type === 'service'"
          :image-src="card.data.imageSrc"
          :title="card.data.title"
          :description="card.data.description"
          :max-lines="card.data.maxLines"
          :link="card.data.link"
          :alt="card.data.alt"
          :background-color="(index % 2 === 0 ? 'bg-primary-50' : 'bg-secondary-50') + ' sm:bg-primary-50'"
        />
        <ReviewCard
          v-else-if="card.type === 'review'"
          :review="card.data.review"
          :name="card.data.name"
          :date="card.data.date"
        />
      </template>
    </div>
  </section>
</template>
