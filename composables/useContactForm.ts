/**
 * Contact Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the contact form with Zod schema validation.
 */

import { z } from 'zod'

// ===== CONSTANTS =====
/** Maximum file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024

/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// ===== ZOD SCHEMA =====
/** Contact form validation schema */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Namnet måste vara minst 2 tecken')
    .max(100, 'Namnet får inte vara längre än 100 tecken'),
  email: z
    .string()
    .email('Ange en giltig e-postadress')
    .min(1, 'E-post är obligatoriskt'),
  phone: z
    .string()
    .regex(/^(\+46|0)[1-9][\d\s-]{7,11}$/, 'Ange ett giltigt svenskt telefonnummer')
    .optional()
    .or(z.literal('')),
  customerType: z
    .enum(['person', 'company'], {
      errorMap: () => ({ message: 'Välj om du är privatperson eller företag' }),
    }),
  subject: z
    .string()
    .min(3, 'Ämnet måste vara minst 3 tecken')
    .max(200, 'Ämnet får inte vara längre än 200 tecken'),
  message: z
    .string()
    .max(2000, 'Meddelandet får inte vara längre än 2000 tecken')
    .optional()
    .or(z.literal('')),
  image: z
    .custom<File>((file) => {
      if (!file) return true // Optional field
      if (!(file instanceof File)) return false
      if (file.size > MAX_FILE_SIZE) return false
      return ALLOWED_IMAGE_TYPES.includes(file.type)
    }, {
      message: 'Bilden måste vara mindre än 5MB och i formatet JPEG, PNG, WebP eller GIF',
    })
    .optional()
    .nullable(),
  gdprConsent: z
    .boolean()
    .refine(val => val === true, {
      message: 'Du måste godkänna behandling av personuppgifter',
    }),
})

/** TypeScript type from Zod schema */
export type ContactFormData = z.infer<typeof contactFormSchema>

// ===== TYPES =====
/** Form field error type */
export interface FormFieldError {
  field: keyof ContactFormData
  message: string
}

/** Form submission state */
export type FormState = 'idle' | 'submitting' | 'success' | 'error'

// ===== COMPOSABLE =====
/**
 * Contact form composable with validation and state management
 */
export function useContactForm() {
  // ===== STATE =====
  const formData = ref<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: undefined as unknown as 'person' | 'company',
    subject: '',
    message: '',
    image: null as File | null,
    gdprConsent: false,
  })

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
   * Check if form has any validation errors
   */
  const hasErrors = computed(() => fieldErrors.value.size > 0 || generalError.value !== null)

  // ===== METHODS =====
  /**
   * Validate a single field
   */
  function validateField(field: keyof ContactFormData): boolean {
    try {
      const fieldSchema = contactFormSchema.shape[field]
      fieldSchema.parse(formData.value[field])
      fieldErrors.value.delete(field)
      return true
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.value.set(field, error.errors[0].message)
      }
      return false
    }
  }

  /**
   * Validate entire form
   */
  function validateForm(): boolean {
    try {
      contactFormSchema.parse(formData.value)
      fieldErrors.value.clear()
      generalError.value = null
      return true
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.value.clear()
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ContactFormData
          fieldErrors.value.set(field, err.message)
        })
      }
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
      customerType: undefined as unknown as 'person' | 'company',
      subject: '',
      message: '',
      image: null as File | null,
      gdprConsent: false,
    }
    initialFormData.value = JSON.parse(JSON.stringify(formData.value))
    clearErrors()
    formState.value = 'idle'
  }

  /**
   * Submit form data to Netlify Forms
   */
  async function submitForm(): Promise<boolean> {
    // Validate form before submission
    if (!validateForm()) {
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

      // Submit to Netlify Forms
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
