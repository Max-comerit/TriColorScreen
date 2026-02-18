// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { Canvas, FabricImage, ActiveSelection, Control, controlsUtils } from 'fabric'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import { ref, shallowRef, onMounted } from 'vue'
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

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const canvas = shallowRef<Canvas | null>(null)

// ===== LIFECYCLE HOOKS =====W
onMounted(async () => {
  await nextTick()
  const el = document.getElementById('shirt-canvas') as HTMLCanvasElement

  canvas.value = new Canvas(el, { selection: true })
  canvas.value.setDimensions({ width: 800, height: 800 })
  canvas.value.enablePointerEvents = true

  // Configure ActiveSelection controls (box-select / multi-select)
  ActiveSelection.ownDefaults.controls = {
    deleteIcon: new Control({
      x: 0.5,
      y: -0.5,
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
      cursorStyle: 'nwse-resize',
      render: createResizeControlRender(getResizeImage()),
      actionHandler: controlsUtils.scalingEqually,
    }),
  }
  ActiveSelection.ownDefaults.borderColor = 'blue'
  ActiveSelection.ownDefaults.borderScaleFactor = 1
  ActiveSelection.ownDefaults.borderDashArray = [5, 5]

  // Load background
  const bg = await FabricImage.fromURL('/images/custom-design/t-shirt-front.png')
  bg.scaleToWidth(800)
  bg.scaleToHeight(800)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: 400, top: 400 })
  canvas.value.backgroundImage = bg
  canvas.value.requestRenderAll()
})


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
      description="Skapa unika trikåprodukter med vårt designverktyg. Uppladera dina bilder, lägg till egen text och se resultatet innan produktion."
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
        <div class="designer flex gap-4 items-center justify-center">
          <canvas id="shirt-canvas" width="800" height="800" class="relative mx-auto border border-black rounded-card overflow-hidden"/>
          <div class="flex flex-col gap-3">
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
      </Section>
    </div>
  </div>
</template>
