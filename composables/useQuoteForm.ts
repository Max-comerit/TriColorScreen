// composables/useQuoteForm.ts

/**
 * Quote Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the quote request form with Zod schema validation.
 * 
 * Note: Zod validation is dynamically imported to keep it out of the critical bundle.
 */

import { useQuoteFormStore } from '~/stores/quoteFormStore'
import type { QuoteFormData, FormState } from '~/types/Forms'

// ===== CONSTANTS =====
/** Maximum number of images allowed */
export const MAX_IMAGE_COUNT = 16

// ===== COMPOSABLE =====
/**
 * Quote form composable with validation and state management
 */
export function useQuoteForm() {
  // ===== STORE =====
  const quoteFormStore = useQuoteFormStore()

  // ===== STATE =====
  const formData = ref<QuoteFormData>({ ...quoteFormStore.formData })
  const initialFormData = ref<Omit<QuoteFormData, 'images'>>(
    (({ images: _i, ...rest }) => rest)(formData.value),
  )
  const formState = ref<FormState>('idle')
  const fieldErrors = ref<Map<keyof QuoteFormData, string>>(new Map())
  const generalError = ref<string | null>(null)

  // ===== COMPUTED =====
  /**
   * Check if user-editable form data has changed from initial state.
   * Files are excluded because they are prop-injected and cannot be serialised.
   */
  const isChanged = computed(() => {
    const editableData = (({ images: _i, ...rest }) => rest)(formData.value)
    return JSON.stringify(editableData) !== JSON.stringify(initialFormData.value)
  })

  /**
   * Check if form is currently submitting
   */
  const isSubmitting = computed(() => formState.value === 'submitting')

  /**
   * Check if form submission was successful
   */
  const isSuccess = computed(() => formState.value === 'success')

  /**
   * Check if form submission failed
   */
  const isError = computed(() => formState.value === 'error')

  /**
   * Check if form has any validation errors
   */
  const hasErrors = computed(() => fieldErrors.value.size > 0 || generalError.value !== null)

  // ===== METHODS =====
  /**
   * Validate a single field
   * Dynamically imports validation logic to keep Zod out of critical bundle
   */
  async function validateField(field: keyof QuoteFormData): Promise<boolean> {
    try {
      const { validateField: validate } = await import('~/utils/validation/quoteFormValidation')
      const result = validate(field, formData.value)
      if (result.valid) {
        fieldErrors.value.delete(field)
        return true
      }
      else {
        if (result.error) {
          fieldErrors.value.set(field, result.error)
        }
        return false
      }
    }
    catch (error) {
      console.error('Field validation error:', error)
      return false
    }
  }

  /**
   * Validate entire form
   * Dynamically imports validation logic to keep Zod out of critical bundle
   */
  async function validateForm(): Promise<boolean> {
    try {
      const { validateForm: validate } = await import('~/utils/validation/quoteFormValidation')
      const result = validate(formData.value)
      
      if (result.valid) {
        fieldErrors.value.clear()
        generalError.value = null
        return true
      }
      else {
        fieldErrors.value = new Map(result.errors)
        return false
      }
    }
    catch (error) {
      console.error('Form validation error:', error)
      generalError.value = 'Valideringsfel inträffade'
      return false
    }
  }

  /**
   * Get error message for a specific field
   */
  function getFieldError(field: keyof QuoteFormData): string | undefined {
    return fieldErrors.value.get(field)
  }

  /**
   * Clear error for a specific field
   */
  function clearFieldError(field: keyof QuoteFormData): void {
    fieldErrors.value.delete(field)
  }

  /**
   * Clear all errors
   */
  function clearErrors(): void {
    fieldErrors.value.clear()
    generalError.value = null
  }

  /**
   * Reset all user-editable fields to their initial state.
   * Prop-injected fields (subject, productCategory, product, images) are preserved by the store.
   */
  function resetForm(): void {
    formData.value.name = ''
    formData.value.email = ''
    formData.value.phone = ''
    formData.value.customerType = '' as 'Privatperson' | 'Företag'
    // subject, productCategory, product and images are intentionally NOT reset —
    // they are controlled by the parent component via props.
    formData.value.productId = ''
    formData.value.size = ''
    formData.value.productCount = undefined as unknown as number
    formData.value.message = ''
    formData.value.gdprConsent = false
    initialFormData.value = (({ images: _i, ...rest }) => rest)(formData.value)
    clearErrors()
    formState.value = 'idle'
    quoteFormStore.resetForm()
  }

  /**
   * Submit form data to Netlify Forms
   */
  async function submitForm(): Promise<boolean> {
    if (!await validateForm()) {
      return false
    }

    try {
      formState.value = 'submitting'
      clearErrors()

      const formDataToSubmit = new FormData()
      formDataToSubmit.append('form-name', 'quote')
      formDataToSubmit.append('name', formData.value.name)
      formDataToSubmit.append('email', formData.value.email)
      if (formData.value.phone) {
        formDataToSubmit.append('phone', formData.value.phone)
      }
      formDataToSubmit.append('customer_type', formData.value.customerType)
      formDataToSubmit.append('subject', formData.value.subject)
      if (formData.value.productCategory) {
        formDataToSubmit.append('product_category', formData.value.productCategory)
      }
      if (formData.value.product) {
        formDataToSubmit.append('product', formData.value.product)
      }
      if (formData.value.productId) {
        formDataToSubmit.append('product_id', formData.value.productId)
      }
      if (formData.value.size) {
        formDataToSubmit.append('size', formData.value.size)
      }
      formDataToSubmit.append('product_count', String(formData.value.productCount))
      formData.value.images?.forEach((file, index) => {
        formDataToSubmit.append(`image_${index + 1}`, file)
      })
      if (formData.value.message) {
        formDataToSubmit.append('message', formData.value.message)
      }
      formDataToSubmit.append('gdpr_consent', formData.value.gdprConsent.toString())
      formDataToSubmit.append('bot-field', '')

      // Submit to Netlify Forms
      // Note: Do not set Content-Type — browser sets it with the correct multipart boundary
      const response = await fetch('/', {
        method: 'POST',
        body: formDataToSubmit,
      })

      if (!response.ok) {
        throw new Error('Formuläret kunde inte skickas. Försök igen.')
      }

      formState.value = 'success'
      initialFormData.value = (({ images: _i, ...rest }) => rest)(formData.value)
      // Reset form after successful submission
      quoteFormStore.resetForm()
      formData.value = { ...quoteFormStore.formData }

      return true
    }
    catch (error) {
      formState.value = 'error'
      if (error instanceof Error) {
        generalError.value = error.message
      }
      else {
        generalError.value = 'Ett oväntat fel inträffade. Försök igen senare.'
      }
      return false
    }
  }

  // ===== WATCHERS =====
  /**
   * Sync formData changes to Pinia store for session persistence
   */
  watch(formData, (newData) => {
    quoteFormStore.setFormData(newData)
  }, { deep: true })

  return {
    // State
    formData,
    formState,
    fieldErrors: readonly(fieldErrors),
    generalError: readonly(generalError),

    // Computed
    isChanged,
    isSubmitting,
    isSuccess,
    isError,
    hasErrors,

    // Methods
    validateField,
    validateForm,
    getFieldError,
    clearFieldError,
    clearErrors,
    resetForm,
    submitForm,
  }
}
