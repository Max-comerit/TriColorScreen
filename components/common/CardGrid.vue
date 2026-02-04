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
import { CardType, type IServiceCardContent, type IReviewCardContent } from '~/types/CardContent'
import ServiceCard from '~/components/common/ServiceCard.vue'
import ReviewCard from '~/components/common/ReviewCard.vue'

// ===== PROPS & EMITS =====

interface Props {
  /** Card content array (ServiceCard or ReviewCard content) */
  cardContentArr: IServiceCardContent[] | IReviewCardContent[]
  /** Card type to determine rendering (service or review) */
  type: CardType
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

// ===== COMPUTED =====
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${typeof props.minItemWidth === 'number' ? `${props.minItemWidth}px` : props.minItemWidth}, 1fr))`,
  gridAutoRows: props.sameItemHeight ? '1fr' : 'auto',
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  gap: `${props.gap}px`,
  minHeight: '300px',
}))

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
    <div :style="gridStyle" :class="{ 'card-grid-same-height': props.sameItemHeight }" class="card-grid w-full">
      <!-- Render ServiceCard or ReviewCard based on type prop -->
      <template v-if="props.type === CardType.Service">
        <ServiceCard
          v-for="(card, index) in props.cardContentArr as IServiceCardContent[]"
          :key="card.title"
          :image-src="card.imageSrc"
          :title="card.title"
          :description="card.description"
          :link="card.link"
          :alt="card.alt"
          :background-color="(index % 2 === 0 ? 'bg-primary-50' : 'bg-secondary-50') + ' sm:bg-primary-50'"
        />
      </template>
      <template v-else-if="props.type === CardType.Review">
        <ReviewCard
          v-for="(card) in props.cardContentArr as IReviewCardContent[]"
          :key="`${card.date}:${card.name}`"
          :review="card.review"
          :name="card.name"
          :date="card.date"
        />
      </template>
    </div>
  </section>
</template>
