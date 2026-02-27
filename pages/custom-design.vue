// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import '~/assets/css/custom-design-fonts.css'
import { Canvas, FabricImage, ActiveSelection, Control, controlsUtils } from 'fabric'
import { nanoid } from 'nanoid'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import TextButton from '~/components/common/TextButton.vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import { useCanvasExport } from '~/composables/useCanvasExport'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasStore, type CanvasSide } from '@/stores/canvasStore'
import { computed, nextTick, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BackgroundSelector from '~/components/features/BackgroundSelector.vue'
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
const { exportMergedImage, exportImageObjects } = useCanvasExport()
const { rescaleObjects } = useCanvasRescale()
const canvasStore = useCanvasStore()

const CUSTOM_BACKGROUND_SELECTION = 'custom'

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const frontCanvasRef = ref<HTMLCanvasElement | null>(null)
const backCanvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const activeSide = ref<CanvasSide>(canvasStore.activeSide)
const frontCanvas = shallowRef<Canvas | null>(null)
const backCanvas = shallowRef<Canvas | null>(null)
let resizeObserver: ResizeObserver | null = null
let currentCanvasWidth = 0
let currentCanvasHeight = 0

// ===== COMPUTED =====
const activeCanvas = computed(() => (activeSide.value === 'front' ? frontCanvas.value : backCanvas.value))
const canvasAspectRatio = ref('1 / 1')
const canvasAspectRatioCss = computed(() => canvasAspectRatio.value)

// ===== WATCHERS =====
const { front: frontState, back: backState } = storeToRefs(canvasStore)

watch(activeSide, (side) => {
  canvasStore.setActiveSide(side)
})

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
    const width = Math.ceil(entries[0].contentRect.width)
    const height = Math.ceil(entries[0].contentRect.height)
    if (width <= 0 || height <= 0) return

    const previousWidth = currentCanvasWidth
    if (previousWidth > 0 && (width !== previousWidth || height !== currentCanvasHeight)) {
      const ratio = width / previousWidth
      if (frontCanvas.value) {
        rescaleCanvas(frontCanvas.value, ratio, width, height)
      }
      if (backCanvas.value) {
        rescaleCanvas(backCanvas.value, ratio, width, height)
      }
    }

    currentCanvasWidth = width
    currentCanvasHeight = height

    if (!frontCanvas.value) {
      void initializeCanvas('front', frontEl, width, height)
    }
    if (!backCanvas.value) {
      void initializeCanvas('back', backEl, width, height)
    }
  })
  resizeObserver.observe(wrapper)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (frontCanvas.value) {
    canvasStore.save('front', frontCanvas.value, currentCanvasWidth)
    frontCanvas.value.dispose()
  }
  if (backCanvas.value) {
    canvasStore.save('back', backCanvas.value, currentCanvasWidth)
    backCanvas.value.dispose()
  }
})

async function initializeCanvas(side: CanvasSide, el: HTMLCanvasElement, width: number, height: number): Promise<void> {
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

  canvasInstance.setDimensions({ width, height })
  canvasInstance.enablePointerEvents = true

  await canvasStore.restore(side, canvasInstance, width)

  if (!canvasInstance.backgroundImage) {
    const sideState = getSideState(side)
    // Don't load a default background if the user explicitly chose a custom (own) product —
    // in that case the canvas is intentionally blank until they upload an image.
    if (sideState.backgroundSelection !== 'custom') {
      const initialBackgroundUrl = getInitialBackgroundUrl(side)
      await loadBackgroundOnCanvas(canvasInstance, initialBackgroundUrl, width, height)
      if (!sideState.backgroundSelection && initialBackgroundUrl) {
        canvasStore.setBackgroundSelection(side, initialBackgroundUrl)
      }
    }
  }

  canvasInstance.on('object:added', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:modified', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:removed', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
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

async function loadBackgroundOnCanvas(canvasInstance: Canvas, url: string, width = currentCanvasWidth, height = currentCanvasHeight): Promise<void> {
  const bg = await FabricImage.fromURL(url)
  bg.scaleToWidth(width)
  bg.scaleToHeight(height)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: width / 2, top: height / 2 })
  canvasInstance.backgroundImage = bg
  canvasInstance.requestRenderAll()
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

function addText() {
  addTextToCanvas(activeCanvas.value)
}

function onCanvasResized(aspectRatio: string): void {
  canvasAspectRatio.value = aspectRatio
}

function downloadFile(dataURL: string, filename: string): void {
    const link = document.createElement('a')
    link.href = dataURL
    link.download = filename
    link.click()
}

async function downloadCanvasImages(): Promise<void> {
  const availableCanvases = [
    { side: 'front' as const, canvas: frontCanvas.value },
    { side: 'back' as const, canvas: backCanvas.value },
  ].filter(entry => entry.canvas)

  if (availableCanvases.length === 0) {
    alert('Canvas not initialized')
    console.error('Error downloading canvas: Canvas is not initialized')
    return
  }

  try {
    const id = nanoid(10)
    for (const entry of availableCanvases) {
      const canvasInstance = entry.canvas as Canvas
      const [mergedUrl, imageUrls] = await Promise.all([
        exportMergedImage(canvasInstance),
        exportImageObjects(canvasInstance),
      ])

      // Download merged image first
      downloadFile(mergedUrl, `design-${id}-${entry.side}.png`)
      URL.revokeObjectURL(mergedUrl)

      // Download individual layer images
      imageUrls.forEach((url, index) => {
        // Stagger image downloads slightly so browsers don't block them
        setTimeout(() => {
          downloadFile(url, `design-${id}-${entry.side}-image-${index + 1}.png`)
          URL.revokeObjectURL(url)
        }, (index + 1) * 200)
      })
    }
  } catch (error) {
    alert('Failed to download design images')
    console.error('Error downloading canvas:', error)
  }
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
        <BackgroundSelector :canvas="activeCanvas" :side="activeSide" @side-changed="activeSide = $event" @canvas-resized="onCanvasResized" />
        <div class="designer flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div ref="canvasWrapperRef" class="relative flex-1 w-full min-w-[350px] max-w-[800px] max-h-[1000px]" :style="{ aspectRatio: canvasAspectRatioCss }">
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
        <div class="mt-24 flex justify-center gap-4">
          <TextButton @click="downloadCanvasImages">Begär Offert</TextButton>
        </div>
      </Section>
    </div>
  </div>
</template>
