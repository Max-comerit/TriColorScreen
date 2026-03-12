// components/common/CardFlexbox.vue

<script setup lang="ts">
/**
 * CardFlexbox Component
 *
 * A flexible container for displaying card components in a row or column layout.
 * Features semantic HTML, flexbox layout, and customizable width & height options.
 * Wraps cards in a section element with proper accessibility attributes.
 */

// ===== IMPORTS =====
import { computed } from 'vue'
import type { CardItem } from '~/types/CardContent'
import ServiceCard from '~/components/common/ServiceCard.vue'
import ReviewCard from '~/components/common/ReviewCard.vue'

// ===== PROPS & EMITS =====

interface Props {
  /** Card content array (ServiceCard or ReviewCard content) */
  cardContentArr: CardItem[]
  /** Flex direction: row (horizontal) or column (vertical) */
  direction?: 'row' | 'column'
  /** Width of the flexbox (CSS value or pixel number) */
  width?: string | number
  /** Height of the flexbox (CSS value or pixel number) */
  height?: string | number
  /** Minimum item width for responsive sizing */
  minItemWidth?: string | number
  /** Maximum item width for responsive sizing */
  maxItemWidth?: string | number
  /** Gap between flex items */
  gap?: number
  /** Justify content alignment */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /** Align items alignment */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /** Aria label for accessibility */
  ariaLabel?: string
  /** Optional section ID */
  sectionId?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'row',
  width: '100%',
  height: 'auto',
  minItemWidth: '200px',
  maxItemWidth: '325px',
  gap: 24,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  ariaLabel: undefined,
  sectionId: undefined,
})

// ===== COMPUTED =====
const flexboxClasses = computed(() => {
  const direction = props.direction === 'column' ? 'flex-col' : 'flex-row'
  
  const justifyMap: Record<string, string> = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  }
  
  const alignMap: Record<string, string> = {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    'center': 'items-center',
    'stretch': 'items-stretch',
    'baseline': 'items-baseline',
  }
  
  const justify = justifyMap[props.justifyContent || 'flex-start']
  const align = alignMap[props.alignItems || 'stretch']
  
  return `flex flex-wrap ${direction} ${justify} ${align}`
})

const flexboxStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  gap: `${props.gap}px`,
  '--min-item-width': typeof props.minItemWidth === 'number' ? `${props.minItemWidth}px` : props.minItemWidth,
  '--max-item-width': typeof props.maxItemWidth === 'number' ? `${props.maxItemWidth}px` : props.maxItemWidth,
} as Record<string, string>))
</script>

<template>
  <!-- Semantic section wrapper for accessibility -->
  <section
    :id="sectionId"
    :aria-label="ariaLabel"
    class="w-full"
  >
    <!-- Flexbox container -->
    <div :class="flexboxClasses" :style="flexboxStyle" class="card-flexbox">
      <!-- Render ServiceCard or ReviewCard based on item type -->
      <template v-for="(card, index) in props.cardContentArr" :key="`${card.type}-${index}`">
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

<style scoped>
/**
 * CardFlexbox Component Styles
 *
 * Mobile-first responsive flexbox layout:
 * - Base (mobile): both row and column directions use flexible sizing with minimum-width constraint
 * - Tablet & Desktop (min-width: 640px): row applies max-width constraint; column allows content-based sizing
 */

.card-flexbox {
  /* Flexbox styles applied via inline style for dynamic props */
  width: 100%;
  max-width: 100%;
}

/* Mobile-first: allow flexible sizing with minimum width constraint */
.card-flexbox.flex-row > *,
.card-flexbox.flex-col > * {
  flex: 1 1 auto;
  width: 100%;
  min-width: var(--min-item-width, 200px);
  max-width: none;
}

/* Tablet & Desktop: constrain widths for better layout control */
@media (min-width: 640px) {
  .card-flexbox.flex-row > * {
    flex: 0 1 var(--max-item-width, 325px);
    max-width: var(--max-item-width, 325px);
  }

  .card-flexbox.flex-col > * {
    flex: 0 1 auto;
    max-width: var(--max-item-width, 325px);
  }
}
</style>