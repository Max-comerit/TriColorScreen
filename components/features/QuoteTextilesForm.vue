// components/features/QuoteTextilesForm.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { computed, defineAsyncComponent, markRaw, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import type { Canvas } from 'fabric'
import { Textbox } from 'fabric'
import type { QuoteTextilesFormData } from '~/composables/useQuoteTextilesForm'
import { useQuoteTextilesForm } from '~/composables/useQuoteTextilesForm'
import TextButton from '~/components/common/TextButton.vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { useCanvasExport } from '~/composables/useCanvasExport'
import { TAP_ANIMATION_TIME } from '~/constants/ui'
import type { SideTextInfo } from '~/types/CanvasText'

// ===== ASYNC COMPONENTS =====
const GdprDialog = defineAsyncComponent(() =>
  import('~/components/features/GdprDialog.vue')
)

// ===== PROPS =====
// (none)

// ===== EMITS =====
const emit = defineEmits<{
  (e: 'changed', value: boolean): void
  (e: 'success'): void
}>()

// ===== COMPOSABLES & STORES =====
const canvasStore = useCanvasStore()
const { canvasMap, productCategoryTree, activeCategory, activeProduct, textControlsSeq } = storeToRefs(canvasStore)
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
} = useQuoteTextilesForm()

// ===== STATE =====
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const showGdprDialog = ref(false)
const canvasesWithListeners = new Set<Canvas>()
const isCollectingImages = ref(false)
const pendingCanvasChange = ref(false)

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
 * Attach object:added and object:removed listeners to a canvas
 */
function attachCanvasListeners(canvas: Canvas): void {
  if (!canvasesWithListeners.has(canvas)) {
    canvas.on('object:added', onCanvasChange)
    canvas.on('object:modified', onCanvasChange);
    canvas.on('object:removed', onCanvasChange);
    canvasesWithListeners.add(canvas)
  }
}

/**
 * Detach object:added and object:removed listeners from a canvas
 */
function detachCanvasListeners(canvas: Canvas): void {
  if (canvasesWithListeners.has(canvas)) {
    canvas.off('object:added', onCanvasChange)
    canvas.off('object:modified', onCanvasChange);
    canvas.off('object:removed', onCanvasChange);
    canvasesWithListeners.delete(canvas)
  }
}

/**
 * Clean a CSS font-family string to just the primary font name.
 * E.g. "'Inter', sans-serif" → "Inter"
 */
function cleanFontFamily(fontFamily: string): string {
  const primary = fontFamily.split(',')[0].trim()
  return primary.replace(/['"/]/g, '')
}

function normalizeFontWeight(fontWeight: number | string): number {
  if (typeof fontWeight === 'number') {
    return fontWeight >= 600 ? 700 : 400
  }

  if (fontWeight === 'bold') return 700
  if (fontWeight === 'normal') return 400

  const parsed = Number.parseInt(fontWeight, 10)
  if (Number.isFinite(parsed)) {
    return parsed >= 600 ? 700 : 400
  }

  return 400
}

/**
 * Collect text objects from all active canvases and return a human-readable string.
 * Each entry describes the side label and the text properties on that side.
 */
function collectCanvasTexts(): string {
  const result: SideTextInfo[] = []

  canvasMap.value.forEach((canvas, index) => {
    if (!canvas) return

    const textObjects = canvas.getObjects().filter(
      (obj): obj is Textbox => obj instanceof Textbox
    )

    if (textObjects.length === 0) return

    const sideLabel = activeSideLabels.value[index]?.label ?? `Sida ${index + 1}`
    result.push({
      side: sideLabel,
      texts: textObjects.map(obj => ({
        text: obj.text ?? '',
        fontFamily: cleanFontFamily(obj.fontFamily ?? ''),
        fontWeight: normalizeFontWeight(obj.fontWeight ?? 400),
        isItalic: obj.fontStyle === 'italic',
        color: (obj.fill as string) ?? '#000000',
      })),
    })
  })

  if (result.length === 0) return ''

  return result
    .map(side => [
      `[ ${side.side} ]`,
      ...side.texts.map((t, i) =>
        `Text ${i + 1}: "${t.text}" | Typsnitt: ${t.fontFamily} ${t.fontWeight}${t.isItalic ? ' italic' : ''} | Färg: ${t.color}`
      ),
    ].join('\n'))
    .join('\n\n')
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
 * Convert a data URL to a File object.
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

/**
 * Export both canvas sides as File objects and populate files.
 * Includes a merged composite image and all individual image-layer files.
 */
async function collectQuoteFiles(): Promise<File[]> {
  const availableCanvases = canvasMap.value
    .map((canvas, index) => ({ index, canvas }))
    .filter((entry): entry is { index: number; canvas: Canvas } => entry.canvas !== undefined)

  if (availableCanvases.length === 0) {
    console.warn('collectQuoteFiles: no canvas available')
    return []
  }

  const collected: File[] = []
  const id = nanoid(10)

  for (const entry of availableCanvases) {
    try {
      const canvasInstance = entry.canvas as Canvas

      // Validate canvas is still valid and has a valid HTML element before exporting
      // The products have different sides/canvases and the user might have switched 
      // to a different product or category while the export was in progress, 
      // causing the original canvas references to become stale/invalid.
      if (!canvasInstance || !canvasInstance.elements.lower) {
        continue
      }

      const [mergedUrl, imageUrls] = await Promise.all([
        exportMergedImage(canvasInstance),
        exportImageObjects(canvasInstance),
      ])

      // Merged composite: compress to JPEG (no transparency needed, smaller payload)
      const compressedMerged = await compressDataUrl(mergedUrl)
      collected.push(await dataUrlToFile(compressedMerged, `design-${id}-side-${sanitizeFilenameSegment(activeSideLabels.value[entry.index]?.label ?? String(entry.index))}.jpg`))

      // Individual layers: preserve original format (SVG stays SVG, rasters stay PNG).
      for (let i = 0; i < imageUrls.length; i++) {
        const layer = imageUrls[i]
        const ext = layer.mimeType === 'image/svg+xml' ? 'svg' : 'png'
        collected.push(await dataUrlToFile(layer.url, `design-${id}-side-${sanitizeFilenameSegment(activeSideLabels.value[entry.index]?.label ?? String(entry.index))}-layer-${i + 1}.${ext}`))
      }
    }
    catch (error) {
      console.error('collectQuoteFiles: error exporting canvas:', error)
      // Continue with next canvas on error
      continue
    }
  }

  return collected
}

/**
 * Collect canvas images and populate form with exports
 */
async function collectCanvasImages(): Promise<void> {
  try {
    isCollectingImages.value = true
    // Collect current canvas images and populate formData before user submits
    // markRaw prevents Vue from wrapping File objects in a Proxy.
    // FormData.append() uses internal-slot brand checks that fail on Proxy-wrapped File/Blob objects.
    formData.value.images = (await collectQuoteFiles()).map(f => markRaw(f))
    // Collect text objects from all canvases
    formData.value.canvasTexts = collectCanvasTexts()
    // Validate images field after collecting
    validateField('images')
  }
  catch (error) {
    console.error('Error collecting canvas images:', error)
  }
  finally {
    isCollectingImages.value = false
  }
}

/**
 * Collect canvas images with queuing logic
 * If collection is already in progress, queues the change for later
 * Recursively processes queued changes after collection completes
 */
async function collectCanvasImagesQueued(): Promise<void> {
  // If collection is already in progress, queue this change for later
  if (isCollectingImages.value) {
    pendingCanvasChange.value = true
    return
  }

  await collectCanvasImages()
  
  // If collectCanvasImagesQueued was queued while collecting images, process it now
  if (pendingCanvasChange.value) {
    pendingCanvasChange.value = false
    await collectCanvasImagesQueued()
  }
}

/**
 * Handle canvas object changes (added/removed/updated)
 */
async function onCanvasChange(): Promise<void> {
  await collectCanvasImagesQueued()
}

/**
 * Handle input blur event and validate field
 */
function handleBlur(field: keyof QuoteTextilesFormData): void {
  if (formData.value[field]) {
    validateField(field)
  }
}

/**
 * Handle input change and clear error
 */
function handleInput(field: keyof QuoteTextilesFormData): void {
  clearFieldError(field)
}

/**
 * Open GDPR information dialog
 */
function openGdprDialog(): void {
  showGdprDialog.value = true
}

/**
 * Handle form submission
 */
async function handleSubmit(): Promise<void> {
  // Delay validation TAP_ANIMATION_TIME ms to allow tap animation to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))

  // Re-collect texts fresh at submit time so programmatic changes via the
  // controls panel (which fire no canvas events) are always included
  formData.value.canvasTexts = collectCanvasTexts()

  const success = await submitForm()

  if (success) {
    showSuccessMessage.value = true
    showErrorMessage.value = false
    emit('success')

    // Clear canvases immediately as it takes some time to clear the canvas object
    canvasStore.setActiveSide(0)
    canvasStore.clearObjects()

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

/**
 * Re-collect canvas texts when TextboxControls programmatically changes a textbox
 * property (font, bold, italic, color, etc.) — these don't fire canvas events.
 */
watch(textControlsSeq, () => {
  formData.value.canvasTexts = collectCanvasTexts()
})

/**
 * Attach event listeners to canvas objects when canvasMap changes
 * Listens for object:added, object:removed and object:updated events 
 * to detect canvas mutations
 * Also detaches listeners from canvases that are no longer in the map
 * Finally collects canvas images after listeners are updated
 */
watch(canvasMap, async (newCanvases) => {
  // Guard against undefined canvasMap (occurs when server dies or component unmounts)
  if (!Array.isArray(newCanvases)) {
    return
  }

  // Create a Set of current canvas references for quick lookup
  const currentCanvases = new Set<Canvas>(newCanvases.filter((c): c is Canvas => c !== undefined))

  // Attach listeners to new canvases
  for (const canvas of currentCanvases) {
    attachCanvasListeners(canvas)
  }

  // Detach listeners from canvases that are no longer in the map
  for (const canvas of canvasesWithListeners) {
    if (!currentCanvases.has(canvas)) {
      detachCanvasListeners(canvas)
    }
  }

  // Collect canvas images after listeners are attached/detached
  await collectCanvasImagesQueued()
})

// ===== LIFECYCLE HOOKS =====

</script>

<template>
  <form
    name="quote-textiles"
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
  >
    <!-- Form title -->
    <h3 class="sr-only">Offertförfrågningsformulär</h3>

    <!-- Hidden fields for Netlify -->
    <input type="hidden" name="form-name" value="quote-textiles">
    <p class="sr-only">
      <label>
        Don't fill this out if you're human:
        <input name="bot-field" tabindex="-1" autocomplete="off">
      </label>
    </p>

    <div class="space-y-4 sm:space-y-5">

      <!-- ── Subject (disabled / hardcoded) ───────────────── -->
      <div>
        <label
          for="quote-textiles-subject"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ämne
        </label>
        <input
          id="quote-textiles-subject"
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

      <!-- ── Product category (disabled / design-panel-filled) ─────── -->
      <label
        for="quote-textiles-product-category"
        class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
      >
        Produktkategori
      </label>
      <input
        id="quote-textiles-product-category"
        type="text"
        name="product_category"
        :value="formData.productCategory"
        disabled
        readonly
        autocomplete="off"
        aria-readonly="true"
        class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
      >

      <!-- ── Product (disabled / design-panel-filled) ─────────────── -->
      <label
        for="quote-textiles-product"
        class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
      >
        Produkt
      </label>
      <input
        id="quote-textiles-product"
        type="text"
        name="product"
        :value="formData.product"
        disabled
        readonly
        autocomplete="off"
        aria-readonly="true"
        class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
      >

      <!-- ── Attached design images (hidden / design-panel-filled) ───── -->
      <!-- Hidden file inputs for Netlify SSG crawler registration, one per image slot -->
      <div aria-hidden="true" class="sr-only">
        <label for="quote-textiles-image-1" class="block">Bild 1</label>
        <input id="quote-textiles-image-1" type="file" name="image_1" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-2" class="block">Bild 2</label>
        <input id="quote-textiles-image-2" type="file" name="image_2" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-3" class="block">Bild 3</label>
        <input id="quote-textiles-image-3" type="file" name="image_3" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-4" class="block">Bild 4</label>
        <input id="quote-textiles-image-4" type="file" name="image_4" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-5" class="block">Bild 5</label>
        <input id="quote-textiles-image-5" type="file" name="image_5" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-6" class="block">Bild 6</label>
        <input id="quote-textiles-image-6" type="file" name="image_6" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-7" class="block">Bild 7</label>
        <input id="quote-textiles-image-7" type="file" name="image_7" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-8" class="block">Bild 8</label>
        <input id="quote-textiles-image-8" type="file" name="image_8" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-9" class="block">Bild 9</label>
        <input id="quote-textiles-image-9" type="file" name="image_9" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-10" class="block">Bild 10</label>
        <input id="quote-textiles-image-10" type="file" name="image_10" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-11" class="block">Bild 11</label>
        <input id="quote-textiles-image-11" type="file" name="image_11" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-12" class="block">Bild 12</label>
        <input id="quote-textiles-image-12" type="file" name="image_12" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-13" class="block">Bild 13</label>
        <input id="quote-textiles-image-13" type="file" name="image_13" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-14" class="block">Bild 14</label>
        <input id="quote-textiles-image-14" type="file" name="image_14" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-15" class="block">Bild 15</label>
        <input id="quote-textiles-image-15" type="file" name="image_15" tabindex="-1" aria-hidden="true">
        <label for="quote-textiles-image-16" class="block">Bild 16</label>
        <input id="quote-textiles-image-16" type="file" name="image_16" tabindex="-1" aria-hidden="true">
      </div>

      <!-- Display attached files to user (optional) -->
      <div v-if="formData.images && formData.images.length > 0" aria-live="polite">
        <p class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5">
          Tillagda designbilder
        </p>
        <ul
          class="w-full px-4 py-2.5 text-sm border rounded-input bg-neutral-100 text-neutral-600 space-y-1 list-none cursor-not-allowed"
          :class="[
            getFieldError('images')
              ? 'border-error'
              : 'border-neutral-300',
          ]"
          :aria-invalid="!!getFieldError('images')"
          :aria-describedby="getFieldError('images') ? 'images-error' : undefined"
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
      <!-- ── Images error (from canvas export) ──────────────── -->
      <p
        v-if="getFieldError('images')"
        id="images-error"
        class="mt-1.5 text-sm text-error-dark"
        role="alert"
      >
        {{ getFieldError('images') }}
      </p>

      <!-- ── Attached design texts (hidden / design-panel-filled) ───── -->
      <input type="hidden" name="texter" :value="formData.canvasTexts">
      <div v-if="formData.canvasTexts" aria-live="polite">
        <p class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5">
          Tillagda designtexter
        </p>
        <ul
          class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 space-y-1 list-none cursor-not-allowed"
          aria-label="Texter som biläggs formuläret"
        >
          <li
            v-for="line in formData.canvasTexts.split('\n')"
            :key="line"
          >
            {{ line }}
          </li>
        </ul>
      </div>

      <!-- ── Product ID (optional) ─────────────────────────── -->
      <div>
        <label
          for="quote-textiles-product-id"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Produkt ID <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-textiles-product-id"
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
          for="quote-textiles-size"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Storlek <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-textiles-size"
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
          for="quote-textiles-product-count"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Antal <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-textiles-product-count"
          v-model.number="formData.productCount"
          type="number"
          name="product_count"
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

      <!-- ── Message (optional) ─────────────────────────────── -->
      <div>
        <label
          for="quote-textiles-message"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Meddelande <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <textarea
          id="quote-textiles-message"
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

      <!-- ── Name ──────────────────────────────────────────── -->
      <div>
        <label
          for="quote-textiles-name"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ditt namn <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-textiles-name"
          v-model="formData.name"
          type="text"
          name="name"
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
          for="quote-textiles-email"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Din e-post <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-textiles-email"
          v-model="formData.email"
          type="email"
          name="email"
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
          for="quote-textiles-phone"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Telefon <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-textiles-phone"
          v-model="formData.phone"
          type="tel"
          name="phone"
          autocomplete="tel"
          placeholder="+46 70 123 4567"
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
          for="quote-textiles-customer-type"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Kundtyp <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="quote-textiles-customer-type"
          v-model="formData.customerType"
          name="customer_type"
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

      <!-- ── GDPR consent ───────────────────────────────────── -->
      <div>
        <div class="flex items-start gap-3">
          <input
            id="quote-textiles-gdpr"
            v-model="formData.gdprConsent"
            type="checkbox"
            name="gdpr_consent"
            autocomplete="off"
            :aria-invalid="!!getFieldError('gdprConsent')"
            :aria-describedby="getFieldError('gdprConsent') ? 'gdpr-error' : undefined"
            class="w-11 h-11 flex-shrink-0 border-neutral-300 text-primary-600 form-checkbox-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            @change="handleInput('gdprConsent')"
          >
          <label
            for="quote-textiles-gdpr"
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
    <GdprDialog v-if="showGdprDialog" v-model="showGdprDialog" form="Quote-Textiles" />
  </form>
</template>
