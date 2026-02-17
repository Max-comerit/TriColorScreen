// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { Canvas, FabricImage } from 'fabric'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import { useCustomImage } from '~/composables/useCustomImage'
import { ref, onMounted } from 'vue'

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

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
let canvas: Canvas | null = null

// ===== LIFECYCLE HOOKS =====W
onMounted(async () => {
  await nextTick()
  const el = document.getElementById('shirt-canvas') as HTMLCanvasElement

  canvas = new Canvas(el, { selection: true })
  canvas.setDimensions({ width: 800, height: 800 })
  canvas.enablePointerEvents = true

  // Load background
  const bg = await FabricImage.fromURL('/images/custom-design/t-shirt-front.png')
  bg.scaleToWidth(800)
  bg.scaleToHeight(800)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: 400, top: 400 })
  canvas.backgroundImage = bg
  canvas.requestRenderAll()
})


function uploadImage(): void {
  // Trigger file input dialog
  fileInputRef.value?.click()
}

async function handleImageSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file || !canvas) return

  // Validate that it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  try {
    await addImageToCanvas(canvas as Canvas, file)
  } catch (error) {
    alert('Failed to add image. Please try again.')
    console.error('Error adding image:', error)
  }

  // Reset input so same file can be selected again
  input.value = ''
}

</script>

<template>
  <div>
    <!-- Hidden file input for image selection -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageSelected"
    >

    <!-- Hero: full width -->
    <HeroImage 
      src="/images/custom-design/hero.jpg"
      title="Designa produkter med eget tryck"
      description="Skapa unika trikåprodukter med vårt designverktyg. Uppladera dina bilder, lägg till egen text och se resultatet innan produktion. Vi erbjuder professionell tillverkning av tryckt textiltryck och brodyr på t-shirts, kepsar, arbetskläder och andra trikåprodukter."
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
        
      </Section>
    </div>
  </div>
</template>

