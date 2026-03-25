// components/features/CanvasPanel.vue

<script setup lang="ts">
// 1. Imports
import type { Canvas } from 'fabric'
import { ref } from 'vue'
import { useCanvasStore } from '~/stores/canvasStore'
import CanvasPanel from '~/components/features/CanvasPanel.vue'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import BackgroundSelector from '~/components/features/BackgroundSelector.vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
import IconButton from '~/components/common/IconButton.vue'
import IconTextButton from '~/components/common/IconTextButton.vue'

// Dynamically import fonts to avoid blocking the main thread
if (import.meta.client) {
  import('~/assets/css/custom-design-fonts.css')
}

// 2. Props & Emits
// (none)

// 3. Composables & Stores

// 4. State (ref/reactive)
const canvasStore = useCanvasStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const image = ref<File | undefined>()
const textCnt = ref<number>(0) // Incrementing number to trigger reactivity in CanvasCore when adding text
const activeCanvas = ref<Canvas | null>(null)

// 5. Computed
// (none)

// 6. Methods

/**
 * Trigger the hidden file input to open the file dialog for image selection.
 */
function uploadImage(): void {
  fileInputRef.value?.click()
}

/**
 * Handle image file selection, validate it's an image, and store it in state
 * for CanvasCore to consume and add to the canvas.
 * Resets the file input value to allow selecting the same file again if needed.
 */
async function handleImageSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  image.value = file
  input.value = ''
}

function addText(): void {
  textCnt.value++
}

function handleChangedCanvasMap(newCanvasMap: (Canvas | undefined)[]): void {
  canvasStore.setCanvasMap(newCanvasMap)
}

function handleChangedActiveCanvas(canvas: Canvas | null): void {
  activeCanvas.value = canvas
}

// 7. Lifecycle hooks
// (none)

// 8. Watchers
// (none)
</script>

<template>
  <div>
    <!-- Hidden file input for image selection -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      @change="handleImageSelected"
    >

    <BackgroundSelector />
    <div class="designer grid grid-cols-1 sm:grid-cols-[1fr_minmax(350px,800px)_1fr] gap-4 items-start">
      <!-- Placeholder element to center canvas horizontally (must have same width as IconButton elements) -->
      <div class="hidden sm:block md:w-[48px]" />
      <CanvasPanel
        :image="image"
        :text-cnt="textCnt"
        @changed:canvas-map="handleChangedCanvasMap"
        @changed:active-canvas="handleChangedActiveCanvas"
      />
      <div class="flex flex-row sm:flex-col justify-center gap-3">
        <div class="xl:hidden">
          <IconButton
            aria-label="Upload image design"
            variant="primary"
            size="fit"
            class="w-fit"
            @click="uploadImage()"
          >
            <template #icon>
              <ImageIcon class="!w-6 !h-6" />
            </template>
          </IconButton>
        </div>
        <div class="hidden xl:inline">
          <IconTextButton
            aria-label="Upload image design"
            variant="primary"
            size="fit"
            class="w-fit hidden xl:flex"
            label="Lägg till bild"
            background-color="bg-primary-700"
            color="white"
            @click="uploadImage()"
          >
            <template #icon>
              <ImageIcon class="!w-6 !h-6" />
            </template>
          </IconTextButton>
        </div>
        <div class="xl:hidden">
          <IconButton
            aria-label="Add text design"
            variant="primary"
            size="fit"
            class="w-fit"
            @click="addText()"
          >
            <template #icon>
              <TextIcon class="!w-6 !h-6" />
            </template>
          </IconButton>
        </div>
        <div class="hidden xl:inline">
          <IconTextButton
            aria-label="Add text design"
            variant="primary"
            size="fit"
            class="w-fit"
            label="Lägg till text"
            background-color="bg-primary-700"
            color="white"
            @click="addText()"
          >
            <template #icon>
              <TextIcon class="!w-6 !h-6" />
            </template>
          </IconTextButton>
        </div>
      </div>
    </div>
    <TextboxControls :canvas="activeCanvas as any" />
  </div>
</template>
