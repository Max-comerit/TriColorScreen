// components/features/QuoteForm.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { computed, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import type { Canvas } from 'fabric'
import type { QuoteFormData } from '~/composables/useQuoteForm'
import { useQuoteForm, MAX_IMAGE_COUNT } from '~/composables/useQuoteForm'
import TextButton from '~/components/common/TextButton.vue'
import GdprDialog from '~/components/features/GdprDialog.vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { useCanvasExport } from '~/composables/useCanvasExport'
import { TAP_ANIMATION_TIME } from '~/constants/ui'

// ===== PROPS =====
interface Props {
  canvasMap?: (Canvas | undefined)[]
}

const props = withDefaults(defineProps<Props>(), {
  canvasMap: () => [],
})

// ===== EMITS =====
const emit = defineEmits<{
  (e: 'changed', value: boolean): void
  (e: 'success'): void
}>()

// ===== COMPOSABLES & STORES =====
const canvasStore = useCanvasStore()
const { productCategoryTree, activeCategory, activeProduct } = storeToRefs(canvasStore)
const { exportMergedImage, exportImageObjects } = useCanvasExport()
const {
  formData,
  isChanged,
  isSubmitting,
  isSuccess,
  isError,
  hasErrors,
  validateField,
  getFieldError,
  clearFieldError,
  submitForm,
  resetForm,
} = useQuoteForm()

// ===== STATE =====
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const showGdprDialog = ref(false)
const fileInputRefs = ref<HTMLInputElement[]>([])
const collectedImages = ref(false)

// ===== COMPUTED =====
const activeCategoryLabel = computed(
  () => productCategoryTree.value?.productCategories[activeCategory.value]?.label ?? ''
)
const activeProductLabel = computed(
  () => productCategoryTree.value?.productCategories[activeCategory.value]?.products[activeProduct.value]?.label ?? ''
)

const activeSideLabels = computed(
  () => productCategoryTree.value?.productCategories[activeCategory.value]?.products[activeProduct.value]?.sides ?? []
)

// ===== METHODS =====
/**
 * Handle input blur event and validate field
 */
function handleBlur(field: keyof QuoteFormData): void {
  if (formData.value[field]) {
    validateField(field)
  }
}

/**
 * Handle input change and clear error
 */
function handleInput(field: keyof QuoteFormData): void {
  clearFieldError(field)
}

/**
 * Open GDPR information dialog
 */
function openGdprDialog(): void {
  showGdprDialog.value = true
}

/**
 * Handle in-focus event to collect current canvas images before submission
 */
async function handleFocusIn(): Promise<void> {
  if(!collectedImages.value) {
    collectedImages.value = true
    // Collect current canvas images and populate formData before user submits
    formData.value.images = await collectQuoteFiles()
    // Sync each image to its corresponding hidden file input for Netlify submission
    formData.value.images?.forEach((file, index) => {
      const ref = fileInputRefs.value[index]
      if (ref) {
        const dt = new DataTransfer()
        if (file) dt.items.add(file)
        ref.files = dt.files
      }
    })
  }
}

/**
 * Handle focus out event to clear collected images and file inputs
 */
async function handleFocusOut(event: FocusEvent): Promise<void> {
  const form = event.currentTarget as HTMLElement
  const next = event.relatedTarget as HTMLElement | null
  if (!next || !form.contains(next)) {
    // Focus left the whole form
    collectedImages.value = false
    // Clear collected images when user leaves the form to avoid stale data
    // formData.value.images = []
    // fileInputRefs.value.forEach(ref => {
    //   const dt = new DataTransfer()
    //   ref.files = dt.files
    // })
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(): Promise<void> {
  // Delay validation TAP_ANIMATION_TIME ms to allow tap animation to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))
  
  const success = await submitForm()

  if (success) {
    showSuccessMessage.value = true
    showErrorMessage.value = false
    emit('success')

    // Clear canvases immediately as it takes some time to clear the canvas object
    canvasStore.clear()

    // Auto-hide success message after 5 seconds then reset user-editable fields
    setTimeout(() => {
      showSuccessMessage.value = false
      resetForm()
    }, 5000)
  }
  else {
    showErrorMessage.value = true
    showSuccessMessage.value = false

    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      showErrorMessage.value = false
    }, 5000)
  }
}

/**
 * Convert a data URL to a File object.
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

/**
 * Compress a data URL to JPEG at the given quality (0-1).
 * Reduces file size significantly compared to the raw PNG canvas export.
 */
async function compressDataUrl(dataUrl: string, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

/**
 * Export both canvas sides as File objects and populate files.
 * Includes a merged composite image and all individual image-layer files.
 * Limits total images to MAX_IMAGE_COUNT to prevent excessive payloads.
 */
async function collectQuoteFiles(): Promise<File[]> {
  const availableCanvases = props.canvasMap
    .map((canvas, index) => ({ index, canvas }))
    .filter((entry): entry is { index: number; canvas: Canvas } => entry.canvas !== undefined)

  if (availableCanvases.length === 0) {
    console.warn('collectQuoteFiles: no canvas available')
    return []
  }

  const collected: File[] = []
  const id = nanoid(10)
  let imgCount = 0;

  for (const entry of availableCanvases) {
    const canvasInstance = entry.canvas as Canvas
    const [mergedUrl, imageUrls] = await Promise.all([
      exportMergedImage(canvasInstance),
      exportImageObjects(canvasInstance),
    ])

    // Merged composite: compress to JPEG (no transparency needed, smaller payload)
    const compressedMerged = await compressDataUrl(mergedUrl)
    collected.push(await dataUrlToFile(compressedMerged, `design-${id}-side-${sanitizeFilenameSegment(activeSideLabels.value[entry.index]?.label ?? String(entry.index))}.jpg`))
    if (++imgCount >= MAX_IMAGE_COUNT) break;

    // Individual layers: keep as PNG to preserve transparency
    for (let i = 0; i < imageUrls.length; i++) {
      collected.push(await dataUrlToFile(imageUrls[i], `design-${id}-side-${sanitizeFilenameSegment(activeSideLabels.value[entry.index]?.label ?? String(entry.index))}-layer-${i + 1}.png`))
      if (++imgCount >= MAX_IMAGE_COUNT) break;
    }
  }

  return collected
}


// ===== WATCHERS =====

/**
 * Keep productCategory & product in formData in sync with the canvas store
 * reactively, so SSR hydration order or event timing never causes stale values.
 */
watch(activeCategoryLabel, (label) => {
  formData.value.productCategory = label
}, { immediate: true })

watch(activeProductLabel, (label) => {
  formData.value.product = label
}, { immediate: true })

/**
 * Emit changed event when form change state updates
 */
watch(isChanged, (newValue) => {
  emit('changed', newValue)
})

// ===== LIFECYCLE HOOKS =====

</script>

<template>
  <form
    name="quote"
    method="POST"
    action="/"
    data-netlify="true"
    netlify-honeypot="bot-field"
    enctype="multipart/form-data"
    autocomplete="off"
    class="w-full max-w-2xl bg-primary-100 p-6 sm:p-8 rounded-card"
    aria-label="Offertförfrågningsformulär"
    tabindex="-1"
    @submit.prevent="handleSubmit"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <!-- Form title -->
    <h3 class="sr-only">Offertförfrågningsformulär</h3>

    <!-- Hidden fields for Netlify -->
    <input type="hidden" name="form-name" value="quote">
    <p class="sr-only">
      <label>
        Don't fill this out if you're human:
        <input name="bot-field" tabindex="-1" autocomplete="off">
      </label>
    </p>

    <div class="space-y-4 sm:space-y-5">

      <!-- ── Name ──────────────────────────────────────────── -->
      <div>
        <label
          for="quote-name"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ditt namn <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-name"
          v-model="formData.name"
          type="text"
          name="name"
          required
          autocomplete="name"
          :aria-invalid="!!getFieldError('name')"
          :aria-describedby="getFieldError('name') ? 'name-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('name') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('name')"
          @input="handleInput('name')"
        >
        <p
          v-if="getFieldError('name')"
          id="name-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('name') }}
        </p>
      </div>

      <!-- ── Email ─────────────────────────────────────────── -->
      <div>
        <label
          for="quote-email"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Din e-post <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-email"
          v-model="formData.email"
          type="email"
          name="email"
          required
          autocomplete="email"
          :aria-invalid="!!getFieldError('email')"
          :aria-describedby="getFieldError('email') ? 'email-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('email') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('email')"
          @input="handleInput('email')"
        >
        <p
          v-if="getFieldError('email')"
          id="email-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('email') }}
        </p>
      </div>

      <!-- ── Phone (optional) ──────────────────────────────── -->
      <div>
        <label
          for="quote-phone"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Telefon <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-phone"
          v-model="formData.phone"
          type="tel"
          name="phone"
          autocomplete="tel"
          placeholder="+46 70 123 4567 (eller +Landskod Nummer)"
          :aria-invalid="!!getFieldError('phone')"
          :aria-describedby="getFieldError('phone') ? 'phone-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('phone') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('phone')"
          @input="handleInput('phone')"
        >
        <p
          v-if="getFieldError('phone')"
          id="phone-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('phone') }}
        </p>
      </div>

      <!-- ── Customer type ──────────────────────────────────── -->
      <div>
        <label
          for="quote-customer-type"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Kundtyp <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="quote-customer-type"
          v-model="formData.customerType"
          name="customer_type"
          required
          autocomplete="off"
          :aria-invalid="!!getFieldError('customerType')"
          :aria-describedby="getFieldError('customerType') ? 'customer-type-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('customerType') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('customerType')"
          @change="handleInput('customerType')"
        >
          <option value="" disabled>Välj kundtyp</option>
          <option value="Privatperson">Privatperson</option>
          <option value="Företag">Företag</option>
        </select>
        <p
          v-if="getFieldError('customerType')"
          id="customer-type-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('customerType') }}
        </p>
      </div>

      <!-- ── Subject (disabled / hardcoded) ───────────────── -->
      <div>
        <label
          for="quote-subject"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ämne
        </label>
        <input
          id="quote-subject"
          type="text"
          name="subject"
          :value="formData.subject"
          disabled
          readonly
          autocomplete="off"
          aria-readonly="true"
          class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
        >
      </div>

      <!-- ── Product category (disabled / prop-filled) ─────── -->
      <label
        for="quote-product-category"
        class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
      >
        Produktkategori
      </label>
      <input
        id="quote-product-category"
        type="text"
        name="product_category"
        :value="formData.productCategory"
        disabled
        readonly
        autocomplete="off"
        aria-readonly="true"
        class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
      >

      <!-- ── Product (disabled / prop-filled) ─────────────── -->
      <label
        for="quote-product"
        class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
      >
        Produkt
      </label>
      <input
        id="quote-product"
        type="text"
        name="product"
        :value="formData.product"
        disabled
        readonly
        autocomplete="off"
        aria-readonly="true"
        class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
      >

      <!-- ── Product ID (optional) ─────────────────────────── -->
      <div>
        <label
          for="quote-product-id"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Produkt ID <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-product-id"
          v-model="formData.productId"
          type="text"
          name="product_id"
          autocomplete="off"
          placeholder="T.ex. 3410020"
          :aria-invalid="!!getFieldError('productId')"
          :aria-describedby="getFieldError('productId') ? 'product-id-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('productId') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('productId')"
          @input="handleInput('productId')"
        >
        <p
          v-if="getFieldError('productId')"
          id="product-id-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('productId') }}
        </p>
      </div>

      <!-- ── Size (optional) ───────────────────────────────── -->
      <div>
        <label
          for="quote-size"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Storlek <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-size"
          v-model="formData.size"
          type="text"
          name="size"
          autocomplete="off"
          placeholder="T.ex. M, XL, 10, 31/32"
          :aria-invalid="!!getFieldError('size')"
          :aria-describedby="getFieldError('size') ? 'size-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('size') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('size')"
          @input="handleInput('size')"
        >
        <p
          v-if="getFieldError('size')"
          id="size-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('size') }}
        </p>
      </div>

      <!-- ── Product count ──────────────────────────────────── -->
      <div>
        <label
          for="quote-product-count"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Antal <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-product-count"
          v-model.number="formData.productCount"
          type="number"
          name="product_count"
          required
          min="1"
          max="10000"
          step="1"
          autocomplete="off"
          placeholder="Ange önskat antal"
          :aria-invalid="!!getFieldError('productCount')"
          :aria-describedby="getFieldError('productCount') ? 'product-count-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
          :class="getFieldError('productCount') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('productCount')"
          @input="handleInput('productCount')"
        >
        <p
          v-if="getFieldError('productCount')"
          id="product-count-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('productCount') }}
        </p>
      </div>

      <!-- ── Attached design images (hidden / prop-filled) ───── -->
      <div aria-hidden="true" class="sr-only">
        <!-- Hidden file inputs for Netlify submission, one per image slot -->
          <label
            for="quote-image-1"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 1
          </label>
          <input
            id="quote-image-1"
            :ref="el => fileInputRefs[0] = el as HTMLInputElement"
            type="file"
            name="image_1"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-2"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 2
          </label>
          <input
            id="quote-image-2"
            :ref="el => fileInputRefs[1] = el as HTMLInputElement"
            type="file"
            name="image_2"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-3"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 3
          </label>
          <input
            id="quote-image-3"
            :ref="el => fileInputRefs[2] = el as HTMLInputElement"
            type="file"
            name="image_3"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-4"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 4
          </label>
          <input
            id="quote-image-4"
            :ref="el => fileInputRefs[3] = el as HTMLInputElement"
            type="file"
            name="image_4"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-5"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 5
          </label>
          <input
            id="quote-image-5"
            :ref="el => fileInputRefs[4] = el as HTMLInputElement"
            type="file"
            name="image_5"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-6"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 6
          </label>
          <input
            id="quote-image-6"
            :ref="el => fileInputRefs[5] = el as HTMLInputElement"
            type="file"
            name="image_6"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-7"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 7
          </label>
          <input
            id="quote-image-7"
            :ref="el => fileInputRefs[6] = el as HTMLInputElement"
            type="file"
            name="image_7"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-8"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 8
          </label>
          <input
            id="quote-image-8"
            :ref="el => fileInputRefs[7] = el as HTMLInputElement"
            type="file"
            name="image_8"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-9"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 9
          </label>
          <input
            id="quote-image-9"
            :ref="el => fileInputRefs[8] = el as HTMLInputElement"
            type="file"
            name="image_9"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-10"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 10
          </label>
          <input
            id="quote-image-10"
            :ref="el => fileInputRefs[9] = el as HTMLInputElement"
            type="file"
            name="image_10"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-11"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 11
          </label>
          <input
            id="quote-image-11"
            :ref="el => fileInputRefs[10] = el as HTMLInputElement"
            type="file"
            name="image_11"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-12"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 12
          </label>
          <input
            id="quote-image-12"
            :ref="el => fileInputRefs[11] = el as HTMLInputElement"
            type="file"
            name="image_12"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-13"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 13
          </label>
          <input
            id="quote-image-13"
            :ref="el => fileInputRefs[12] = el as HTMLInputElement"
            type="file"
            name="image_13"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-14"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 14
          </label>
          <input
            id="quote-image-14"
            :ref="el => fileInputRefs[13] = el as HTMLInputElement"
            type="file"
            name="image_14"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-15"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 15
          </label>
          <input
            id="quote-image-15"
            :ref="el => fileInputRefs[14] = el as HTMLInputElement"
            type="file"
            name="image_15"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
          <label
            for="quote-image-16"
            class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
          >
            Bild 16
          </label>
          <input
            id="quote-image-16"
            :ref="el => fileInputRefs[15] = el as HTMLInputElement"
            type="file"
            name="image_16"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
          >
      </div>

      <!-- Display attached files to user (optional) -->
      <div v-if="formData.images && formData.images.length > 0" aria-live="polite">
        <p class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5">
          Tillagda designbilder
        </p>
        <ul
          class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 space-y-1 list-none cursor-not-allowed"
          aria-label="Designbilder som biläggs formuläret"
        >
          <li
            v-for="(image) in formData.images"
            :key="image.name"
            class="flex items-center gap-2"
          >
            {{ image.name }}
          </li>
        </ul>
      </div>

      <!-- ── Message (optional) ─────────────────────────────── -->
      <div>
        <label
          for="quote-message"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Meddelande <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <textarea
          id="quote-message"
          v-model="formData.message"
          name="message"
          rows="4"
          autocomplete="off"
          placeholder="Skriv ditt meddelande här…"
          :aria-invalid="!!getFieldError('message')"
          :aria-describedby="getFieldError('message') ? 'message-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input resize-y min-h-[100px]"
          :class="getFieldError('message') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('message')"
          @input="handleInput('message')"
        />
        <p
          v-if="getFieldError('message')"
          id="message-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('message') }}
        </p>
      </div>

      <!-- ── GDPR consent ───────────────────────────────────── -->
      <div>
        <div class="flex items-start gap-3">
          <input
            id="quote-gdpr"
            v-model="formData.gdprConsent"
            type="checkbox"
            name="gdpr_consent"
            required
            autocomplete="off"
            :aria-invalid="!!getFieldError('gdprConsent')"
            :aria-describedby="getFieldError('gdprConsent') ? 'gdpr-error' : undefined"
            class="w-11 h-11 flex-shrink-0 border-neutral-300 text-primary-600 form-checkbox-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            @change="handleInput('gdprConsent')"
          >
          <label
            for="quote-gdpr"
            class="text-sm sm:text-base text-neutral-900 cursor-pointer"
          >
            Jag godkänner behandling av mina personuppgifter enligt
            <button
              type="button"
              class="text-primary-800 underline hover:text-primary-900 outline-visible-tight-link"
              @click.prevent="openGdprDialog"
            >
              integritetspolicyn
            </button>
            <span class="text-error" aria-label="obligatoriskt">*</span>
          </label>
        </div>
        <p
          v-if="getFieldError('gdprConsent')"
          id="gdpr-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('gdprConsent') }}
        </p>
      </div>

      <!-- ── Success message ───────────────────────────────── -->
      <div
        v-if="showSuccessMessage && isSuccess"
        role="alert"
        aria-live="polite"
        class="p-4 bg-success-light border-l-4 border-success rounded-input"
      >
        <p class="font-medium text-success-dark">
          Tack för din offertförfrågan! Vi återkommer så snart som möjligt.
        </p>
      </div>

      <!-- ── Error message ─────────────────────────────────── -->
      <div
        v-if="showErrorMessage && (isError || hasErrors)"
        role="alert"
        aria-live="assertive"
        class="p-4 bg-error-light border-l-4 border-error rounded-input"
      >
        <p class="font-medium text-error-dark">
          Ett fel uppstod. Kontrollera dina uppgifter och försök igen.
        </p>
      </div>

      <!-- ── Submit ─────────────────────────────────────────── -->
      <div class="pt-2">
        <TextButton
          type="submit"
          variant="primary"
          size="fit"
          :disabled="isSubmitting"
          :busy="isSubmitting"
          :aria-label="isSubmitting ? 'Skickar offertförfrågan' : 'Skicka offertförfrågan'"
        >
          {{ isSubmitting ? 'Skickar...' : 'Skicka offertförfrågan' }}
        </TextButton>
      </div>
    </div>

    <!-- GDPR dialog -->
    <GdprDialog v-model="showGdprDialog" form="Quote" />
  </form>
</template>
