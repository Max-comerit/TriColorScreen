<script setup lang="ts">
// 1. Imports
import { computed, onMounted, ref, watch } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { storeToRefs } from 'pinia'
import { useCanvasStore, type CanvasSide } from '@/stores/canvasStore'
import rawBackgroundOptions from '~/assets/json/custom-design/backgroundOptions.json'

interface Side {
  label: string
  src: string
}

interface Product {
  label: string
  activeSide: number
  aspectRatio: string
  sides: Side[]
}

interface ProductCategory {
  label: string
  activeProduct: number
  products: Product[]
}

interface ProductCategories {
  activeProductCategory: number
  productCategories: ProductCategory[]
}

const PRODUCT_CATEGORIES = (rawBackgroundOptions as ProductCategories).productCategories

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
  side: CanvasSide
}

const props = defineProps<Props>()
const emit = defineEmits<{
  sideChanged: [side: CanvasSide]
  canvasResized: [aspectRatio: string]
}>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()
const { front, back } = storeToRefs(canvasStore)

// 4. State
const CUSTOM_OPTION_ID = 'custom'

const customFileInputRef = ref<HTMLInputElement | null>(null)
const selectedCategoryIndex = ref(0)

const sideState = computed(() => (props.side === 'front' ? front.value : back.value))

// 5. Computed
/** Products of the currently selected category, with per-side src resolved */
const selectedCategoryProducts = computed(() => {
  const sideIndex = props.side === 'front' ? 0 : 1
  const cat = PRODUCT_CATEGORIES[selectedCategoryIndex.value]
  if (!cat) return []
  return cat.products.map(product => ({
    label: product.label,
    url: (product.sides[sideIndex] ?? product.sides[0]!).src,
  }))
})

const defaultUrl = computed(() => selectedCategoryProducts.value[0]?.url ?? '')

const selectedBackground = computed({
  get: () => sideState.value.backgroundSelection || defaultUrl.value,
  set: (url: string) => {
    if (url === CUSTOM_OPTION_ID) {
      selectCustomBackground()
      return
    }
    loadBackground(url)
  },
})

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

    resetStoredCanvases(url)
    syncProductSelection(url)
    emitCanvasResized(url)
  } catch (error) {
    console.error('Failed to load background image:', error)
  }
}

function findProductByUrl(url: string): Product | undefined {
  for (const cat of PRODUCT_CATEGORIES) {
    for (const product of cat.products) {
      if (product.sides.some(s => s.src === url)) return product
    }
  }
  return undefined
}

function emitCanvasResized(url: string): void {
  const product = findProductByUrl(url)
  if (product) emit('canvasResized', product.aspectRatio)
}

function onCategoryChange(index: number): void {
  selectedCategoryIndex.value = index
  const sideIndex = props.side === 'front' ? 0 : 1
  const firstProduct = PRODUCT_CATEGORIES[index]?.products[0]
  if (firstProduct) {
    const url = (firstProduct.sides[sideIndex] ?? firstProduct.sides[0]!).src
    selectedBackground.value = url
  }
}

function resetStoredCanvases(url: string): void {
  if (url === CUSTOM_OPTION_ID) return
  canvasStore.clear()
}

function syncProductSelection(url: string): void {
  if (url === CUSTOM_OPTION_ID) return

  const otherSide = getOtherSide(props.side)
  const mappedUrl = mapBackgroundUrlToSide(url, otherSide)

  canvasStore.setBackgroundSelection(props.side, url)
  canvasStore.setCustomBackgroundDataUrl(props.side, null)
  canvasStore.setBackgroundSelection(otherSide, mappedUrl)
  canvasStore.setCustomBackgroundDataUrl(otherSide, null)
}

function clearBackground(): void {
  const canvasInstance = props.canvas
  if (!canvasInstance) return
  canvasInstance.backgroundImage = undefined
  canvasInstance.requestRenderAll()
}

function selectCustomBackground(): void {
  const storedDataUrl = sideState.value.customBackgroundDataUrl
  canvasStore.setBackgroundSelection(props.side, CUSTOM_OPTION_ID)
  canvasStore.setBackgroundSelection(getOtherSide(props.side), CUSTOM_OPTION_ID)

  if (storedDataUrl) {
    applyCustomBackground(storedDataUrl)
    return
  }

  clearBackground()
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

    canvasStore.setBackgroundSelection(props.side, CUSTOM_OPTION_ID)
    canvasStore.setCustomBackgroundDataUrl(props.side, dataUrl)
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

function syncCategoryIndexToUrl(url: string): void {
  for (let i = 0; i < PRODUCT_CATEGORIES.length; i++) {
    const cat = PRODUCT_CATEGORIES[i]!
    if (cat.products.some(p => p.sides.some(s => s.src === url))) {
      selectedCategoryIndex.value = i
      return
    }
  }
}

function hydrateFromStore(): void {
  const selection = sideState.value.backgroundSelection
  if (selection === CUSTOM_OPTION_ID) {
    if (sideState.value.customBackgroundDataUrl) {
      applyCustomBackground(sideState.value.customBackgroundDataUrl)
    } else {
      clearBackground()
    }
    return
  }

  if (selection) {
    syncCategoryIndexToUrl(selection)
    if (selection !== selectedBackground.value) {
      loadBackground(selection)
    }
  }
}

function getOtherSide(side: CanvasSide): CanvasSide {
  return side === 'front' ? 'back' : 'front'
}

function mapBackgroundUrlToSide(url: string, side: CanvasSide): string {
  const sideIndex = side === 'front' ? 0 : 1
  for (const cat of PRODUCT_CATEGORIES) {
    for (const product of cat.products) {
      if (product.sides.some(s => s.src === url)) {
        return (product.sides[sideIndex] ?? product.sides[0]!).src
      }
    }
  }
  return url
}

// 7. Lifecycle hooks
onMounted(() => {
  hydrateFromStore()
})

// 8. Watchers
watch(
  () => [props.side, props.canvas],
  () => {
    hydrateFromStore()
  },
)
</script>

<template>
  <div class="w-full max-w-xl mx-auto my-4 px-4 justify-center flex">
    <div class="flex items-stretch sm:items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg shadow-md justify-center flex-wrap">
      <label class="flex items-center gap-3">
        <select
          :value="selectedCategoryIndex"
          class="h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select product category"
          @change="onCategoryChange(Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="(cat, i) in PRODUCT_CATEGORIES"
            :key="cat.label"
            :value="i"
          >
            {{ cat.label }}
          </option>
        </select>
      </label>
      <label class="flex items-center gap-3">
        <select
          v-model="selectedBackground"
          class="h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select product"
        >
          <option
            v-for="product in selectedCategoryProducts"
            :key="product.url"
            :value="product.url"
          >
            {{ product.label }}
          </option>
          <option :value="CUSTOM_OPTION_ID">Egen Produkt</option>
        </select>
      </label>
      <label class="flex  sm:w-auto items-center gap-3">
        <select
          :value="props.side"
          class="h-11 px-3 py-2 border w-full border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select side"
          @change="emit('sideChanged', ($event.target as HTMLSelectElement).value as CanvasSide)"
        >
          <option value="front">Fram</option>
          <option value="back">Bak</option>
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
