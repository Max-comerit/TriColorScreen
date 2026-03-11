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
import TextCard from '~/components/common/TextCard.vue'

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

// ===== COMPUTED =====
const gridStyle = computed(() => ({
  '--min-col-width': typeof props.minItemWidth === 'number' ? `${props.minItemWidth}px` : props.minItemWidth,
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
    <div :style="gridStyle" class="card-grid w-full">
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
          img-sizes="600px sm:240px md:305px lg:267px 2xl:248px"
        />
        <ReviewCard
          v-else-if="card.type === 'review'"
          :review="card.data.review"
          :name="card.data.name"
          :date="card.data.date"
        />
        <TextCard
          v-else-if="card.type === 'text'"
          :title="card.data.title"
          :description="card.data.description"
          :prefix="card.data.prefix"
          :prefix-color="card.data.prefixColor"
          :align="card.data.align"
          :background-color="card.data.backgroundColor"
        />
      </template>
    </div>
  </section>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(var(--min-col-width), 1fr));
  }
}
</style>
