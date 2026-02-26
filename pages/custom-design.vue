// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import '~/assets/css/custom-design-fonts.css'
import { Canvas, FabricImage, ActiveSelection, Control, controlsUtils } from 'fabric'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasStore, type CanvasSide } from '@/stores/canvasStore'
import { computed, nextTick, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BackgroundSelector from '~/components/features/BackgroundSelector.vue'
import QuoteForm from '~/components/features/QuoteForm.vue'
import {
  createRotateControlRender,
  createTrashControlRender,
} from '@/utils/customControlRenders'
import { getRotateImage, getTrashCanImage } from '@/utils/customImageIcons'

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

const CUSTOM_BACKGROUND_SELECTION = 'custom'

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const frontCanvasRef = ref<HTMLCanvasElement | null>(null)
const backCanvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const activeSide = ref<CanvasSide>('front')
const frontCanvas = shallowRef<Canvas | null>(null)
const backCanvas = shallowRef<Canvas | null>(null)
let resizeObserver: ResizeObserver | null = null
let currentCanvasSize = 0

// ===== COMPUTED =====
const activeCanvas = computed(() => (activeSide.value === 'front' ? frontCanvas.value : backCanvas.value))

// ===== WATCHERS =====
const { front: frontState, back: backState } = storeToRefs(canvasStore)

watch(() => frontState.value.backgroundSelection, async (newSelection) => {
  if (!frontCanvas.value || !newSelection) return
  frontCanvas.value.remove(...frontCanvas.value.getObjects())
  if (newSelection === CUSTOM_BACKGROUND_SELECTION) {
    frontCanvas.value.backgroundImage = undefined
    frontCanvas.value.requestRenderAll()
    return
  }
  await loadBackgroundOnCanvas(frontCanvas.value, newSelection)
})

watch(() => backState.value.backgroundSelection, async (newSelection) => {
  if (!backCanvas.value || !newSelection) return
  backCanvas.value.remove(...backCanvas.value.getObjects())
  if (newSelection === CUSTOM_BACKGROUND_SELECTION) {
    backCanvas.value.backgroundImage = undefined
    backCanvas.value.requestRenderAll()
    return
  }
  await loadBackgroundOnCanvas(backCanvas.value, newSelection)
})

// ===== LIFECYCLE HOOKS =====
onMounted(async () => {
  await nextTick()
  const frontEl = frontCanvasRef.value
  const backEl = backCanvasRef.value
  const wrapper = canvasWrapperRef.value

  // Validate elements exist and are canvases
  if (!(frontEl instanceof HTMLCanvasElement) || !(backEl instanceof HTMLCanvasElement) || !wrapper) {
    console.error('Canvas element not found')
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
    const size = Math.ceil(entries[0].contentRect.width)
    if (size <= 0) return

    const previousSize = currentCanvasSize
    if (previousSize > 0 && size !== previousSize) {
      const ratio = size / previousSize
      if (frontCanvas.value) {
        rescaleCanvas(frontCanvas.value, ratio, size)
      }
      if (backCanvas.value) {
        rescaleCanvas(backCanvas.value, ratio, size)
      }
    }

    currentCanvasSize = size

    if (!frontCanvas.value) {
      void initializeCanvas('front', frontEl, size)
    }
    if (!backCanvas.value) {
      void initializeCanvas('back', backEl, size)
    }
  })
  resizeObserver.observe(wrapper)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (frontCanvas.value) {
    canvasStore.save('front', frontCanvas.value, currentCanvasSize)
    frontCanvas.value.dispose()
  }
  if (backCanvas.value) {
    canvasStore.save('back', backCanvas.value, currentCanvasSize)
    backCanvas.value.dispose()
  }
})

async function initializeCanvas(side: CanvasSide, el: HTMLCanvasElement, size: number): Promise<void> {
  const canvasInstance = new Canvas(el, { selection: true })
  if (!canvasInstance) {
    console.error('Failed to initialize Fabric canvas')
    return
  }

  if (side === 'front') {
    frontCanvas.value = canvasInstance
  } else {
    backCanvas.value = canvasInstance
  }

  canvasInstance.setDimensions({ width: size, height: size })
  canvasInstance.enablePointerEvents = true

  await canvasStore.restore(side, canvasInstance, size)

  if (!canvasInstance.backgroundImage) {
    const initialBackgroundUrl = getInitialBackgroundUrl(side)
    await loadBackgroundOnCanvas(canvasInstance, initialBackgroundUrl, size)
    const sideState = getSideState(side)
    if (!sideState.backgroundSelection && initialBackgroundUrl) {
      canvasStore.setBackgroundSelection(side, initialBackgroundUrl)
    }
  }

  canvasInstance.on('object:added', () => canvasStore.save(side, canvasInstance, currentCanvasSize))
  canvasInstance.on('object:modified', () => canvasStore.save(side, canvasInstance, currentCanvasSize))
  canvasInstance.on('object:removed', () => canvasStore.save(side, canvasInstance, currentCanvasSize))
}

function getDefaultBackgroundUrl(side: CanvasSide): string {
  return side === 'front'
    ? '/images/custom-design/t-shirt-front.png'
    : '/images/custom-design/t-shirt-back.png'
}

function getSideState(side: CanvasSide) {
  return side === 'front' ? canvasStore.front : canvasStore.back
}

function getInitialBackgroundUrl(side: CanvasSide): string {
  const sideState = getSideState(side)
  if (sideState.backgroundSelection && sideState.backgroundSelection !== CUSTOM_BACKGROUND_SELECTION) {
    return sideState.backgroundSelection
  }

  const otherSide = side === 'front' ? 'back' : 'front'
  const otherState = getSideState(otherSide)
  if (otherState.backgroundSelection && otherState.backgroundSelection !== CUSTOM_BACKGROUND_SELECTION) {
    return mapBackgroundUrlToSide(otherState.backgroundSelection, side)
  }

  return getDefaultBackgroundUrl(side)
}

function mapBackgroundUrlToSide(url: string, side: CanvasSide): string {
  if (side === 'front') {
    return url.replace('-back.', '-front.')
  }

  return url.replace('-front.', '-back.')
}

async function loadBackgroundOnCanvas(canvasInstance: Canvas, url: string, size: number = currentCanvasSize): Promise<void> {
  const bg = await FabricImage.fromURL(url)
  bg.scaleToWidth(size)
  bg.scaleToHeight(size)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: size / 2, top: size / 2 })
  canvasInstance.backgroundImage = bg
  canvasInstance.requestRenderAll()
}

function rescaleCanvas(canvasInstance: Canvas, ratio: number, newSize: number): void {
  canvasInstance.setDimensions({ width: newSize, height: newSize })

    // Rescale background image
  const bg = canvasInstance.backgroundImage as FabricImage | undefined
  if (bg) {
    bg.scaleToWidth(newSize)
    bg.scaleToHeight(newSize)
    bg.set({ left: newSize / 2, top: newSize / 2 })
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

function addText() {
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
        <BackgroundSelector :canvas="activeCanvas" :side="activeSide" @side-changed="activeSide = $event" />
        <div class="designer flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div ref="canvasWrapperRef" class="relative flex-1 w-full min-w-[350px] max-w-[800px] aspect-square">
            <div v-show="activeSide === 'front'" class="absolute inset-0" :aria-hidden="activeSide !== 'front'">
              <canvas
                ref="frontCanvasRef"
                class="block w-full h-full border border-black rounded-card overflow-hidden"
              />
            </div>
            <div v-show="activeSide === 'back'" class="absolute inset-0" :aria-hidden="activeSide !== 'back'">
              <canvas
                ref="backCanvasRef"
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
          <QuoteForm :front-canvas="frontCanvas" :back-canvas="backCanvas" product-category="Textil" product="T-Shirt" />
        </div>
      </Section>
    </div>
  </div>
</template>
