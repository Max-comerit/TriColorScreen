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
import { CardType, type IServiceCardContent, type IReviewCardContent } from '~/types/CardContent'
import ServiceCard from '~/components/common/ServiceCard.vue'
import ReviewCard from '~/components/common/ReviewCard.vue'

// ===== PROPS & EMITS =====

interface Props {
  /** Card content array (ServiceCard or ReviewCard content) */
  cardContentArr: IServiceCardContent[] | IReviewCardContent[]
  /** Card type to determine rendering (service or review) */
  type: CardType
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
  
  return `flex flex-wrap justify-start ${direction} ${justify} ${align}`
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

<style scoped>
/**
 * CardFlexbox Component Styles
 *
 * Uses CSS Flexbox for flexible row/column layout.
 * Follows WCAG AA standards and theme colors.
 */

.card-flexbox {
  /* Flexbox styles applied via inline style for dynamic props */
  width: 100%;
}

/* Row direction: constrain card widths */
.card-flexbox.flex-row > * {
  flex: 0 1 var(--max-item-width, 325px);
  max-width: var(--max-item-width, 325px);
}

/* Column direction: full width, content-based height */
.card-flexbox.flex-col > * {
  flex: 0 1 auto;
  width: 100%;
  max-width: var(--max-item-width, 325px);
}

@media (max-width: 639px) {
  .card-flexbox.flex-row > * {
    flex: 1 1 auto;
    min-width: var(--min-item-width, 200px);
    max-width: none;
  }
  .card-flexbox.flex-col > * {
    flex: 1 1 auto;
    width: 100%;
    max-width: none;
  }
}
</style>