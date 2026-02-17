// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { Canvas, FabricImage } from 'fabric'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
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

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const canvas = ref<Canvas | null>(null)

// ===== LIFECYCLE HOOKS =====
onMounted(() => {
  canvas.value = new Canvas('shirt-canvas')
  loadFabricBackgroundImage('/images/custom-design/t-shirt-front.png', 800, 800)
})

// ===== METHODS =====

async function loadFabricBackgroundImage(imagePath: string, width: number, height: number): Promise<void> {
  try {
    const img = await FabricImage.fromURL(imagePath)
    img.scaleToWidth(width)
    img.scaleToHeight(height)
    img.selectable = false
    canvas.value?.centerObject(img)
    canvas.value?.insertAt(0, img)
  } catch (error) {
    console.error('Failed to load image:', error)
  }
}

function uploadImage(): void {
  // Trigger file input dialog
  fileInputRef.value?.click()
}

function handleImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate that it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  // TODO: Implement actual upload logic
  console.log('Selected image:', file.name, file.type, file.size)
  alert(`Image selected: ${file.name}`)

  // Reset input so same file can be selected again
  input.value = ''
}

function addText(): void {
  // Placeholder for add text functionality
  alert('Add text functionality is not implemented yet.')
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
          <canvas id="shirt-canvas" width="800" height="800" class="relative mx-auto w-[800px] h-[800px] border border-black rounded-card overflow-hidden"/>
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

