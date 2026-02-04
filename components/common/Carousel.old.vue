<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ServiceCard from './ServiceCard.vue'
import type { IServiceCardContent } from '~/types/CardContent'

// Props & Emits
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

// State
const currentPage = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)
const startX = ref(0)

// Computed
const totalItems = computed(() => props.items.length)
const perPageClamped = computed(() => Math.max(1, Math.min(props.perPage!, totalItems.value)))
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPageClamped.value)))
const maxPageIndex = computed(() => Math.max(0, totalPages.value - 1))
const carouselWidthPx = computed(() =>
  typeof props.carouselWidth === 'number'
    ? props.carouselWidth + 'px'
    : props.carouselWidth
)

// Looping: clone first and last page if loop is enabled
const pages = computed(() => {
  if (!props.loop || totalPages.value <= 1) return Array.from({ length: totalPages.value }, (_, i) => i)
  const real = Array.from({ length: totalPages.value }, (_, i) => i)
  return [totalPages.value - 1, ...real, 0] // prepend last, append first
})

// Map page index in DOM to real page index
function resolvePageIndex(pageIndex: number) {
  if (!props.loop) return pageIndex
  if (pageIndex === 0) return totalPages.value - 1 // first clone
  if (pageIndex === pages.value.length - 1) return 0 // last clone
  return pageIndex - 1
}

const isTransitioning = ref(false)

// Track style
const trackStyle = computed(() => {
  const pagePct = pages.value.length > 0 ? 100 / pages.value.length : 0
  return {
    transform: `translateX(calc(-${(currentPage.value + dragOffset.value) * pagePct}%))`,
    width: `${pages.value.length * 100}%`,
    transition: isDragging.value || !isTransitioning.value ? 'none' : 'transform 0.5s ease',
    display: 'flex',
  }
})

// Methods
function goTo(page: number) {
  currentPage.value = Math.max(0, Math.min(page, maxPageIndex.value))
}

function next() {
  if (currentPage.value >= maxPageIndex.value) {
    if (props.loop) {
      isTransitioning.value = true
      currentPage.value++ // move to clone page
      setTimeout(() => {
        isTransitioning.value = false
        currentPage.value = 0 
      }, 500)
    } else return
  } else {
    isTransitioning.value = true
    currentPage.value++
    setTimeout(() => isTransitioning.value = false, 500)
  }
}

function prev() {
  if (currentPage.value <= 0) {
    if (props.loop) {
      isTransitioning.value = true
      currentPage.value-- // move to clone page
      setTimeout(() => {
        isTransitioning.value = false
        currentPage.value = maxPageIndex.value // snap to real last page
      }, 500)
    } else return
  } else {
    isTransitioning.value = true
    currentPage.value--
    setTimeout(() => isTransitioning.value = false, 500)
  }
}
function onCardClick(item: IServiceCardContent, index: number) {
  emit('card-click', item, index)
}

// Drag/Swipe handlers
function onDragStart(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  startX.value = 'touches' in e ? e.touches[0].clientX : e.clientX
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const x = 'touches' in e ? e.touches[0].clientX : e.clientX
  const delta = x - startX.value
  dragOffset.value = -delta / parseFloat(carouselWidthPx.value)
}

function onDragEnd() {
  if (!isDragging.value) return
  const threshold = 0.2
  if (dragOffset.value > threshold) prev()
  else if (dragOffset.value < -threshold) next()
  dragOffset.value = 0
  isDragging.value = false
}

// Watchers
watch(() => props.items, () => currentPage.value = 0)

</script>

<template>
  <section class="relative" :style="{ maxWidth: carouselWidthPx }">
    <!-- Arrows -->
    <button
      v-if="props.showArrows"
      @click="prev"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-sm"
    >
      ‹
    </button>
    <button
      v-if="props.showArrows"
      @click="next"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-sm"
    >
      ›
    </button>

    <!-- Track wrapper -->
    <div
      class="overflow-hidden"
      @mousedown.prevent="onDragStart"
      @mousemove.prevent="onDragMove"
      @mouseup.prevent="onDragEnd"
      @mouseleave.prevent="onDragEnd"
      @touchstart.prevent="onDragStart"
      @touchmove.prevent="onDragMove"
      @touchend.prevent="onDragEnd"
    >
      <div :style="trackStyle">
        <div
          v-for="(pageIndex, idx) in pages"
          :key="idx"
          class="flex"
          :style="{ width: `${100 / pages.length}%`, gap: props.gapPx + 'px' }"
        >
          <div
            v-for="i in perPageClamped"
            :key="i"
            class="flex-1"
          >
            <template v-if="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)]">
              <ServiceCard
                :image-src="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)].imageSrc"
                :title="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)].title"
                :description="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)].description"
                :link="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)].link"
                :alt="props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)].alt"
                :background-color="'bg-white'"
                :text-color="'black'"
                @click="onCardClick(props.items[resolvePageIndex(pageIndex) * perPageClamped + (i - 1)], resolvePageIndex(pageIndex) * perPageClamped + (i - 1))"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div v-if="props.showDots" class="flex justify-center gap-2 mt-3">
      <button
        v-for="(_, idx) in totalPages"
        :key="idx"
        :class="idx === currentPage ? 'bg-primary-600' : 'bg-gray-300'"
        class="w-2.5 h-2.5 rounded-full"
        @click="goTo(idx)"
      />
    </div>
  </section>
</template>
