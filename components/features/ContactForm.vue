// components/features/ContactForm.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { useContactForm } from '~/composables/useContactForm'
import type { ContactFormData } from '~/composables/useContactForm'
import TextButton from '~/components/common/TextButton.vue'
import GdprDialog from '~/components/features/GdprDialog.vue'
import CloseIcon from '~/assets/images/common/close-icon.svg?component'

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
} = useContactForm()

// ===== STATE =====
const fileInputRef = ref<HTMLInputElement | null>(null)
const fileInputLabel = ref<string>('Ingen fil vald')
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const showGdprDialog = ref(false)

// ===== METHODS =====
/**
 * Handle input blur event and validate field
 */
function handleBlur(field: keyof ContactFormData): void {
  if (formData.value[field]) {
    validateField(field)
  }
}

/**
 * Handle input change and clear error
 */
function handleInput(field: keyof ContactFormData): void {
  clearFieldError(field)
}

/**
 * Handle file input change
 */
function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  
  formData.value.image = file
  fileInputLabel.value = file ? file.name : 'Ingen fil vald'
  
  // Validate file if selected
  if (file) {
    validateField('image')
  }
  else {
    clearFieldError('image')
  }
}

/**
 * Trigger file input click
 */
function triggerFileInput(): void {
  fileInputRef.value?.click()
}

/**
 * Clear selected file
 */
function handleClearFile(): void {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  formData.value.image = null
  fileInputLabel.value = 'Ingen fil vald'
  clearFieldError('image')
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
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
      resetForm()
      fileInputLabel.value = 'Ingen fil vald'
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
 * Watch isChanged and emit event when it changes
 */
watch(isChanged, (newValue) => {
  emit('changed', newValue)
})
</script>

<template>
  <!-- ✅ Visible form -->
  <form 
    name="contact"
    method="POST"
    action="/"
    data-netlify="true"
    netlify-honeypot="bot-field"
    enctype="multipart/form-data"
    autocomplete="off"
    class="w-full max-w-2xl bg-primary-100 p-6 sm:p-8 rounded-card shadow-drop"
    aria-label="Kontaktformulär"
    @submit.prevent="handleSubmit"
  >
    <!-- Form Title -->
    <h3 class="sr-only">Kontaktformulär</h3>

    <!-- Hidden fields for Netlify -->
    <input type="hidden" name="form-name" value="contact">
    <p class="sr-only">
      <label>
        Don't fill this out if you're human: 
        <input name="bot-field" tabindex="-1" autocomplete="off">
      </label>
    </p>

    <div class="space-y-4 sm:space-y-5">
      <!-- Name Field -->
      <div>
        <label 
          for="contact-name" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ditt namn <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="contact-name"
          v-model="formData.name"
          type="text"
          name="name"
          required
          autocomplete="name"
          :aria-invalid="!!getFieldError('name')"
          :aria-describedby="getFieldError('name') ? 'name-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            getFieldError('name')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
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

      <!-- Email Field -->
      <div>
        <label 
          for="contact-email" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Din e-post <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="contact-email"
          v-model="formData.email"
          type="email"
          name="email"
          required
          autocomplete="email"
          :aria-invalid="!!getFieldError('email')"
          :aria-describedby="getFieldError('email') ? 'email-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            getFieldError('email')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
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

      <!-- Phone Field (Optional) -->
      <div>
        <label 
          for="contact-phone" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Telefon <span class="text-neutral-500 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <input
          id="contact-phone"
          v-model="formData.phone"
          type="tel"
          name="phone"
          autocomplete="tel"
          placeholder="+46 70 123 4567 (eller +Landskod Nummer)"
          :aria-invalid="!!getFieldError('phone')"
          :aria-describedby="getFieldError('phone') ? 'phone-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            getFieldError('phone')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
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

      <!-- Customer Type Select -->
      <div>
        <label 
          for="contact-customer-type" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Kundtyp <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <select
          id="contact-customer-type"
          v-model="formData.customerType"
          name="customer_type"
          required
          autocomplete="off"
          :aria-invalid="!!getFieldError('customerType')"
          :aria-describedby="getFieldError('customerType') ? 'customer-type-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
          :class="[
            getFieldError('customerType')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
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

      <!-- Subject Field -->
      <div>
        <label 
          for="contact-subject" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ämne <span class="text-error" aria-label="obligatoriskt fält">*</span>
        </label>
        <input
          id="contact-subject"
          v-model="formData.subject"
          type="text"
          name="subject"
          required
          autocomplete="off"
          :aria-invalid="!!getFieldError('subject')"
          :aria-describedby="getFieldError('subject') ? 'subject-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            getFieldError('subject')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
          :disabled="isSubmitting"
          @blur="handleBlur('subject')"
          @input="handleInput('subject')"
        >
        <p
          v-if="getFieldError('subject')"
          id="subject-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('subject') }}
        </p>
      </div>

      <!-- File Upload (Optional) -->
      <div>
        <label 
          for="contact-image" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ladda upp bild <span class="text-neutral-500 text-xs sm:text-sm">(valfritt, max 5MB)</span>
        </label>
        <input
          id="contact-image"
          ref="fileInputRef"
          type="file"
          name="image"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          autocomplete="off"
          :aria-invalid="!!getFieldError('image')"
          :aria-describedby="getFieldError('image') ? 'image-error' : undefined"
          class="sr-only"
          tabindex="-1"
          :disabled="isSubmitting"
          @change="handleFileChange"
        >
        <button
          type="button"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-left bg-white flex items-center justify-between"
          :class="[
            getFieldError('image')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
          :disabled="isSubmitting"
          :aria-label="fileInputLabel === 'Ingen fil vald' ? 'Välj fil att ladda upp' : `Vald fil: ${fileInputLabel}`"
          @click="triggerFileInput"
        >
          <span class="text-neutral-700">{{ fileInputLabel }}</span>
          <button
            v-if="fileInputLabel !== 'Ingen fil vald'"
            type="button"
            class="ml-2 p-1 text-neutral-500 hover:text-error focus:outline-none focus:ring-2 focus:ring-error rounded transition-colors"
            :aria-label="'Rensa vald fil: ' + fileInputLabel"
            :disabled="isSubmitting"
            @click.stop="handleClearFile"
          >
            <CloseIcon class="w-5 h-5" />
          </button>
        </button>
        <p
          v-if="getFieldError('image')"
          id="image-error"
          class="mt-1.5 text-sm text-error-dark"
          role="alert"
        >
          {{ getFieldError('image') }}
        </p>
      </div>

      <!-- Message Field (Optional) -->
      <div>
        <label 
          for="contact-message" 
          class="block text-sm sm:text-base font-medium text-neutral-900 mb-1.5"
        >
          Ditt meddelande <span class="text-neutral-500 text-xs sm:text-sm">(valfritt)</span>
        </label>
        <textarea
          id="contact-message"
          v-model="formData.message"
          name="message"
          rows="4"
          autocomplete="off"
          placeholder="Skriv ditt meddelande här…"
          :aria-invalid="!!getFieldError('message')"
          :aria-describedby="getFieldError('message') ? 'message-error' : undefined"
          class="w-full px-4 py-2.5 text-base border rounded-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]"
          :class="[
            getFieldError('message')
              ? 'border-error focus:ring-error'
              : 'border-neutral-300 hover:border-neutral-400',
          ]"
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

      <!-- GDPR Consent Checkbox -->
      <div>
        <div class="flex items-start gap-3">
          <input
            id="contact-gdpr"
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
            for="contact-gdpr" 
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

      <!-- Success Message -->
      <div
        v-if="showSuccessMessage && isSuccess"
        role="alert"
        aria-live="polite"
        class="p-4 bg-success-light border-l-4 border-success rounded-input"
      >
        <p class="font-medium text-success-dark">
          Tack för ditt meddelande! Vi återkommer så snart som möjligt.
        </p>
      </div>

      <!-- Error Message -->
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

      <!-- Submit Button -->
      <div class="pt-2">
        <TextButton
          type="submit"
          variant="primary"
          size="fit"
          :disabled="isSubmitting"
          :busy="isSubmitting"
          :aria-label="isSubmitting ? 'Skickar kontaktformulär' : 'Skicka kontaktformulär'"
        >
          {{ isSubmitting ? 'Skickar...' : 'Skicka' }}
        </TextButton>
      </div>
    </div>

    <!-- GDPR Information Dialog -->
    <GdprDialog v-model="showGdprDialog" />
  </form>
</template>
