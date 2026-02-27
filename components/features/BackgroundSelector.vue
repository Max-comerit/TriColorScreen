<script setup lang="ts">
// 1. Imports
import { computed, onMounted, ref, watch } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { Product, ProductCategories } from '~/types/BackgroundSelector'



const PRODUCT_CATEGORIES = (rawBackgroundOptions as ProductCategories).productCategories

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
  side: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  sideChanged: [side: string]
  canvasResized: [aspectRatio: string]
}>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()
const { sides, sideKeys } = storeToRefs(canvasStore)

// 4. State
const CUSTOM_OPTION_ID = 'custom'

const customFileInputRef = ref<HTMLInputElement | null>(null)
const selectedCategoryIndex = ref(0)

const sideState = computed(() => sides.value[props.side] ?? { json: null, size: 0, backgroundSelection: null, customBackgroundDataUrl: null })

// 5. Computed
/** Products of the currently selected category, with per-side src resolved */
const selectedCategoryProducts = computed(() => {
  const sideIndex = Number(props.side)
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

/** The product that owns the currently selected background URL */
const selectedProduct = computed((): Product | null => {
  const url = selectedBackground.value
  for (const cat of PRODUCT_CATEGORIES) {
    for (const product of cat.products) {
      if (product.sides.some(s => s.src === url)) return product
    }
  }
  // Fall back to first product of selected category (e.g. when custom is selected)
  return PRODUCT_CATEGORIES[selectedCategoryIndex.value]?.products[0] ?? null
})

/** Side options derived from the selected product's sides array */
const availableSides = computed((): { label: string; value: string }[] => {
  const productSides = selectedProduct.value?.sides
  if (!productSides?.length) return [{ label: 'Fram', value: '0' }, { label: 'Bak', value: '1' }]
  return productSides.map((side, i) => ({
    label: side.label,
    value: String(i),
  }))
})

// 6. Methods
async function loadBackground(url: string): Promise<void> {
  if (!props.canvas) return

  try {
    const bg = await FabricImage.fromURL(url)
    const canvasWidth = props.canvas.getWidth()
    const canvasHeight = props.canvas.getHeight()

    bg.scaleToWidth(canvasWidth)
    bg.scaleToHeight(canvasHeight)
    bg.selectable = false
    bg.evented = false
    bg.set({ originX: 'center', originY: 'center', left: canvasWidth / 2, top: canvasHeight / 2 })

    const canvasInstance = props.canvas
    canvasInstance.backgroundImage = bg
    canvasInstance.requestRenderAll()

    resetStoredCanvases(url)
    syncProductSelection(url)
    emitCanvasResized(bg.width, bg.height)
  } catch (error) {
    console.error('Failed to load background image:', error)
  }
}

function emitCanvasResized(width: number, height: number): void {
  if (width > 0 && height > 0) {
    emit('canvasResized', `${width} / ${height}`)
  }
}

function onCategoryChange(index: number): void {
  selectedCategoryIndex.value = index
  const sideIndex = Number(props.side)
  const cat = PRODUCT_CATEGORIES[index]
  const firstProduct = cat?.products[0]
  if (firstProduct) {
    canvasStore.setActiveCategory(cat!.label)
    canvasStore.setActiveProduct(firstProduct.label)
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

  for (const cat of PRODUCT_CATEGORIES) {
    for (const product of cat.products) {
      if (product.sides.some(s => s.src === url)) {
        const keys = product.sides.map((_, i) => String(i))
        canvasStore.setSideKeys(keys)
        canvasStore.setActiveCategory(cat.label)
        canvasStore.setActiveProduct(product.label)
        product.sides.forEach((side, i) => {
          canvasStore.setBackgroundSelection(String(i), side.src)
          canvasStore.setCustomBackgroundDataUrl(String(i), null)
        })
        return
      }
    }
  }
}

function clearBackground(): void {
  const canvasInstance = props.canvas
  if (!canvasInstance) return
  canvasInstance.backgroundImage = undefined
  canvasInstance.requestRenderAll()
}

function selectCustomBackground(): void {
  const storedDataUrl = sideState.value.customBackgroundDataUrl
  sideKeys.value.forEach(key => canvasStore.setBackgroundSelection(key, CUSTOM_OPTION_ID))

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
    const canvasWidth = props.canvas.getWidth()
    const canvasHeight = props.canvas.getHeight()

    bg.scaleToWidth(canvasWidth)
    bg.scaleToHeight(canvasHeight)
    bg.selectable = false
    bg.evented = false
    bg.set({ originX: 'center', originY: 'center', left: canvasWidth / 2, top: canvasHeight / 2 })

    const canvasInstance = props.canvas
    canvasInstance.backgroundImage = bg
    canvasInstance.requestRenderAll()

    canvasStore.setBackgroundSelection(props.side, CUSTOM_OPTION_ID)
    canvasStore.setCustomBackgroundDataUrl(props.side, dataUrl)
    emitCanvasResized(bg.width, bg.height)
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
  // Restore category index from stored label (reliable) or fall back to URL matching
  if (canvasStore.activeCategory) {
    const idx = PRODUCT_CATEGORIES.findIndex(c => c.label === canvasStore.activeCategory)
    if (idx >= 0) selectedCategoryIndex.value = idx
  }

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
    if (!canvasStore.activeCategory) syncCategoryIndexToUrl(selection)
    if (selection !== selectedBackground.value) {
      loadBackground(selection)
    }
  }
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
          @change="emit('sideChanged', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="sideOption in availableSides"
            :key="sideOption.value"
            :value="sideOption.value"
          >
            {{ sideOption.label }}
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
