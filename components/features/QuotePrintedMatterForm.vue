// components/features/QuotePrintedMatterForm.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { computed, defineAsyncComponent, markRaw, ref, watch } from 'vue'

import type { QuotePrintedMatterFormData } from '~/composables/useQuotePrintedMatterForm'
import { usePrintedMatterForm } from '~/composables/useQuotePrintedMatterForm'
import TextButton from '~/components/common/TextButton.vue'
import CloseIcon from '~/assets/images/common/close-icon.svg?component'
import productsData from '~/assets/json/custom-design/printed-matter/products.json'
import { TAP_ANIMATION_TIME } from '~/constants/ui'

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
} = usePrintedMatterForm()

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const showGdprDialog = ref(false)

// ===== COMPUTED =====
/**
 * Display label for file input (used for ARIA and empty-state checks)
 */
const fileInputLabel = computed(() => {
  const files = formData.value.files
  if (!files || files.length === 0) return 'Ingen fil vald'
  return files.map(f => f.name).join(', ')
})

/**
 * List of selected file names for vertical display
 */
const selectedFileNames = computed(() => formData.value.files?.map(f => f.name) ?? [])

/**
 * Products list from products.json
 */
const products = computed(() => productsData.products)

/**
 * Available sizes for selected product
 */
const sizeOptions = computed(() => {
  const product = products.value.find(p => p.name === formData.value.product)
  return product?.size ?? []
})

/**
 * Available materials for selected product
 */
const materialOptions = computed(() => {
  const product = products.value.find(p => p.name === formData.value.product)
  return product?.material ?? []
})

/**
 * Available print options for selected product
 */
const printOptions = computed(() => {
  const product = products.value.find(p => p.name === formData.value.product)
  return product?.print ?? []
})

/**
 * Available finishing options for selected product
 */
const finishingOptions = computed(() => {
  const product = products.value.find(p => p.name === formData.value.product)
  return product?.finishing ?? []
})

// ===== METHODS =====

/**
 * Handle input blur event and validate field
 */
function handleBlur(field: keyof QuotePrintedMatterFormData): void {
  if (formData.value[field]) {
    validateField(field)
  }
}

/**
 * Handle input change and clear error
 */
function handleInput(field: keyof QuotePrintedMatterFormData): void {
  clearFieldError(field)
}

/**
 * Handle file input change — merge new files into existing selection
 */
function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  // markRaw prevents Vue from wrapping File objects in a Proxy.
  // FormData.append() and DataTransfer.items.add() use internal-slot brand
  // checks that fail on Proxy-wrapped Blob/File objects.
  const incoming = target.files ? Array.from(target.files).map(f => markRaw(f)) : []
  // Reset input value so the same file can be re-added after removal
  target.value = ''

  if (incoming.length === 0) return

  const existing = formData.value.files ?? []
  const existingNames = new Set(existing.map(f => f.name))
  const merged = [...existing, ...incoming.filter(f => !existingNames.has(f.name))]

  formData.value.files = merged
  validateField('files')
}

/**
 * Trigger file input click
 */
function triggerFileInput(): void {
  fileInputRef.value?.click()
}

/**
 * Remove a single file by name
 */
function removeFile(name: string): void {
  const remaining = (formData.value.files ?? []).filter(f => f.name !== name)
  formData.value.files = remaining.length > 0 ? remaining : null
  if (remaining.length === 0) {
    clearFieldError('files')
  }
  else {
    validateField('files')
  }
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

  const success = await submitForm()
  
  if (success) {
    showSuccessMessage.value = true
    showErrorMessage.value = false
    emit('success')
    
    // Auto-hide success message after 5 seconds
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
 * Reset dependent fields when product changes
 */
watch(() => formData.value.product, () => {
  formData.value.size = ''
  formData.value.material = ''
  formData.value.print = ''
  formData.value.finishing = ''
})

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
    name="quote-printed-matter"
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
    <input type="hidden" name="form-name" value="quote-printed-matter">
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
          for="quote-printed-matter-name"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ditt namn <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-printed-matter-name"
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
          for="quote-printed-matter-email"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Din e-post <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-printed-matter-email"
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
          for="quote-printed-matter-phone"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Telefon <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-printed-matter-phone"
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
          for="quote-printed-matter-customer-type"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Kundtyp <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="quote-printed-matter-customer-type"
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

      <!-- ── Subject (disabled / hardcoded) ───────────────── -->
      <div>
        <label
          for="quote-printed-matter-subject"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ämne
        </label>
        <input
          id="quote-printed-matter-subject"
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

      <!-- ── Product category (disabled / hardcoded) ─────── -->
      <label
        for="quote-printed-matter-product-category"
        class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
      >
        Produktkategori
      </label>
      <input
        id="quote-printed-matter-product-category"
        type="text"
        name="product_category"
        :value="formData.productCategory"
        disabled
        readonly
        autocomplete="off"
        aria-readonly="true"
        class="w-full px-4 py-2.5 text-base border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 cursor-not-allowed"
      >

      <!-- ── Product (select) ───────────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-product"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Produkt <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="quote-printed-matter-product"
          v-model="formData.product"
          name="product"
          autocomplete="off"
          :aria-invalid="!!getFieldError('product')"
          :aria-describedby="getFieldError('product') ? 'product-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('product') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('product')"
          @change="handleInput('product')"
        >
          <option value="" disabled>Välj produkt</option>
          <option v-for="product in products" :key="product.name" :value="product.name">
            {{ product.name }}
          </option>
        </select>
        <p
          v-if="getFieldError('product')"
          id="product-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('product') }}
        </p>
      </div>

      <!-- ── Size / Format (Optional) ─────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-size"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Storlek / Format <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <select
          id="quote-printed-matter-size"
          v-model="formData.size"
          name="size"
          autocomplete="off"
          :aria-invalid="!!getFieldError('size')"
          :aria-describedby="getFieldError('size') ? 'size-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('size') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting || sizeOptions.length === 0"
          @blur="handleBlur('size')"
          @change="handleInput('size')"
        >
          <option value="">Välj storlek</option>
          <option v-for="size in sizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <p
          v-if="getFieldError('size')"
          id="size-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('size') }}
        </p>
      </div>

      <!-- ── Material / Papperstyp (Optional) ──────────────────── -->
      <div>
        <label
          for="quote-printed-matter-material"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Material / Papperstyp <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <select
          id="quote-printed-matter-material"
          v-model="formData.material"
          name="material"
          autocomplete="off"
          :aria-invalid="!!getFieldError('material')"
          :aria-describedby="getFieldError('material') ? 'material-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('material') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting || materialOptions.length === 0"
          @blur="handleBlur('material')"
          @change="handleInput('material')"
        >
          <option value="">Välj material</option>
          <option v-for="material in materialOptions" :key="material" :value="material">
            {{ material }}
          </option>
        </select>
        <p
          v-if="getFieldError('material')"
          id="material-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('material') }}
        </p>
      </div>

      <!-- ── Print (Optional) ────────────────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-print"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Tryck <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <select
          id="quote-printed-matter-print"
          v-model="formData.print"
          name="print"
          autocomplete="off"
          :aria-invalid="!!getFieldError('print')"
          :aria-describedby="getFieldError('print') ? 'print-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('print') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting || printOptions.length === 0"
          @blur="handleBlur('print')"
          @change="handleInput('print')"
        >
          <option value="">Välj tryck</option>
          <option v-for="print in printOptions" :key="print" :value="print">
            {{ print }}
          </option>
        </select>
        <p
          v-if="getFieldError('print')"
          id="print-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('print') }}
        </p>
      </div>

      <!-- ── Finishing (Optional) ────────────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-finishing"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Efterbehandling <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <select
          id="quote-printed-matter-finishing"
          v-model="formData.finishing"
          name="finishing"
          autocomplete="off"
          :aria-invalid="!!getFieldError('finishing')"
          :aria-describedby="getFieldError('finishing') ? 'finishing-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('finishing') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting || finishingOptions.length === 0"
          @blur="handleBlur('finishing')"
          @change="handleInput('finishing')"
        >
          <option value="">Välj efterbehandling</option>
          <option v-for="finishing in finishingOptions" :key="finishing" :value="finishing">
            {{ finishing }}
          </option>
        </select>
        <p
          v-if="getFieldError('finishing')"
          id="finishing-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('finishing') }}
        </p>
      </div>

      <!-- ── Product count ──────────────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-product-count"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Antal <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="quote-printed-matter-product-count"
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

      <!-- File Upload (Required) -->
      <div>
        <label 
          for="quote-printed-matter-file" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ladda upp design filer <span class="text-error" aria-label="obligatoriskt fält">*</span> <span class="text-neutral-600 text-xs sm:text-sm">(max 10 st, max 7 MB totalt)</span>
        </label>
        <!-- UI trigger input — no name, never submitted directly -->
        <input
          id="quote-printed-matter-file"
          ref="fileInputRef"
          type="file"
          accept="application/pdf,.ai,.eps,.tif,.tiff,.psd,.jpg,.jpeg,.png,application/postscript"
          autocomplete="off"
          multiple
          :aria-invalid="!!getFieldError('files')"
          :aria-describedby="getFieldError('files') ? 'file-error' : undefined"
          class="sr-only"
          tabindex="-1"
          :disabled="isSubmitting"
          @change="handleFileChange"
        >
        <!-- Hidden named inputs — registered by Netlify's SSG crawler -->
        <div aria-hidden="true" class="sr-only">
          <label for="quote-printed-matter-file-1" class="block">Fil 1</label>
          <input id="quote-printed-matter-file-1" type="file" name="file_1" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-2" class="block">Fil 2</label>
          <input id="quote-printed-matter-file-2" type="file" name="file_2" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-3" class="block">Fil 3</label>
          <input id="quote-printed-matter-file-3" type="file" name="file_3" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-4" class="block">Fil 4</label>
          <input id="quote-printed-matter-file-4" type="file" name="file_4" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-5" class="block">Fil 5</label>
          <input id="quote-printed-matter-file-5" type="file" name="file_5" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-6" class="block">Fil 6</label>
          <input id="quote-printed-matter-file-6" type="file" name="file_6" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-7" class="block">Fil 7</label>
          <input id="quote-printed-matter-file-7" type="file" name="file_7" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-8" class="block">Fil 8</label>
          <input id="quote-printed-matter-file-8" type="file" name="file_8" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-9" class="block">Fil 9</label>
          <input id="quote-printed-matter-file-9" type="file" name="file_9" tabindex="-1" aria-hidden="true">
          <label for="quote-printed-matter-file-10" class="block">Fil 10</label>
          <input id="quote-printed-matter-file-10" type="file" name="file_10" tabindex="-1" aria-hidden="true">
        </div>
        <button
          type="button"
          class="w-full px-4 py-2.5 text-base form-button-base outline-tight-button disabled:opacity-50 disabled:cursor-not-allowed text-left bg-white flex items-start justify-between"
          :class="[
            getFieldError('files')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
          :disabled="isSubmitting"
          :aria-label="fileInputLabel === 'Ingen fil vald' ? 'Välj filer att ladda upp' : `Valda filer: ${fileInputLabel}`"
          @click="triggerFileInput"
        >
          <span v-if="selectedFileNames.length === 0" class="text-neutral-700">Ingen fil vald</span>
          <ul v-else class="flex flex-col gap-1 text-sm w-full" aria-label="Valda filer">
            <li
              v-for="name in selectedFileNames"
              :key="name"
              class="flex items-center justify-between gap-2 text-neutral-700"
            >
              <span class="truncate">{{ name }}</span>
              <button
                type="button"
                class="flex-shrink-0 p-1 text-neutral-600 hover:text-error outline-tight-button-error"
                :aria-label="'Ta bort fil: ' + name"
                :disabled="isSubmitting"
                @click.stop="removeFile(name)"
              >
                <CloseIcon class="w-4 h-4" />
              </button>
            </li>
          </ul>
        </button>
        <p
          v-if="getFieldError('files')"
          id="file-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('files') }}
        </p>
      </div>

      <!-- ── Message (optional) ─────────────────────────────── -->
      <div>
        <label
          for="quote-printed-matter-message"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Meddelande <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <textarea
          id="quote-printed-matter-message"
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
            id="quote-printed-matter-gdpr"
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
            for="quote-printed-matter-gdpr"
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
    <GdprDialog v-if="showGdprDialog" v-model="showGdprDialog" form="Quote-Printed-Matter" />
  </form>
</template>
