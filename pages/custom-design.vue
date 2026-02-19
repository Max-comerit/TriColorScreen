// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { Canvas, FabricImage, ActiveSelection, Control, controlsUtils } from 'fabric'
import { nanoid } from 'nanoid'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import TextButton from '~/components/common/TextButton.vue'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import { useCanvasExport } from '~/composables/useCanvasExport'
import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
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

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const canvas = shallowRef<Canvas | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let currentCanvasSize = 0

// ===== LIFECYCLE HOOKS =====
onMounted(async () => {
  await nextTick()
  const el = document.getElementById('shirt-canvas') as HTMLCanvasElement
  const wrapper = canvasWrapperRef.value

    // Validate element exists and is a canvas
  if (!(el instanceof HTMLCanvasElement) || !wrapper) {
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
    if (!canvas.value) {
      initializeCanvas(el, size)
    } else {
      rescaleCanvas(size)
    }
  })
  resizeObserver.observe(wrapper)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

async function initializeCanvas(el: HTMLCanvasElement, size: number): Promise<void> {
  currentCanvasSize = size
  canvas.value = new Canvas(el, { selection: true })
  canvas.value.setDimensions({ width: size, height: size })
  canvas.value.enablePointerEvents = true

  await loadBackground('/images/custom-design/t-shirt-front.png', size)
}

async function loadBackground(url: string, size: number = currentCanvasSize): Promise<void> {
  if (!canvas.value) return

  const bg = await FabricImage.fromURL(url)
  bg.scaleToWidth(size)
  bg.scaleToHeight(size)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: size / 2, top: size / 2 })
  canvas.value.backgroundImage = bg
  canvas.value.requestRenderAll()
}

function rescaleCanvas(newSize: number): void {
  if (!canvas.value || currentCanvasSize <= 0) return
  const ratio = newSize / currentCanvasSize
  currentCanvasSize = newSize

  canvas.value.setDimensions({ width: newSize, height: newSize })

  // Rescale background image
  const bg = canvas.value.backgroundImage as FabricImage | undefined
  if (bg) {
    bg.scaleToWidth(newSize)
    bg.scaleToHeight(newSize)
    bg.set({ left: newSize / 2, top: newSize / 2 })
  }

  // Proportionally rescale and reposition all objects
  canvas.value.getObjects().forEach((obj) => {
    obj.set({
      left: (obj.left ?? 0) * ratio,
      top: (obj.top ?? 0) * ratio,
      scaleX: (obj.scaleX ?? 1) * ratio,
      scaleY: (obj.scaleY ?? 1) * ratio,
    })
    obj.setCoords()
  })

  canvas.value.requestRenderAll()
}

function uploadImage(): void {
  // Trigger file input dialog
  fileInputRef.value?.click()
}

async function handleImageSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file || !canvas.value) return

  // Validate that it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  try {
    await addImageToCanvas(canvas.value as Canvas, file)
  } catch (error) {
    alert('Failed to add image. Please try again.')
    console.error('Error adding image:', error)
  }

  // Reset input so same file can be selected again
  input.value = ''
}

function addText() {
  addTextToCanvas(canvas.value)
}

function downloadFile(dataURL: string, filename: string): void {
    const link = document.createElement('a')
    link.href = dataURL
    link.download = filename
    link.click()
}

async function downloadCanvasImages(): Promise<void> {
  if (!canvas.value) {
    alert('Canvas not initialized')
    console.error('Error downloading canvas: Canvas is not initialized')
    return
  }

  try {
    const id = nanoid(10)
    const [mergedUrl, imageUrls] = await Promise.all([
      exportMergedImage(canvas.value),
      exportImageObjects(canvas.value),
    ])

    // Download merged image first
    downloadFile(mergedUrl, `design-${id}.png`)
    URL.revokeObjectURL(mergedUrl)

    // Download individual layer images
    imageUrls.forEach((url, index) => {
      // Stagger image downloads slightly so browsers don't block them
      setTimeout(() => {
        downloadFile(url, `design-${id}-image-${index + 1}.png`)
        URL.revokeObjectURL(url)
      }, (index + 1) * 200)
    })
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
        <div class="designer flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div ref="canvasWrapperRef" class="flex-1 w-full min-w-[350px] max-w-[800px] aspect-square">
            <canvas id="shirt-canvas" class="block border border-black rounded-card overflow-hidden"/>
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
        <TextboxControls :canvas="canvas" />
        <div class="mt-24 flex justify-center gap-4">
          <TextButton @click="downloadCanvasImages">Begär Offert</TextButton>
        </div>
      </Section>
    </div>
  </div>
</template>
