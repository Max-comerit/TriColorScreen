<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
  currentBackgroundUrl?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  backgroundChanged: [url: string]
}>()

// 3. Composables & Stores
// (none)

// 4. State
const backgrounds = [
  {
    id: 'tshirt',
    label: 'T-Shirt',
    url: '/images/custom-design/t-shirt-front.png',
  },
  {
    id: 'baseball-cap',
    label: 'Baseball Keps',
    url: '/images/custom-design/baseball-cap-front.png',
  },
    {
    id: 'jacket',
    label: 'Jacka',
    url: '/images/custom-design/jacket-front.png',
  },
]

const selectedBackground = computed({
  get: () => props.currentBackgroundUrl || backgrounds[0].url,
  set: (url: string) => {
    loadBackground(url)
  },
})

// 5. Computed
// (none)

// 6. Methods
async function loadBackground(url: string): Promise<void> {
  if (!props.canvas) return

  try {
    const bg = await FabricImage.fromURL(url)
    const size = props.canvas.getWidth()

    bg.scaleToWidth(size)
    bg.scaleToHeight(size)
    bg.selectable = false
    bg.evented = false
    bg.set({ originX: 'center', originY: 'center', left: size / 2, top: size / 2 })

    const canvasInstance = props.canvas
    canvasInstance.backgroundImage = bg
    canvasInstance.requestRenderAll()

    emit('backgroundChanged', url)
  } catch (error) {
    console.error('Failed to load background image:', error)
  }
}

// 7. Lifecycle hooks
// (none)

// 8. Watchers
// (none)
</script>

<template>
  <div class="w-full max-w-2xl mx-auto my-4 px-4">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 p-3 sm:p-3 bg-white border border-gray-300 rounded-lg shadow-md">
      <label class="flex items-center gap-3 flex-1">
        <select
          v-model="selectedBackground"
          class="flex-1 h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select canvas background"
        >
          <option
            v-for="bg in backgrounds"
            :key="bg.id"
            :value="bg.url"
          >
            {{ bg.label }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>
