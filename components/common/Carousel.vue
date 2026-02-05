<script setup lang="ts">
import type { IServiceCardContent } from '~/types/CardContent'
import { ref, computed, onMounted } from 'vue' 
import EmblaCarousel from 'embla-carousel' 
import type { EmblaCarouselType } from 'embla-carousel' 
import ServiceCard from './ServiceCard.vue' 
import LeftArrow from '~/assets/images/icons/left-arrow.svg' 
import RightArrow from '~/assets/images/icons/right-arrow.svg'

/**
 * EmblaCarousel Component
 *
 * @description A responsive, touch-friendly carousel built on Embla Carousel.
 * Designed for displaying ServiceCard items with optional arrows, pagination dots,
 * or a scrollbar for large item sets.
 *
 * Features:
 * - Configurable items per page
 * - Optional looping
 * - Arrow navigation with debounce protection
 * - Dots pagination for small datasets
 * - Range-based scrollbar for large datasets
 * - Emits card click events with item data
 *
 * @example
 * <EmblaCarousel
 *   :items="services"
 *   :per-page="3"
 *   :gap-px="16"
 *   loop
 *   show-arrows
 *   show-dots
 *   carousel-width="1200px"
 *   @card-click="onServiceClick"
 * />
 */

// ===== PROPS =====
interface Props {
  /** Array of service card content to display in the carousel */
  items: IServiceCardContent[]

  /** Number of cards visible per page */
  perPage?: number

  /** Gap between cards in pixels */
  gapPx?: number

  /** Whether the carousel should loop infinitely */
  loop?: boolean

  /** Whether navigation arrows should be displayed */
  showArrows?: boolean

  /** Whether pagination dots should be displayed (overridden by scrollbar for large datasets) */
  showDots?: boolean

  /** Maximum width of the carousel container (CSS value or pixel number) */
  carouselWidth?: string | number
}


const props = withDefaults(defineProps<Props>(), {
  perPage: 3,
  gapPx: 16,
  loop: false,
  showArrows: true,
  showDots: true,
  carouselWidth: '100%',
})

const emit = defineEmits<{ (e: 'card-click', item: IServiceCardContent, index: number): void }>()

// Embla refs
const viewportRef = ref<HTMLDivElement | null>(null)
const embla = ref<EmblaCarouselType | null>(null)

// State
const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const scrollProgress = ref(0) // 0-1, for scrollbar
let lastClick = 0
const totalPages = Math.ceil(props.items.length / props.perPage)

// Computed
const carouselWidth = computed(() =>
  typeof props.carouselWidth === 'number' ? `${props.carouselWidth}px` : props.carouselWidth ?? '100%'
)

const useScrollbar = computed(() => props.items.length > 10) // Show scrollbar if more than 10 items, otherwise show dots

// Initialize Embla
onMounted(() => {
  if (!viewportRef.value) return

  embla.value = EmblaCarousel(viewportRef.value, {
    loop: props.loop,
    align: 'start',
    skipSnaps: true,
    dragFree: false,
  })

  const updateState = () => {
    if (!embla.value) return
    selectedIndex.value = embla.value.selectedScrollSnap()
    canScrollPrev.value = embla.value.canScrollPrev()
    canScrollNext.value = embla.value.canScrollNext()

    const snaps = embla.value.scrollSnapList()
    const idx = embla.value.selectedScrollSnap()
    scrollProgress.value = snaps.length > 1 ? idx / (snaps.length - 1) : 0
  }

  embla.value.on('init', updateState)
  embla.value.on('select', updateState)
  embla.value.on('scroll', updateState)
})

// Navigation

function scrollPrev() {
  embla.value?.scrollPrev()
}

function scrollNext() {
  embla.value?.scrollNext()
}


function handleClick(fn: () => void) {
  const now = performance.now()
  if (now - lastClick < 50) return
  lastClick = now
  fn()
}

function goTo(index: number) {
  embla.value?.scrollTo(index)
}

function onCardClick(item: IServiceCardContent, index: number) {
  emit('card-click', item, index)
}

// Scrollbar handler
function onScrollBarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const progress = parseFloat(input.value)
  scrollProgress.value = progress
  if (!embla.value) return

  const snaps = embla.value.scrollSnapList()
  const targetIndex = Math.round(progress * (snaps.length - 1))
  embla.value.scrollTo(targetIndex)
}
</script>

<template>
  <section
  class="mx-auto flex flex-col md:relative md:block"
  :style="{ maxWidth: carouselWidth }"
>
    <!-- Embla viewport -->
    <div ref="viewportRef" class="overflow-hidden">
      <div class="flex">
        <div
          v-for="(item, idx) in props.items" :key="idx" class="flex-shrink-0 box-border"
          :style="{ width: `${100 / props.perPage!}%`, padding: `${props.gapPx! / 2}px` }">
          <ServiceCard
          :image-src="item.imageSrc" :title="item.title" :description="item.description" :link="item.link"
            :alt="item.alt" :background-color="'bg-primary-50'" :text-color="'black'" @click="onCardClick(item, idx)" />
        </div>
      </div>
    </div>
    <div class="relative flex flex-col gap-2 sm:gap-0 sm:flex-row items-center">

      <!-- Pagination -->
      <div class="mt-2 sm:absolute left-1/2 sm:-translate-x-1/2 flex justify-center gap-2">
        <!-- Dots -->
        <template v-if="!useScrollbar">
          <button
          v-for="(_, idx) in totalPages" :key="idx" class="w-2.5 h-2.5 rounded-full"
            :class="selectedIndex === idx ? 'bg-primary-600' : 'bg-gray-300'" @click="goTo(idx)" />
        </template>

        <!-- Scrollbar -->
        <template v-else>
          <input
            type="range" min="0" max="1" step="0.001" class="embla-scrollbar w-48 h-2 rounded-lg"
            :value="scrollProgress" @input="onScrollBarChange">
        </template>
      </div>
      <!-- Arrows -->
      <div class="flex gap-3 my-2 sm:pl-[8px]">
        <button
            v-if="props.showArrows" class="
            btn-icon
            rounded-xl
            border border-black
            px-8 py-3
            hover:bg-gray-100
            touch-manipulation
            select-none
          " :disabled="!canScrollPrev" aria-label="Previous slide" @click="handleClick(scrollPrev)">
          <LeftArrow />
        </button>

        <button
          v-if="props.showArrows"
          class="
          btn-icon 
          rounded-xl 
          border border-black 
          px-8 py-3 
          hover:bg-gray-100 
          touch-manipulation
          select-none
          "
          :disabled="!canScrollNext" aria-label="Next slide" @click="handleClick(scrollNext)">
          <RightArrow />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Chrome, Edge, Safari */
.embla-scrollbar::-webkit-slider-runnable-track {
  @apply bg-primary-300;
  height: 0.5rem;
  border-radius: 9999px;
}

/* Firefox */
.embla-scrollbar::-moz-range-track {
  @apply bg-primary-300;
  height: 0.5rem;
  border-radius: 9999px;
}

/* Thumb (optional, but usually needed) */
.embla-scrollbar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1rem;
  width: 1rem;
   @apply bg-primary-700;
  /* primary-800 */
  border-radius: 9999px;
  cursor: pointer;
  margin-top: -0.25rem;
  /* centers thumb on track */
}

.embla-scrollbar::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  @apply bg-primary-700;
  border-radius: 9999px;
  cursor: pointer;
}
button {
  -webkit-tap-highlight-color: transparent;
}

</style>