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
import { useCanvasStore } from '@/stores/canvasStore'
import { computed, nextTick, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
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
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const activeSide = ref<string>(canvasStore.activeSide)
/** Plain (non-reactive) map of side key → raw canvas element, populated by template refs */
const canvasElMap: Record<string, HTMLCanvasElement | undefined> = {}
/** Reactive map of side key → initialized Fabric Canvas instance */
const canvasMap = shallowRef<Record<string, Canvas | undefined>>({})
let resizeObserver: ResizeObserver | null = null
let currentCanvasWidth = 0
let currentCanvasHeight = 0

/** Assign or remove a canvas element ref from the template v-for */
function assignCanvasEl(key: string, el: HTMLCanvasElement | null): void {
  canvasElMap[key] = el ?? undefined
}

// ===== COMPUTED =====
const activeCanvas = computed(() => canvasMap.value[activeSide.value] ?? null)
const canvasAspectRatio = ref('1 / 1')
const canvasAspectRatioCss = computed(() => canvasAspectRatio.value)

// ===== WATCHERS =====
watch(activeSide, (side) => {
  canvasStore.setActiveSide(side)
})

// Single watcher for all side backgroundSelections — only reacts to actual changes
watch(
  () => Object.fromEntries(Object.entries(canvasStore.sides).map(([k, v]) => [k, v.backgroundSelection])),
  async (newSelections, oldSelections) => {
    for (const [key, selection] of Object.entries(newSelections)) {
      if (selection === oldSelections?.[key]) continue
      if (!selection) continue
      const canvas = canvasMap.value[key]
      if (!canvas) continue
      canvas.remove(...canvas.getObjects())
      if (selection === CUSTOM_BACKGROUND_SELECTION) {
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
  () => canvasStore.sideKeys,
  async (newKeys, oldKeys) => {
    await nextTick()
    for (const key of newKeys) {
      const el = canvasElMap[key]
      if (el && !canvasMap.value[key] && currentCanvasWidth > 0) {
        void initializeCanvas(key, el, currentCanvasWidth, currentCanvasHeight)
      }
    }
    const removedKeys = (oldKeys ?? []).filter(k => !newKeys.includes(k))
    for (const key of removedKeys) {
      const canvas = canvasMap.value[key]
      if (canvas) {
        canvas.dispose()
        canvasMap.value = Object.fromEntries(Object.entries(canvasMap.value).filter(([k]) => k !== key))
      }
      canvasElMap[key] = undefined
    }
  },
)

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
      for (const canvas of Object.values(canvasMap.value)) {
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
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  for (const [key, canvas] of Object.entries(canvasMap.value)) {
    if (canvas) {
      canvasStore.save(key, canvas, currentCanvasWidth)
      canvas.dispose()
    }
  }
})

async function initializeCanvas(side: string, el: HTMLCanvasElement, width: number, height: number): Promise<void> {
  const canvasInstance = new Canvas(el, { selection: true })
  if (!canvasInstance) {
    console.error('Failed to initialize Fabric canvas')
    return
  }

  canvasMap.value = { ...canvasMap.value, [side]: canvasInstance }

  canvasInstance.setDimensions({ width, height })
  canvasInstance.enablePointerEvents = true

  await canvasStore.restore(side, canvasInstance, width)

  if (!canvasInstance.backgroundImage) {
    const sideState = canvasStore.sides[side]
    // Don't load a default background if the user explicitly chose a custom (own) product —
    // in that case the canvas is intentionally blank until they upload an image.
    if (sideState?.backgroundSelection !== 'custom') {
      const initialBackgroundUrl = getInitialBackgroundUrl(side)
      if (initialBackgroundUrl) {
        await loadBackgroundOnCanvas(canvasInstance, initialBackgroundUrl, width, height)
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
function getInitialBackgroundUrl(sideKey: string): string {
  const state = canvasStore.sides[sideKey]
  if (state?.backgroundSelection && state.backgroundSelection !== CUSTOM_BACKGROUND_SELECTION) {
    return state.backgroundSelection
  }
  // Fallback defaults for the first two sides on a blank first visit
  const defaults: Record<string, string> = {
    '0': '/images/custom-design/t-shirt-front.png',
    '1': '/images/custom-design/t-shirt-back.png',
  }
  return defaults[sideKey] ?? ''
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
  const entries = Object.entries(canvasMap.value).filter((e): e is [string, Canvas] => !!e[1])

  if (entries.length === 0) {
    alert('Canvas not initialized')
    console.error('Error downloading canvas: Canvas is not initialized')
    return
  }

  try {
    const id = nanoid(10)
    for (const [key, canvasInstance] of entries) {
      const [mergedUrl, imageUrls] = await Promise.all([
        exportMergedImage(canvasInstance),
        exportImageObjects(canvasInstance),
      ])

      // Download merged image first
      downloadFile(mergedUrl, `design-${id}-side-${key}.png`)
      URL.revokeObjectURL(mergedUrl)

      // Download individual layer images
      imageUrls.forEach((url, index) => {
        // Stagger image downloads slightly so browsers don't block them
        setTimeout(() => {
          downloadFile(url, `design-${id}-side-${key}-image-${index + 1}.png`)
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
        <div class="mt-24 flex justify-center gap-4">
          <TextButton @click="downloadCanvasImages">Begär Offert</TextButton>
        </div>
      </Section>
    </div>
  </div>
</template>
