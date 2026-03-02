// components/features/BackgroundSelector.vue

<script setup lang="ts">
// 1. Imports
import { computed, ref } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'


const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories
const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_OBJ.productCategories

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
  side?: number
}

const props = withDefaults(defineProps<Props>(), {
  side: 0,
})

const emit = defineEmits<{
  sideChanged: [side: number]
  canvasResized: [aspectRatio: string]
}>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()
const { sides, activeCategory, activeProduct, activeSide } = storeToRefs(canvasStore)

// 4. State
const CUSTOM_OPTION_ID = 'custom'

const CUSTOM_SIDES: { label: string; value: number }[] = [
  { label: 'Fram', value: 0 },
  { label: 'Bak', value: 1 },
  { label: 'Vänster', value: 2 },
  { label: 'Höger', value: 3 },
  { label: 'Över', value: 4 },
  { label: 'Under', value: 5 },
]

const customFileInputRef = ref<HTMLInputElement | null>(null)

const sideState = computed(() => sides.value[props.side] ?? { json: null, size: 0, backgroundSelection: null, customBackgroundDataUrl: null })

// 5. Computed

const defaultUrl = computed(() => PRODUCT_CATEGORIES[activeCategory.value]?.products[activeProduct.value]?.sides[activeSide.value]?.src ?? '')

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

const activeSideOptions = computed<{ label: string }[]>(() =>
  isCustomSelected.value
    ? CUSTOM_SIDES
    : PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[canvasStore.activeProduct]?.sides ?? []
)


// 6. Methods
function emitCanvasResized(width: number, height: number): void {
  if (width > 0 && height > 0) {
    emit('canvasResized', `${width} / ${height}`)
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
        canvasStore.setSideCount(product.sides.length)
        product.sides.forEach((side, i) => {
          canvasStore.setBackgroundSelection(i, side.src)
          canvasStore.setCustomBackgroundDataUrl(i, null)
        })
        return
      }
    }
  }
}

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
    clearBackground()
  }
}

function clearBackground(): void {
  const canvasInstance = props.canvas
  if (!canvasInstance) return
  canvasInstance.backgroundImage = undefined
  canvasInstance.requestRenderAll()
}

function updateBackground(url: string | null | undefined): void {
  if(url) {
    loadBackground(url)
  } else {
    clearBackground()
  }
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

function selectCustomBackground(): void {
  const storedDataUrl = sideState.value.customBackgroundDataUrl
  canvasStore.setSideCount(CUSTOM_SIDES.length)
  CUSTOM_SIDES.forEach((_, key) => canvasStore.setBackgroundSelection(key, CUSTOM_OPTION_ID))

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

function initProductCategories() {
  canvasStore.setProductCategoryTree(PRODUCT_CATEGORIES_OBJ)
  updateBackground(PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[canvasStore.activeProduct]?.sides[canvasStore.activeSide]?.src)
  emit('sideChanged', canvasStore.activeSide)
}

function onCategoryChange(index: number): void {
  canvasStore.setActiveCategory(index)
  canvasStore.setActiveProduct(0)
  canvasStore.setActiveSide(0)
  updateBackground(PRODUCT_CATEGORIES[index]?.products[0]?.sides[0]?.src)
  emit('sideChanged', 0)
}

function onProductChange(index: number, dataKey: string | null): void {
  canvasStore.setActiveProduct(index)
  canvasStore.setActiveSide(0)
  if (dataKey === CUSTOM_OPTION_ID) {
    selectCustomBackground()
  } 
  else {
    updateBackground(PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[index]?.sides[0]?.src)
  }
  emit('sideChanged', 0)
}

function onSideChange(index: number): void {
  canvasStore.setActiveSide(index)
  if (!isCustomSelected.value) {
    updateBackground(PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[canvasStore.activeProduct]?.sides[index]?.src)
  }
  emit('sideChanged', index)
}

// 7. Lifecycle hooks
onMounted(() => {
  initProductCategories()
})


</script>

<template>
  <div class="w-full max-w-xl mx-auto my-4 px-4 justify-center flex">
    <div class="flex items-stretch sm:items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg shadow-md justify-center flex-wrap">
      <label class="flex items-center gap-3">
        <select
          :value="canvasStore.activeCategory"
          class="h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select product category"
          @change="onCategoryChange(Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="(category, i) in PRODUCT_CATEGORIES"
            :key="category.label"
            :value="i"
          >
            {{ category.label }}
          </option>
        </select>
      </label>
      <label class="flex items-center gap-3">
        <select
          :value="canvasStore.activeProduct"
          class="h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select product"
          @change="onProductChange(
            $event.target ? Number(($event.target as HTMLSelectElement).value) : 0,
            $event.target ? ($event.target as HTMLSelectElement).options[($event.target as HTMLSelectElement).selectedIndex]?.getAttribute('data-key') : null
          )"
        >
          <option
            v-for="(product, i) in PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products || []"
            :key="product.label"
            :value="i"
            :data-key="product.label"
          >
            {{ product.label }}
          </option>
          <option 
            :key="CUSTOM_OPTION_ID"
            :value="PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products.length || 0"
            :data-key="CUSTOM_OPTION_ID"
          >
            Egen Produkt
          </option>
        </select>
      </label>
      <label class="flex  sm:w-auto items-center gap-3">
        <select
          :value="canvasStore.activeSide"
          class="h-11 px-3 py-2 border w-full border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select side"
          @change="onSideChange(Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="(sideOption, i) in activeSideOptions"
            :key="sideOption.label"
            :value="i"
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
