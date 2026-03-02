// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import '~/assets/css/custom-design-fonts.css'
import { Canvas, type FabricImage, ActiveSelection, Control, controlsUtils } from 'fabric'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasStore } from '@/stores/canvasStore'
import { storeToRefs } from 'pinia'
import { useCustomBackground, loadBackgroundOnCanvas, CUSTOM_BACKGROUND_ID } from '~/composables/useCustomBackground'
import { computed, nextTick, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import BackgroundSelector from '~/components/features/BackgroundSelector.vue'
import QuoteForm from '~/components/features/QuoteForm.vue'
import {
  createRotateControlRender,
  createTrashControlRender,
  createResizeControlRender,
} from '@/utils/customControlRenders'
import { getRotateImage, getTrashCanImage, getResizeImage } from '@/utils/customImageIcons'

// ===== COMPOSABLES =====
useHead({
  title: 'Designa eget tryck på t-shirts och kepsar | Custom Design Tool | Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Skapa och designa egna trikåprodukter med vårt designverktyg. Uppladera bilder, lägg till text och se resultatet innan produktion. Professionell textiltryck och brodyr på t-shirts, kepsar, arbetskläder och andra trikåprodukter.',
    },
    {
      name: 'keywords',
      content: 'design t-shirt, custom t-shirt, eget tryck, textiltryck, brodyr, designverktyg, kepsar, arbetskläder, trikåprodukter, skjorttryck',
    },
    {
      property: 'og:title',
      content: 'Designa eget tryck på t-shirts och kepsar - Custom Design Tool',
    },
    {
      property: 'og:description',
      content: 'Skapa unika trikåprodukter med eget tryck. Använd vårt designverktyg för att uppladera bilder och text. Professionell produktion av textiltryck och brodyr på arbetskläder och andra produkter.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/custom-design/hero.jpg',
    },
  ],
})

const { addImageToCanvas } = useCustomImage()
const { addTextToCanvas } = useCustomText()
const { rescaleObjects } = useCanvasRescale()
const canvasStore = useCanvasStore()
const { activeSide } = storeToRefs(canvasStore)

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
/** Plain (non-reactive) array of raw canvas elements, indexed by side number */
const canvasElMap: (HTMLCanvasElement | undefined)[] = []
/** Reactive array of initialized Fabric Canvas instances, indexed by side number */
const canvasMap = shallowRef<(Canvas | undefined)[]>([])
let resizeObserver: ResizeObserver | null = null
let currentCanvasWidth = 0
let currentCanvasHeight = 0

// ===== COMPOSABLES =====
const activeCanvas = computed(() => canvasMap.value[activeSide.value] ?? null)
const {
  aspectRatio,
  applyCustomBackground,
  initProductCategories,
  onCategoryChange,
  onProductChange,
  onSideChange,
} = useCustomBackground(activeCanvas)

/** Assign or remove a canvas element ref from the template v-for */
function assignCanvasEl(key: number, el: HTMLCanvasElement | null): void {
  canvasElMap[key] = el ?? undefined
}

// ===== COMPUTED =====

// ===== LIFECYCLE HOOKS =====
onMounted(async () => {
  await nextTick()
  const wrapper = canvasWrapperRef.value

  if (!wrapper) {
    console.error('Canvas wrapper not found')
    return
  }

  // Configure ActiveSelection controls (box-select / multi-select)
  ActiveSelection.ownDefaults.controls = {
    deleteIcon: new Control({
      x: 0.5,
      y: -0.5,
      offsetX: 12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createTrashControlRender(getTrashCanImage()),
      mouseUpHandler: (_eventData, transform) => {
        const target = transform?.target as ActiveSelection | undefined
        if (target) {
          const c = target.canvas
          if (c) {
            target.getObjects().forEach(obj => c.remove(obj))
            c.discardActiveObject()
            c.requestRenderAll()
          }
        }
      },
    }),
    rotateIcon: new Control({
      x: 0,
      y: -0.5,
      offsetY: -50,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createRotateControlRender(getRotateImage()),
      withConnection: true,
      actionHandler: controlsUtils.rotationWithSnapping,
    }),
    resizeIcon: new Control({
      x: 0.5,
      y: 0.5,
      offsetX: 12,
      offsetY: 12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'nwse-resize',
      render: createResizeControlRender(getResizeImage()),
      actionHandler: controlsUtils.scalingEqually,
    }),
  }
  ActiveSelection.ownDefaults.borderColor = 'blue'
  ActiveSelection.ownDefaults.borderScaleFactor = 1
  ActiveSelection.ownDefaults.borderDashArray = [5, 5]

  // Observe the wrapper div — CSS controls its size, we sync Fabric to it
  resizeObserver = new ResizeObserver((entries) => {
    const width = Math.ceil(entries[0].contentRect.width)
    const height = Math.ceil(entries[0].contentRect.height)
    if (width <= 0 || height <= 0) return

    const previousWidth = currentCanvasWidth
    if (previousWidth > 0 && (width !== previousWidth || height !== currentCanvasHeight)) {
      const ratio = width / previousWidth
      for (const canvas of canvasMap.value) {
        if (canvas) rescaleCanvas(canvas, ratio, width, height)
      }
    }

    currentCanvasWidth = width
    currentCanvasHeight = height

    for (const key of canvasStore.sideKeys) {
      const el = canvasElMap[key]
      if (el && !canvasMap.value[key]) {
        void initializeCanvas(key, el, width, height)
      }
    }
  })
  resizeObserver.observe(wrapper)
  initProductCategories()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  for (const [key, canvas] of canvasMap.value.entries()) {
    if (canvas) {
      canvasStore.save(key, canvas, currentCanvasWidth)
      canvas.dispose()
    }
  }
})

// ===== WATCHERS =====
// Single watcher for all side backgroundSelections — only reacts to actual changes
watch(
  () => canvasStore.sides.map(v => v.backgroundSelection),
  async (newSelections, oldSelections) => {
    for (let key = 0; key < newSelections.length; key++) {
      const selection = newSelections[key]
      if (selection === oldSelections?.[key]) continue
      if (!selection) continue
      const canvas = canvasMap.value[key]
      if (!canvas) continue
      canvas.remove(...canvas.getObjects())
      if (selection === CUSTOM_BACKGROUND_ID) {
        canvas.backgroundImage = undefined
        canvas.requestRenderAll()
      } else {
        await loadBackgroundOnCanvas(canvas, selection)
      }
    }
  },
  { deep: true },
)

// Initialize new canvases and dispose removed ones when the product's side count changes
watch(
  () => canvasStore.sideCount,
  async (newCount, oldCount) => {
    await nextTick()
    const newKeys = Array.from({ length: newCount }, (_, i) => i)
    for (const key of newKeys) {
      const el = canvasElMap[key]
      if (el && !canvasMap.value[key] && currentCanvasWidth > 0) {
        initializeCanvas(key, el, currentCanvasWidth, currentCanvasHeight).catch(console.error)
      }
    }
    const oldKeys = Array.from({ length: oldCount ?? 0 }, (_, i) => i)
    const removedKeys = oldKeys.filter(k => !newKeys.includes(k))
    for (const key of removedKeys) {
      const canvas = canvasMap.value[key]
      if (canvas) {
        canvas.dispose()
        const newMap = [...canvasMap.value]
        newMap[key] = undefined
        canvasMap.value = newMap
      }
      canvasElMap[key] = undefined
    }
  },
)

async function initializeCanvas(side: number, el: HTMLCanvasElement, width: number, height: number): Promise<void> {
  const canvasInstance = new Canvas(el, { selection: true })
  if (!canvasInstance) {
    console.error('Failed to initialize Fabric canvas')
    return
  }

  const newMap = [...canvasMap.value]
  newMap[side] = canvasInstance
  canvasMap.value = newMap

  canvasInstance.setDimensions({ width, height })
  canvasInstance.enablePointerEvents = true

  await canvasStore.restore(side, canvasInstance, width)

  if (!canvasInstance.backgroundImage) {
    const sideState = canvasStore.sides[side]
    // Don't load a default background if the user explicitly chose a custom (own) product —
    // in that case the canvas is intentionally blank until they upload an image.
    if (sideState?.backgroundSelection !== CUSTOM_BACKGROUND_ID) {
      const initialBackgroundUrl = getInitialBackgroundUrl(side)
      if (initialBackgroundUrl) {
        await loadBackgroundOnCanvas(canvasInstance, initialBackgroundUrl)
        if (!sideState?.backgroundSelection) {
          canvasStore.setBackgroundSelection(side, initialBackgroundUrl)
        }
      }
    }
  }

  canvasInstance.on('object:added', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:modified', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:removed', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
}

/** Returns the initial background URL for a side: uses the stored selection, or a hardcoded default for the first two sides */
function getInitialBackgroundUrl(sideKey: number): string {
  const state = canvasStore.sides[sideKey]
  if (state?.backgroundSelection && state.backgroundSelection !== CUSTOM_BACKGROUND_ID) {
    return state.backgroundSelection
  }
  // Fallback defaults for the first two sides on a blank first visit
  const defaults: string[] = [
    '/images/custom-design/t-shirt-front.png',
    '/images/custom-design/t-shirt-back.png',
  ]
  return defaults[sideKey] ?? ''
}

function rescaleCanvas(canvasInstance: Canvas, ratio: number, newWidth: number, newHeight: number): void {
  canvasInstance.setDimensions({ width: newWidth, height: newHeight })

  // Rescale background image to fill new dimensions
  const bg = canvasInstance.backgroundImage as FabricImage | undefined
  if (bg) {
    bg.scaleToWidth(newWidth)
    bg.scaleToHeight(newHeight)
    bg.set({ left: newWidth / 2, top: newHeight / 2 })
  }

  // Proportionally rescale and reposition all objects
  rescaleObjects(canvasInstance, ratio)
  canvasInstance.requestRenderAll()
}

function uploadImage(): void {
  // Trigger file input dialog
  fileInputRef.value?.click()
}

async function handleImageSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  const canvasInstance = activeCanvas.value
  if (!file || !canvasInstance) return

  // Validate that it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  try {
    await addImageToCanvas(canvasInstance, file)
  } catch (error) {
    alert('Failed to add image. Please try again.')
    console.error('Error adding image:', error)
  }

  // Reset input so same file can be selected again
  input.value = ''
}

function addText(): void {
  addTextToCanvas(activeCanvas.value)
}

</script>

<template>
  <div>
    <!-- Hidden file input for image selection -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      class="hidden"
      @change="handleImageSelected"
    >

    <!-- Hero: full width -->
    <HeroImage 
      src="/images/custom-design/hero.jpg"
      title="Designa produkter med eget tryck"
      description="Skapa unika textilprodukter med vårt design verktyg. Ladda upp dina bilder, lägg till egen text och se resultatet innan produktion."
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    />

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="services" 
        title="Design Verktyg" 
        align="center"
        aria-label="Design Verktyg"
      >
        <BackgroundSelector
          @category-changed="onCategoryChange"
          @product-changed="onProductChange"
          @side-changed="onSideChange"
          @custom-image-selected="applyCustomBackground"
        />
        <div class="designer flex flex-col sm:flex-row gap-4 items-center justify-center">
          <!-- Placeholder element to center canvas horizontally (must have same width as IconButton elements) -->
          <div class="w-[0px] md:w-[48px]" />
          <div ref="canvasWrapperRef" class="relative flex-1 w-full min-w-[350px] max-w-[800px] max-h-[1000px]" :style="{ aspectRatio: aspectRatio }">
            <div
              v-for="key in canvasStore.sideKeys"
              v-show="activeSide === key"
              :key="key"
              class="absolute inset-0"
              :aria-hidden="activeSide !== key"
            >
              <canvas
                :ref="(el) => assignCanvasEl(key, el as HTMLCanvasElement | null)"
                class="block w-full h-full border border-black rounded-card overflow-hidden"
              />
            </div>
          </div>
          <div class="flex flex-row sm:flex-col justify-center gap-3">
            <IconButton
              aria-label="Upload image design"
              variant="primary"
              size="fit"
              @click="uploadImage()"
            >
              <template #icon>
                <ImageIcon class="!w-6 !h-6" />
              </template>
            </IconButton>
            <IconButton
              aria-label="Add text design"
              variant="primary"
              size="fit"
              @click="addText()"
            >
              <template #icon>
                <TextIcon class="!w-6 !h-6" />
              </template>
            </IconButton>
          </div>
        </div>
        <TextboxControls :canvas="activeCanvas" />

        <!-- Offertformulär -->
        <div
          class="mt-10 flex justify-center"
          aria-label="Offertformulär"
        >
          <QuoteForm :canvas-map="canvasMap"/>
        </div>
      </Section>
    </div>
  </div>
</template>
