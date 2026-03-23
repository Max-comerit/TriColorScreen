// composables/useContactForm.ts

/**
 * Contact Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the contact form with Zod schema validation.
 * 
 * Note: Zod validation is dynamically imported to keep it out of the critical bundle.
 */

import { useContactFormStore } from '~/stores/contactFormStore'
import type { ContactFormData, FormState } from '~/types/Forms'

// ===== COMPOSABLE =====
/**
 * Contact form composable with validation and state management
 */
export function useContactForm() {
  // ===== STORE =====
  const contactFormStore = useContactFormStore()

  // ===== STATE =====
  const formData = ref<ContactFormData>({ ...contactFormStore.formData })
  const initialFormData = ref<ContactFormData>(JSON.parse(JSON.stringify(formData.value)))
  const formState = ref<FormState>('idle')
  const fieldErrors = ref<Map<keyof ContactFormData, string>>(new Map())
  const generalError = ref<string | null>(null)

  // ===== COMPUTED =====
  /**
   * Check if form data has changed from initial state
   */
  const isChanged = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialFormData.value)
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
  async function validateField(field: keyof ContactFormData): Promise<boolean> {
    try {
      const { validateField: validate } = await import('~/utils/validation/contactFormValidation')
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
      const { validateForm: validate } = await import('~/utils/validation/contactFormValidation')
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
  function getFieldError(field: keyof ContactFormData): string | undefined {
    return fieldErrors.value.get(field)
  }

  /**
   * Clear error for a specific field
   */
  function clearFieldError(field: keyof ContactFormData): void {
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
   * Reset form to initial state
   */
  function resetForm(): void {
    formData.value = {
      name: '',
      email: '',
      phone: '',
      customerType: '' as 'Privatperson' | 'Företag',
      subject: '',
      message: '',
      image: null as File | null,
      gdprConsent: false,
    }
    initialFormData.value = JSON.parse(JSON.stringify(formData.value))
    clearErrors()
    formState.value = 'idle'
    contactFormStore.resetForm()
  }

  /**
   * Submit form data to Netlify Forms
   */
  async function submitForm(): Promise<boolean> {
    // Validate form before submission
    if (!await validateForm()) {
      return false
    }

    try {
      formState.value = 'submitting'
      clearErrors()

      // Prepare form data for Netlify submission
      const formDataToSubmit = new FormData()
      formDataToSubmit.append('form-name', 'contact')
      formDataToSubmit.append('name', formData.value.name)
      formDataToSubmit.append('email', formData.value.email)
      if (formData.value.phone) {
        formDataToSubmit.append('phone', formData.value.phone)
      }
      formDataToSubmit.append('customer_type', formData.value.customerType)
      formDataToSubmit.append('subject', formData.value.subject)
      if (formData.value.message) {
        formDataToSubmit.append('message', formData.value.message)
      }
      if (formData.value.image) {
        formDataToSubmit.append('image', formData.value.image)
      }
      formDataToSubmit.append('gdpr_consent', formData.value.gdprConsent.toString())
      formDataToSubmit.append('bot-field', '') // Honeypot field for spam protection

      // Submit to Netlify Forms at root (Netlify processes all forms at /)
      // Note: Don't set Content-Type header - browser will set it correctly for multipart/form-data with boundary
      const response = await fetch('/', {
        method: 'POST',
        body: formDataToSubmit,
      })

      if (!response.ok) {
        throw new Error('Formuläret kunde inte skickas. Försök igen.')
      }

      // Success
      formState.value = 'success'
      initialFormData.value = JSON.parse(JSON.stringify(formData.value))
      // Reset form after successful submission
      contactFormStore.resetForm()
      formData.value = { ...contactFormStore.formData }

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
    contactFormStore.setFormData(newData)
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
