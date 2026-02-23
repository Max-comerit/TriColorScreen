<script setup lang="ts">
// 1. Imports
import { computed, onMounted, ref } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'

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
const canvasStore = useCanvasStore()
const { backgroundSelection, customBackgroundDataUrl } = storeToRefs(canvasStore)

// 4. State
const CUSTOM_OPTION_ID = 'custom'

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
  {
    id: CUSTOM_OPTION_ID,
    label: 'Custom',
    url: CUSTOM_OPTION_ID,
  },
]

const customFileInputRef = ref<HTMLInputElement | null>(null)

const selectedBackground = computed({
  get: () => props.currentBackgroundUrl || backgroundSelection.value || backgrounds[0].url,
  set: (url: string) => {
    if (url === CUSTOM_OPTION_ID) {
      selectCustomBackground()
      return
    }
    loadBackground(url)
  },
})

// 5. Computed
const isCustomSelected = computed(() => selectedBackground.value === CUSTOM_OPTION_ID)

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

    canvasStore.setBackgroundSelection(url)

    emit('backgroundChanged', url)
  } catch (error) {
    console.error('Failed to load background image:', error)
  }
}

function clearBackground(): void {
  const canvasInstance = props.canvas
  if (!canvasInstance) return
  canvasInstance.backgroundImage = undefined
  canvasInstance.requestRenderAll()
}

function selectCustomBackground(): void {
  const storedDataUrl = customBackgroundDataUrl.value
  canvasStore.setBackgroundSelection(CUSTOM_OPTION_ID)

  if (storedDataUrl) {
    applyCustomBackground(storedDataUrl)
    return
  }

  clearBackground()
  emit('backgroundChanged', CUSTOM_OPTION_ID)
}

function openCustomFileDialog(): void {
  customFileInputRef.value?.click()
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function applyCustomBackground(dataUrl: string): Promise<void> {
  if (!props.canvas) return

  try {
    const bg = await FabricImage.fromURL(dataUrl)
    const size = props.canvas.getWidth()

    bg.scaleToWidth(size)
    bg.scaleToHeight(size)
    bg.selectable = false
    bg.evented = false
    bg.set({ originX: 'center', originY: 'center', left: size / 2, top: size / 2 })

    const canvasInstance = props.canvas
    canvasInstance.backgroundImage = bg
    canvasInstance.requestRenderAll()

    canvasStore.setBackgroundSelection(CUSTOM_OPTION_ID)
    canvasStore.setCustomBackgroundDataUrl(dataUrl)

    emit('backgroundChanged', dataUrl)
  } catch (error) {
    console.error('Failed to load custom background image:', error)
  }
}

async function handleCustomFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    await applyCustomBackground(dataUrl)
  } catch (error) {
    console.error('Failed to read custom background image:', error)
  }

  input.value = ''
}

// 7. Lifecycle hooks
onMounted(() => {
  const selection = backgroundSelection.value
  if (selection === CUSTOM_OPTION_ID) {
    if (customBackgroundDataUrl.value) {
      applyCustomBackground(customBackgroundDataUrl.value)
    } else {
      clearBackground()
    }
    return
  }

  if (selection && selection !== selectedBackground.value) {
    loadBackground(selection)
  }
})

// 8. Watchers
// (none)
</script>

<template>
  <div class="w-full max-w-xl mx-auto my-4 px-4">
    <div class="flex flex-col max-w-sm sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 p-3 sm:p-3 bg-white border border-gray-300 rounded-lg shadow-md">
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
      <button
        v-if="isCustomSelected"
        class="inline-flex items-center justify-center h-11 px-4 text-sm font-semibold rounded-button bg-primary-600 text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        type="button"
        @click="openCustomFileDialog"
      >
        Ladda Upp Egen Bild
      </button>
      <input
        ref="customFileInputRef"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        class="hidden"
        @change="handleCustomFileSelected"
      >
    </div>
  </div>
</template>
