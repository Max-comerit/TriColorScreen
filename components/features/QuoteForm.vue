<script setup lang="ts">
// ===== IMPORTS =====
import { useQuoteForm } from '~/composables/useQuoteForm'
import type { QuoteFormData } from '~/composables/useQuoteForm'
import TextButton from '~/components/common/TextButton.vue'
import GdprDialog from '~/components/features/GdprDialog.vue'

// ===== PROPS =====
interface Props {
  productCategory?: string
  product?: string
  files?: File[]
}

const props = withDefaults(defineProps<Props>(), {
  productCategory: '',
  product: '',
  files: () => [],
})

// ===== EMITS =====
const emit = defineEmits<{
  (e: 'changed', value: boolean): void
  (e: 'success'): void
}>()

// ===== COMPOSABLES =====
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
 * Handle form submission
 */
async function handleSubmit(): Promise<void> {
  const success = await submitForm()

  if (success) {
    showSuccessMessage.value = true
    showErrorMessage.value = false
    emit('success')

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
 * Sync prop values into formData whenever props change
 */
watch(
  () => props.productCategory,
  (value) => { formData.value.productCategory = value ?? '' },
  { immediate: true },
)

watch(
  () => props.product,
  (value) => { formData.value.product = value ?? '' },
  { immediate: true },
)

watch(
  () => props.files,
  (value) => { formData.value.files = value ?? [] },
  { immediate: true },
)

/**
 * Emit changed event when form change state updates
 */
watch(isChanged, (newValue) => {
  emit('changed', newValue)
})
</script>

<template>
  <form
    name="quote"
    method="POST"
    action="/"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    enctype="multipart/form-data"
    autocomplete="off"
    class="w-full max-w-2xl bg-primary-100 p-6 sm:p-8 rounded-card shadow-drop"
    aria-label="Offertförfrågningsformulär"
    @submit.prevent="handleSubmit"
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
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
          Telefon <span class="text-neutral-500 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="quote-phone"
          v-model="formData.phone"
          type="tel"
          name="phone"
          autocomplete="tel"
          placeholder="+46 70 123 4567"
          :aria-invalid="!!getFieldError('phone')"
          :aria-describedby="getFieldError('phone') ? 'phone-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
          Är ni? <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="quote-customer-type"
          v-model="formData.customerType"
          name="customer_type"
          required
          autocomplete="off"
          :aria-invalid="!!getFieldError('customerType')"
          :aria-describedby="getFieldError('customerType') ? 'customer-type-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="getFieldError('customerType') ? 'border-error focus:ring-error' : 'border-neutral-300 hover:border-neutral-400'"
          :disabled="isSubmitting"
          @blur="handleBlur('customerType')"
          @change="handleInput('customerType')"
        >
          <option value="" disabled>
            Välj kundtyp
          </option>
          <option value="person">
            Privatperson
          </option>
          <option value="company">
            Företag
          </option>
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
      <div v-if="formData.productCategory">
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
      </div>

      <!-- ── Product (disabled / prop-filled) ─────────────── -->
      <div v-if="formData.product">
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
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div
        v-if="formData.files && formData.files.length > 0"
        aria-live="polite"
      >
        <p class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5">
          Tillagda designbilder
        </p>
        <ul
          class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-input bg-neutral-100 text-neutral-600 space-y-1 list-none"
          aria-label="Designbilder som biläggs formuläret"
        >
          <li
            v-for="(file, index) in formData.files"
            :key="index"
            class="flex items-center gap-2"
          >
            <span aria-hidden="true" class="text-neutral-400">-</span>
            {{ file.name }}
          </li>
        </ul>
      </div>

      <!-- ── Message (optional) ─────────────────────────────── -->
      <div>
        <label
          for="quote-message"
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Meddelande <span class="text-neutral-500 text-xs sm:text-sm">(valfritt)</span>
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
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]"
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
            class="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              class="text-primary-600 underline hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded"
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
    <GdprDialog v-model="showGdprDialog" />
  </form>
</template>
