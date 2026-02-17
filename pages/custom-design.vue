// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import { ref } from 'vue'

// ===== COMPOSABLES =====
useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
  ],
})

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)

// ===== METHODS =====

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
      title="Tricolor Screen"
      description="Vi hjälper dig med allt inom reklam / profiltryck, brodyr / textiltryck / bildekor / bilfoliering"
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
        <div class="flex gap-4 items-center justify-center">
          <article class="border border-black rounded-card overflow-hidden">
            <img src="/images/custom-design/t-shirt-front.jpg" alt="Designverktyg för att skapa anpassade tryck och brodyrmönster" width="800" height="800">
          </article>

          <div class="flex flex-col gap-3">
            <IconButton
              icon-src="/images/custom-design/image-icon.svg"
              icon-alt="Image"
              aria-label="Upload image design"
              variant="primary"
              size="fit"
              @click="uploadImage()"
            />
            <IconButton
              icon-src="/images/custom-design/text-icon.svg"
              icon-alt="Text"
              aria-label="Add text design"
              variant="primary"
              size="fit"
              @click="addText()"

            />
          </div>
        </div>
        
      </Section>
    </div>
  </div>
</template>

