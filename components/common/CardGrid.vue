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
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import { CardType } from '~/types/CardTypes'
import { useCardContent } from '~/composables/useCardContent'
import type { IServiceCardContent, IReviewCardContent } from '~/types/CardContent'
import ServiceCard from '~/components/common/ServiceCard.vue'
import ReviewCard from '~/components/common/ReviewCard.vue'

// ===== PROPS & EMITS =====

interface Props {
  src: string
  type: CardType
  width?: string | number
  height?: string | number
  minItemWidth?: string | number
  gap?: number
  ariaLabel?: string
  sectionId?: string
}
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  minItemWidth: '200px',
  gap: 24,
  ariaLabel: undefined,
  sectionId: undefined,
})

// ===== COMPOSABLES & STORES =====
type CardTypeMap = {
  [CardType.Service]: IServiceCardContent[]
  [CardType.Review]: IReviewCardContent[]
  // Add more types here as needed
}

function getCardContentComposable<T extends CardType>(type: T, src: string) {
  return useCardContent<CardTypeMap[T]>(src)
}

const { cardContent, loading, error, loadOnVisible } = getCardContentComposable(props.type, props.src)

// ===== STATE =====
const sectionElement = ref<HTMLElement | null>(null)

// ===== COMPUTED =====
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${typeof props.minItemWidth === 'number' ? `${props.minItemWidth}px` : props.minItemWidth}, 1fr))`,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  gap: `${props.gap}px`,
  minHeight: '300px',
}))

// ===== METHODS =====
// (none needed)

// ===== LIFECYCLE HOOKS =====
onMounted(() => {
  loadOnVisible(() => sectionElement.value, 0.1)
})

// ===== WATCHERS =====
// (none needed)
</script>

<template>
  <!-- Semantic section wrapper for accessibility -->
  <section
    :id="sectionId"
    ref="sectionElement"
    :aria-label="ariaLabel"
    class="card-grid-section"
  >
    <!-- Loading state with reserved height to prevent CLS -->
    <div v-if="loading" class="flex justify-center items-center py-12 min-h-[500px]" role="status" aria-live="polite">
      <LoadingSpinner type="page" />
      <span class="sr-only">Laddar kort...</span>
    </div>

    <!-- Error state with reserved height -->
    <div v-else-if="error" class="text-center py-12 min-h-[400px] flex items-center justify-center" role="alert" aria-live="assertive">
      <div class="error-text text-lg font-medium text-center">
        <p>Kunde inte ladda kort innehåll.</p>
        <p>Vänligen försök igen senare.</p>
      </div>
    </div>

    <!-- Responsive grid container with auto-fill -->
    <div :style="gridStyle" class="card-grid">
      <!-- Render ServiceCard or ReviewCard based on type prop -->
      <template v-if="props.type === CardType.Service">
        <ServiceCard
          v-for="(card, index) in cardContent as IServiceCardContent[]"
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
          v-for="(card) in cardContent as IReviewCardContent[]"
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
 * CardGrid Component Styles
 * 
 * Uses CSS Grid auto-fill for responsive behavior.
 * Follows WCAG AA standards and theme colors.
 */

.card-grid-section {
  width: 100%;
}

.card-grid {
  /* Grid styles applied via inline style for dynamic props */
  width: 100%;
}

.error-text p {
  @apply text-error;
}

</style>
