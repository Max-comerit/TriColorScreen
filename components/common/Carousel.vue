<script setup lang="ts">
// ====================
// Imports
// ====================
import { ref, computed, onMounted } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType } from 'embla-carousel'

import type { CardItem } from '~/types/CardContent'
import ServiceCard from './ServiceCard.vue'
import ReviewCard from './ReviewCard.vue'
import LeftArrow from '~/assets/images/icons/left-arrow.svg'
import RightArrow from '~/assets/images/icons/right-arrow.svg'
/*
MIT License

Copyright (c) David Jerleke.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 */
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


// ====================
// Props & Emits
// ====================
interface Props {
  /** Array of service card content to display in the carousel */
  items: CardItem[]

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

const emit = defineEmits<{
  (e: 'card-click', item: CardItem, index: number): void
}>()

// ====================
// State
// ====================
const viewportRef = ref<HTMLDivElement | null>(null)
const embla = ref<EmblaCarouselType | null>(null)

const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const scrollProgress = ref(0) // 0–1 scrollbar progress

let lastClick = 0


// ====================
// Computed
// ====================
const carouselWidth = computed(() =>
  typeof props.carouselWidth === 'number'
    ? `${props.carouselWidth}px`
    : props.carouselWidth ?? '100%'
)

const totalPages = computed(() =>
  Math.ceil(props.items.length / props.perPage)
)

const useScrollbar = computed(() =>
  props.items.length > 10
)


// ====================
// Methods
// ====================
function scrollPrev(): void {
  embla.value?.scrollPrev()
}

function scrollNext(): void {
  embla.value?.scrollNext()
}

function handleClick(fn: () => void): void {
  const now = performance.now()
  if (now - lastClick < 50) return
  lastClick = now
  fn()
}

function goTo(index: number): void {
  embla.value?.scrollTo(index)
}

function onCardClick(item: CardItem, index: number): void {
  emit('card-click', item, index)
}

function onScrollBarChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const progress = parseFloat(input.value)

  scrollProgress.value = progress
  if (!embla.value) return

  const snaps = embla.value.scrollSnapList()
  const targetIndex = Math.round(progress * (snaps.length - 1))
  embla.value.scrollTo(targetIndex)
}


// ====================
// Lifecycle hooks
// ====================
onMounted(() => {
  if (!viewportRef.value) return

  embla.value = EmblaCarousel(viewportRef.value, {
    loop: props.loop,
    align: 'start',
    skipSnaps: true,
    dragFree: false,
  })

  const updateState = (): void => {
    if (!embla.value) return

    selectedIndex.value = embla.value.selectedScrollSnap()
    canScrollPrev.value = embla.value.canScrollPrev()
    canScrollNext.value = embla.value.canScrollNext()

    const snaps = embla.value.scrollSnapList()
    const idx = embla.value.selectedScrollSnap()
    scrollProgress.value = snaps.length > 1
      ? idx / (snaps.length - 1)
      : 0
  }

  embla.value.on('init', updateState)
  embla.value.on('select', updateState)
  embla.value.on('scroll', updateState)
})

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
          v-for="(item, idx) in props.items"
          :key="idx"
          class="flex-shrink-0 box-border"
          :style="{ width: `${100 / props.perPage!}%`, padding: `${props.gapPx! / 2}px` }"
        >
          <!-- Service Card -->
          <ServiceCard
            v-if="item.type === 'service'"
            :image-src="item.data.imageSrc"
            :title="item.data.title"
            :description="item.data.description"
            :link="item.data.link"
            :alt="item.data.alt"
            background-color="bg-primary-50"
            text-color="black"
            @click="onCardClick(item, idx)"
          />

          <!-- Review Card -->
          <ReviewCard
            v-else-if="item.type === 'review'"
            :review="item.data.review"
            :name="item.data.name"
            :date="item.data.date"
          />
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="flex flex-col gap-2 items-center sm:hidden">
        <!-- Pagination -->
        <div class="mt-2 flex justify-center gap-2">
          <!-- Dots -->
          <template v-if="!useScrollbar">
            <button
            v-for="(_, idx) in totalPages" :key="idx" class="w-2.5 h-2.5 rounded-full"
              :class="selectedIndex === idx ? 'bg-primary-600' : 'bg-gray-300'"
              :aria-label="`Item ${idx + 1}${selectedIndex === idx ? ' (current)' : ''}`"
              @click="goTo(idx)" />
          </template>

          <!-- Scrollbar -->
          <template v-else>
            <input
              type="range" min="0" max="1" step="0.001" class="embla-scrollbar w-48 h-2 rounded-lg"
              :value="scrollProgress" @input="onScrollBarChange" aria-label="Carousel scrollbar">
          </template>
        </div>
        <!-- Arrows -->
        <div class="flex gap-3 my-2">
          <button
              v-if="props.showArrows" class="
              btn-icon
              rounded-xl
              border border-black
              px-8 py-3
              hover:bg-gray-100
              touch-manipulation
              select-none
              focus:ring-2 focus:ring-primary focus:ring-offset-2
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
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
            :disabled="!canScrollNext" aria-label="Next slide" @click="handleClick(scrollNext)">
            <RightArrow />
          </button>
        </div>
      </div>

      <div class="hidden sm:flex sm:gap-0 sm:flex-row items-center">
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
              focus:ring-2 focus:ring-primary focus:ring-offset-2
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
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            "
            :disabled="!canScrollNext" aria-label="Next slide" @click="handleClick(scrollNext)">
            <RightArrow />
          </button>
        </div>
        <!-- Pagination -->
        <div class="mt-2 sm:absolute left-1/2 sm:-translate-x-1/2 flex justify-center gap-2">
          <!-- Dots -->
          <template v-if="!useScrollbar">
            <button
            v-for="(_, idx) in totalPages" :key="idx" class="w-2.5 h-2.5 rounded-full"
              :class="selectedIndex === idx ? 'bg-primary-600' : 'bg-gray-300'"
              :aria-label="`Item ${idx + 1}${selectedIndex === idx ? ' (current)' : ''}`"
              @click="goTo(idx)" />
          </template>

          <!-- Scrollbar -->
          <template v-else>
            <input
              type="range" min="0" max="1" step="0.001" class="embla-scrollbar w-48 h-2 rounded-lg"
              :value="scrollProgress" @input="onScrollBarChange" aria-label="Carousel scrollbar">
          </template>
        </div>
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