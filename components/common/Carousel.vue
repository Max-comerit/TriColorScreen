<script setup lang="ts">
/**
 * EmblaCarousel Component (TS-safe)
 *
 * - ServiceCard items
 * - Loop, arrows
 * - Dots when ≤10 slides, scrollbar otherwise
 */

import { ref, computed, onMounted } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType } from 'embla-carousel'
import ServiceCard from './ServiceCard.vue'
import type { IServiceCardContent } from '~/types/CardContent'
import LeftArrow from '~/assets/images/icons/left-arrow.svg'
import RightArrow from '~/assets/images/icons/right-arrow.svg'

interface Props {
  items: IServiceCardContent[]
  perPage?: number
  gapPx?: number
  loop?: boolean
  showArrows?: boolean
  showDots?: boolean
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

// Computed
const carouselWidth = computed(() =>
  typeof props.carouselWidth === 'number' ? `${props.carouselWidth}px` : props.carouselWidth ?? '100%'
)

const useScrollbar = computed(() => props.items.length > 15)

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
  <section class="relative mx-auto" :style="{ maxWidth: carouselWidth }">
    <!-- Embla viewport -->
    <div ref="viewportRef" class="overflow-hidden">
      <div class="flex">
        <div
          v-for="(item, idx) in props.items" :key="idx" class="flex-shrink-0 box-border"
          :style="{ width: `${100 / props.perPage!}%`, padding: `${props.gapPx! / 2}px` }">
          <ServiceCard
            :image-src="item.imageSrc" :title="item.title" :description="item.description" :link="item.link"
            :alt="item.alt" :background-color="'bg-white'" :text-color="'black'" @click="onCardClick(item, idx)" />
        </div>
      </div>
    </div>
    <div class="flex items-center align-middle ">
      <div class="flex gap-3 my-2 pl-[8px]">
        <!-- Arrows -->
        <button
          v-if="props.showArrows" class="btn-icon rounded-xl border border-black px-5 py-2 hover:bg-gray-100 text-center text-md" :disabled="!canScrollPrev" aria-label="Previous slide"
          @click="scrollPrev"
          >
          <LeftArrow />
        </button>

        <button
          v-if="props.showArrows" class="btn-icon rounded-xl border border-black px-5 py-2 hover:bg-gray-100 text-center text-md" :disabled="!canScrollNext" aria-label="Next slide"
          @click="scrollNext">
          <RightArrow />
        </button>
      </div>
      <!-- Pagination -->
      <div class="flex justify-center gap-2 mx-auto">
        <!-- Dots -->
        <template v-if="!useScrollbar">
          <button
          v-for="(_, idx) in props.items.length" :key="idx" class="w-2.5 h-2.5 rounded-full"
            :class="selectedIndex === idx ? 'bg-primary-600' : 'bg-gray-300'" :aria-label="`Go to slide ${idx + 1}`"
            @click="goTo(idx)" />
        </template>

        <!-- Scrollbar -->
        <template v-else>
          <input
            type="range" min="0" max="1" step="0.001" class="embla-scrollbar w-full h-2 rounded-lg"
            :value="scrollProgress" @input="onScrollBarChange">
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Chrome, Edge, Safari */
.embla-scrollbar::-webkit-slider-runnable-track {
  @apply bg-primary-400;
  height: 0.5rem;
  border-radius: 9999px;
}

/* Firefox */
.embla-scrollbar::-moz-range-track {
  @apply bg-primary-400;
  height: 0.5rem;
  border-radius: 9999px;
}

/* Thumb (optional, but usually needed) */
.embla-scrollbar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1rem;
  width: 1rem;
  background-color: rgb(30 64 175);
  /* primary-800 */
  border-radius: 9999px;
  cursor: pointer;
  margin-top: -0.25rem;
  /* centers thumb on track */
}

.embla-scrollbar::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  background-color: rgb(30 64 175);
  border-radius: 9999px;
  cursor: pointer;
}
</style>