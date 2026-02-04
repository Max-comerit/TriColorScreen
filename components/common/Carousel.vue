<script setup lang="ts">
/**
 * Carousel Component
 *
 * Displays an array of `ServiceCard` items in a responsive, accessible carousel.
 */

import { ref, computed, watch } from 'vue'
import ServiceCard from './ServiceCard.vue'
import type { IServiceCardContent } from '~/types/CardContent'

/* -------------------------------------------------------------------------- */
/* Props & Emits                                                               */
/* -------------------------------------------------------------------------- */

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

const emit = defineEmits<{
  (e: 'card-click', item: IServiceCardContent, index: number): void
}>()

/* -------------------------------------------------------------------------- */
/* State                                                                       */
/* -------------------------------------------------------------------------- */

const startX = ref<number | null>(null)
const deltaX = ref(0)

const SWIPE_THRESHOLD = 50 // px required to trigger a swipe

const currentPage = ref(0)

/* -------------------------------------------------------------------------- */
/* Computed                                                                    */
/* -------------------------------------------------------------------------- */

const totalItems = computed(() => props.items.length)

const perPageClamped = computed(() =>
  Math.max(1, Math.min(props.perPage!, totalItems.value))
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / perPageClamped.value))
)

const maxPageIndex = computed(() => totalPages.value - 1)

const carouselWidthStyle = computed(() =>
  typeof props.carouselWidth === 'number'
    ? `${props.carouselWidth}px`
    : props.carouselWidth
)

/**
 * 🔑 CRITICAL FIX:
 * Always move exactly one viewport per page.
 * No percentages based on totalPages.
 */
const trackStyle = computed(() => ({
  transform: `translateX(-${currentPage.value * 100}%)`,
}))

/* -------------------------------------------------------------------------- */
/* Methods                                                                     */
/* -------------------------------------------------------------------------- */

function next() {
  if (currentPage.value >= maxPageIndex.value) {
    if (props.loop) currentPage.value = 0
    return
  }
  currentPage.value++
}

function prev() {
  if (currentPage.value <= 0) {
    if (props.loop) currentPage.value = maxPageIndex.value
    return
  }
  currentPage.value--
}

function goTo(page: number) {
  currentPage.value = Math.max(0, Math.min(page, maxPageIndex.value))
}

function onCardClick(item: IServiceCardContent, index: number) {
  emit('card-click', item, index)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  }
}
function onPointerDown(e: PointerEvent) {
  startX.value = e.clientX
  deltaX.value = 0
}

function onPointerMove(e: PointerEvent) {
  if (startX.value === null) return
  deltaX.value = e.clientX - startX.value
}

function onPointerUp() {
  if (startX.value === null) return

  if (Math.abs(deltaX.value) > SWIPE_THRESHOLD) {
    if (deltaX.value < 0) {
      next()
    } else {
      prev()
    }
  }

  startX.value = null
  deltaX.value = 0
}


/* -------------------------------------------------------------------------- */
/* Watchers                                                                    */
/* -------------------------------------------------------------------------- */

watch(() => props.items, () => {
  currentPage.value = 0
})

watch(() => props.perPage, () => {
  currentPage.value = Math.min(currentPage.value, maxPageIndex.value)
})
</script>

<template>
  <section role="region" aria-label="Services carousel">
    <div
      class="relative mx-auto"
      :style="{ maxWidth: carouselWidthStyle }"
    >
      <!-- Navigation Arrows -->
      <div
        v-if="props.showArrows"
        class="absolute -left-2 top-1/2 -translate-y-1/2 z-10"
      >
        <button
          class="btn-icon p-2 rounded-full bg-white shadow-sm disabled:opacity-50"
          :disabled="!props.loop && currentPage === 0"
          aria-label="Previous slide"
          @click="prev"
        >
          ◀
        </button>
      </div>

      <div
        v-if="props.showArrows"
        class="absolute -right-2 top-1/2 -translate-y-1/2 z-10"
      >
        <button
          class="btn-icon p-2 rounded-full bg-white shadow-sm disabled:opacity-50"
          :disabled="!props.loop && currentPage === maxPageIndex"
          aria-label="Next slide"
          @click="next"
        >
          ▶
        </button>
      </div>

      <!-- Viewport -->
<div
  class="overflow-hidden touch-pan-y"
  tabindex="0"
  aria-roledescription="carousel"
  @keydown="onKeydown"
  @pointerdown="onPointerDown"
  @pointermove="onPointerMove"
  @pointerup="onPointerUp"
  @pointercancel="onPointerUp"
  @pointerleave="onPointerUp"
>

        <!-- Track -->
        <div
          class="flex transition-transform duration-500 w-full"
          :style="trackStyle"
        >
          <!-- Pages -->
          <div
            v-for="page in totalPages"
            :key="page"
            class="flex shrink-0 w-full"
            :style="{ gap: `${props.gapPx}px` }"
          >
            <div
              v-for="i in perPageClamped"
              :key="i"
              class="flex-1"
            >
              <template
                v-if="props.items[(page - 1) * perPageClamped + (i - 1)]"
              >
                <ServiceCard
                  :image-src="props.items[(page - 1) * perPageClamped + (i - 1)].imageSrc"
                  :title="props.items[(page - 1) * perPageClamped + (i - 1)].title"
                  :description="props.items[(page - 1) * perPageClamped + (i - 1)].description"
                  :link="props.items[(page - 1) * perPageClamped + (i - 1)].link"
                  :alt="props.items[(page - 1) * perPageClamped + (i - 1)].alt"
                  @click="onCardClick(
                    props.items[(page - 1) * perPageClamped + (i - 1)],
                    (page - 1) * perPageClamped + (i - 1)
                  )"
                />
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Dots -->
      <div
        v-if="props.showDots"
        class="mt-3 flex justify-center gap-2"
      >
        <button
          v-for="(_, idx) in totalPages"
          :key="idx"
          class="w-2.5 h-2.5 rounded-full"
          :class="idx === currentPage ? 'bg-primary-600' : 'bg-gray-300'"
          :aria-current="idx === currentPage ? 'true' : undefined"
          @click="goTo(idx)"
        />
      </div>
    </div>
  </section>
</template>
