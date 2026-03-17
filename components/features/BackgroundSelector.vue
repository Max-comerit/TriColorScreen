// components/features/BackgroundSelector.vue

<script setup lang="ts">
// 1. Imports
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { CUSTOM_BACKGROUND_ID } from '~/composables/useCustomBackground'
import { useBackgroundSelector } from '~/composables/useBackgroundSelector'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'
import BaseDropdown from '~/components/base/BaseDropdown.vue'
import type { DropdownOption } from '~/components/base/BaseDropdown.vue'

const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories
const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_OBJ.productCategories

// 2. Props & Emits
const emit = defineEmits<{
  customImageSelected: [dataUrl: string]
}>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()
const { activeCategory, activeProduct, activeSide, sides } = storeToRefs(canvasStore)

const { initProductCategories, onCategoryChange, onProductChange, onSideChange } = useBackgroundSelector()

// 4. State
const customFileInputRef = ref<HTMLInputElement | null>(null)
const fileErrorMessage = ref('')

// 5. Computed
const isCustomSelected = computed(() =>
  sides.value[activeSide.value]?.backgroundSelection === CUSTOM_BACKGROUND_ID,
)

const categoryOptions = computed<DropdownOption[]>(() =>
  PRODUCT_CATEGORIES.map((cat, i) => ({ label: cat.label, value: i }))
)

const productOptions = computed<DropdownOption[]>(() =>
  (PRODUCT_CATEGORIES[activeCategory.value]?.products ?? []).map((p, i) => ({
    label: p.label,
    value: i,
    dataKey: p.label === 'Egen Produkt' ? CUSTOM_BACKGROUND_ID : p.label,
  }))
)

const sideOptions = computed<DropdownOption[]>(() =>
  (PRODUCT_CATEGORIES[activeCategory.value]?.products[activeProduct.value]?.sides ?? []).map((s, i) => ({
    label: s.label,
    value: i,
  }))
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

  if (!file) {
    fileErrorMessage.value = ''
    return
  }
  if (!file.type.startsWith('image/')) {
    fileErrorMessage.value = 'Välj en giltig bildfil (PNG, JPEG, JFIF, PJP, JPE, PJPEG, WEBP, GIF, SVG eller SVGZ).'
    input.value = ''
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    emit('customImageSelected', dataUrl)
    fileErrorMessage.value = ''
  }
  catch (error) {
    fileErrorMessage.value = 'Kunde inte läsa in bilden. Försök igen.'
    console.error('Failed to read custom background image:', error)
  }

  input.value = ''
}

// 7. Lifecycle hooks
onMounted(() => {
  initProductCategories()
})
</script>

<template>
  <div class="w-full max-w-xl mx-auto my-4 px-4 justify-center flex">
    <div class="flex items-stretch sm:items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg justify-center flex-wrap">
        <BaseDropdown
          :options="categoryOptions"
          :model-value="activeCategory"
          label="Välj produktkategori"
          @change="(val) => onCategoryChange(Number(val))"
        />
        <BaseDropdown
          :options="productOptions"
          :model-value="activeProduct"
          label="Välj produkt"
          @change="(val, dataKey) => onProductChange(Number(val), dataKey)"
        />
        <BaseDropdown
          :options="sideOptions"
          :model-value="activeSide"
          label="Välj sida"
          @change="(val) => onSideChange(Number(val))"
        />

      <button
        v-if="isCustomSelected"
        class="inline-flex items-center justify-center h-11 px-4 text-sm font-semibold bg-primary-600 text-white shadow-sm transition hover:bg-primary-700 outline-visible-spaced-button"
        type="button"
        aria-label="Ladda upp egen bild för produkten"
        :aria-describedby="fileErrorMessage ? 'custom-file-error' : undefined"
        :aria-invalid="Boolean(fileErrorMessage)"
        @click="openCustomFileDialog"
      >
        Ladda Upp Egen Bild
      </button>
        <input
          ref="customFileInputRef"
          aria-hidden="true"
          tabindex="-1"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          class="hidden"
          @change="handleCustomFileSelected"
        >
        <p
          v-if="fileErrorMessage"
          id="custom-file-error"
          class="w-full text-sm text-error"
          role="status"
          aria-live="polite"
        >
          {{ fileErrorMessage }}
        </p>
    </div>
  </div>
</template>
