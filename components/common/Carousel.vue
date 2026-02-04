<script setup lang="ts">
/**
 * EmblaCarousel Component
 *
 * Uses Embla Carousel to display ServiceCard items with loop, arrows, dots, and responsive per-page.
 */

import { ref, computed, onMounted } from 'vue'
import EmblaCarousel from 'embla-carousel';
import type { EmblaCarouselType } from 'embla-carousel'

import ServiceCard from './ServiceCard.vue'
import type { IServiceCardContent } from '~/types/CardContent'

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

// Computed
const carouselWidth = computed(() =>
  typeof props.carouselWidth === 'number' ? `${props.carouselWidth}px` : props.carouselWidth ?? '100%'
)

// Initialize Embla
onMounted(() => {
  if (!viewportRef.value) return

embla.value = EmblaCarousel(viewportRef.value, {
  loop: props.loop,
  align: 'start',      // 'start' aligns slides left
  skipSnaps: false,
  dragFree: false      // allows free drag
})

  // Update state
  const update = () => {
    if (!embla.value) return
    selectedIndex.value = embla.value.selectedScrollSnap()
    canScrollPrev.value = embla.value.canScrollPrev()
    canScrollNext.value = embla.value.canScrollNext()
  }

  embla.value.on('select', update)
  embla.value.on('init', update)
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

</script>

<template>
  <section class="relative" :style="{ maxWidth: carouselWidth }">
    <!-- Arrows -->
    <button
      v-if="props.showArrows"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn-icon"
      :disabled="!canScrollPrev"
      aria-label="Previous slide"
      @click="scrollPrev"
    >
      ◀
    </button>

    <button
      v-if="props.showArrows"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn-icon"
      :disabled="!canScrollNext"
      aria-label="Next slide"
      @click="scrollNext"
    >
      ▶
    </button>

    <!-- Embla viewport -->
    <div ref="viewportRef" class="overflow-hidden">
      <div class="flex gap-4">
        <div
          v-for="(item, idx) in props.items"
          :key="idx"
          class="flex-shrink-0"
          :style="{ width: `${100 / props.perPage!}%`, padding: `${props.gapPx! / 2}px` }"
        >
          <ServiceCard
            :image-src="item.imageSrc"
            :title="item.title"
            :description="item.description"
            :link="item.link"
            :alt="item.alt"
            :background-color="'bg-white'"
            :text-color="'black'"
            @click="onCardClick(item, idx)"
          />
        </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div v-if="props.showDots" class="mt-3 flex justify-center gap-2">
      <button
        v-for="(_, idx) in props.items.length"
        :key="idx"
        class="w-2.5 h-2.5 rounded-full"
        :class="selectedIndex === idx ? 'bg-primary-600' : 'bg-gray-300'"
        :aria-label="`Go to slide ${idx + 1}`"
        @click="goTo(idx)"
      />
    </div>
  </section>
</template>
