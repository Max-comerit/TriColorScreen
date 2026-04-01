// components/features/ContactForm.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { computed, defineAsyncComponent, markRaw, ref, watch } from 'vue'
import { useContactForm } from '~/composables/useContactForm'
import type { ContactFormData } from '~/composables/useContactForm'
import TextButton from '~/components/common/TextButton.vue'
import CloseIcon from '~/assets/images/common/close-icon.svg?component'
import { TAP_ANIMATION_TIME } from '~/constants/ui'

// ===== ASYNC COMPONENTS =====
const GdprDialog = defineAsyncComponent(() =>
  import('~/components/features/GdprDialog.vue')
)

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
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const showGdprDialog = ref(false)

// ===== COMPUTED =====
/**
 * Display label for file input (used for ARIA and empty-state checks)
 */
const fileInputLabel = computed(() => {
  const files = formData.value.image
  if (!files || files.length === 0) return 'Ingen fil vald'
  return files.map(f => f.name).join(', ')
})

/**
 * List of selected file names for vertical display
 */
const selectedFileNames = computed(() => formData.value.image?.map(f => f.name) ?? [])
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

  const existing = formData.value.image ?? []
  const existingNames = new Set(existing.map(f => f.name))
  const merged = [...existing, ...incoming.filter(f => !existingNames.has(f.name))]

  formData.value.image = merged
  validateField('image')
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
  const remaining = (formData.value.image ?? []).filter(f => f.name !== name)
  formData.value.image = remaining.length > 0 ? remaining : null
  if (remaining.length === 0) {
    clearFieldError('image')
  }
  else {
    validateField('image')
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
 * Watch isChanged and emit event when it changes
 */
watch(isChanged, (newValue) => {
  emit('changed', newValue)
})
</script>

<template>
  <!-- ✅ Visible form -->
  <form 
    name="contact-v2"
    method="POST"
    action="/"
    data-netlify="true"
    netlify-honeypot="bot-field"
    enctype="multipart/form-data"
    autocomplete="off"
    class="w-full max-w-2xl bg-primary-100 p-6 sm:p-8 rounded-card"
    aria-label="Kontaktformulär"
    @submit.prevent="handleSubmit"
  >
    <!-- Form Title -->
    <h3 class="sr-only">Kontaktformulär</h3>

    <!-- Hidden fields for Netlify -->
    <input type="hidden" name="form-name" value="contact-v2">
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
          autocomplete="name"
          :aria-invalid="!!getFieldError('name')"
          :aria-describedby="getFieldError('name') ? 'name-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
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
          autocomplete="email"
          :aria-invalid="!!getFieldError('email')"
          :aria-describedby="getFieldError('email') ? 'email-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
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
          Telefon <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
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
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
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
          autocomplete="off"
          :aria-invalid="!!getFieldError('customerType')"
          :aria-describedby="getFieldError('customerType') ? 'customer-type-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
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
          autocomplete="off"
          :aria-invalid="!!getFieldError('subject')"
          :aria-describedby="getFieldError('subject') ? 'subject-error' : undefined"
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
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
          Ladda upp bilder <span class="text-neutral-600 text-xs sm:text-sm">(valfritt, max 7MB per fil)</span>
        </label>
        <!-- UI trigger input — no name, never submitted directly -->
        <input
          id="contact-image"
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
          autocomplete="off"
          multiple
          :aria-invalid="!!getFieldError('image')"
          :aria-describedby="getFieldError('image') ? 'image-error' : undefined"
          class="sr-only"
          tabindex="-1"
          :disabled="isSubmitting"
          @change="handleFileChange"
        >
        <!-- Hidden named inputs — registered by Netlify's SSG crawler -->
        <div aria-hidden="true" class="sr-only">
          <input type="file" name="image_1" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_2" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_3" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_4" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_5" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_6" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_7" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_8" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_9" tabindex="-1" aria-hidden="true">
          <input type="file" name="image_10" tabindex="-1" aria-hidden="true">
        </div>
        <button
          type="button"
          class="w-full px-4 py-2.5 text-base form-button-base outline-tight-button disabled:opacity-50 disabled:cursor-not-allowed text-left bg-white flex items-start justify-between"
          :class="[
            getFieldError('image')
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
          Ditt meddelande <span class="text-neutral-600 text-xs sm:text-sm">(valfritt)</span>
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
          class="w-full px-4 py-2.5 text-base form-input-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]"
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
            autocomplete="off"
            :aria-invalid="!!getFieldError('gdprConsent')"
            :aria-describedby="getFieldError('gdprConsent') ? 'gdpr-error' : undefined"
            class="w-11 h-11 flex-shrink-0 border-neutral-300 text-primary-600 form-checkbox-base outline-tight-input disabled:opacity-50 disabled:cursor-not-allowed"
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
    <GdprDialog v-if="showGdprDialog" v-model="showGdprDialog" form="Contact" />
  </form>
</template>
