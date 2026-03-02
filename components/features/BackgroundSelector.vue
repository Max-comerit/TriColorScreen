// components/features/BackgroundSelector.vue

<script setup lang="ts">
// 1. Imports
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { CUSTOM_BACKGROUND_ID, CUSTOM_SIDES } from '~/composables/useCustomBackground'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'

const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories
const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_OBJ.productCategories

// 2. Props & Emits
const emit = defineEmits<{
  sideChanged: [side: number]
  categoryChanged: [index: number]
  productChanged: [index: number, dataKey: string | null]
  customImageSelected: [dataUrl: string]
}>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()
const { activeCategory, activeProduct, activeSide, sides } = storeToRefs(canvasStore)

// 4. State
const customFileInputRef = ref<HTMLInputElement | null>(null)

// 5. Computed
const isCustomSelected = computed(() =>
  sides.value[activeSide.value]?.backgroundSelection === CUSTOM_BACKGROUND_ID,
)

const activeSideOptions = computed<{ label: string }[]>(() =>
  isCustomSelected.value
    ? CUSTOM_SIDES
    : PRODUCT_CATEGORIES[activeCategory.value]?.products[activeProduct.value]?.sides ?? [],
)

// 6. Methods
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
    emit('customImageSelected', dataUrl)
  }
  catch (error) {
    console.error('Failed to read custom background image:', error)
  }

  input.value = ''
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto my-4 px-4 justify-center flex">
    <div class="flex items-stretch sm:items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg shadow-md justify-center flex-wrap">
      <label class="flex items-center gap-3">
        <select
          :value="canvasStore.activeCategory"
          class="h-11 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select product category"
          @change="emit('categoryChanged', Number(($event.target as HTMLSelectElement).value))"
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
          @change="emit('productChanged',
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
            :value="PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products.length || 0"
            :data-key="CUSTOM_BACKGROUND_ID"
          >
            Egen Produkt
          </option>
        </select>
      </label>
      <label class="flex sm:w-auto items-center gap-3">
        <select
          :value="canvasStore.activeSide"
          class="h-11 px-3 py-2 border w-full border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select side"
          @change="emit('sideChanged', Number(($event.target as HTMLSelectElement).value))"
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
