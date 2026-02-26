// composables/useQuoteForm.ts

/**
 * Quote Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the quote request form with Zod schema validation.
 */

import { z } from 'zod'

// ===== CONSTANTS =====
/** Maximum file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024

/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// ===== ZOD SCHEMA =====
/** Quote form validation schema */
export const quoteFormSchema = z.object({
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
    .regex(/^(\+\d{1,3})?[\s]*-?[\s]*(\(?\d{1,4}\)?)?[\s]*-?[\s]*\d[\d\s-]{5,14}$/, 'Ange ett giltigt telefonnummer')
    .optional()
    .or(z.literal('')),
  customerType: z
    .enum(['person', 'company'], {
      errorMap: () => ({ message: 'Välj om du är privatperson eller företag' }),
    }),
  subject: z.literal('Offert förfrågan'),
  productCategory: z
    .string()
    .optional()
    .or(z.literal('')),
  product: z
    .string()
    .optional()
    .or(z.literal('')),
  productCount: z
    .number({
      required_error: 'Ange antal',
      invalid_type_error: 'Ange ett giltigt antal',
    })
    .int('Antal måste vara ett heltal')
    .min(1, 'Antal måste vara minst 1')
    .max(10000, 'Antal får inte vara mer än 10 000'),
  images: z
    .array(z.custom<File>((file) => {
      if (!file) return true // Optional field
      if (!(file instanceof File)) return false
      if (file.size > MAX_FILE_SIZE) return false
      return ALLOWED_IMAGE_TYPES.includes(file.type)
    }, {
      message: 'Bilden måste vara mindre än 5MB och i formatet JPEG, PNG, WebP eller GIF',
    }))
    .optional()
    .nullable(),
  message: z
    .string()
    .max(2000, 'Meddelandet får inte vara längre än 2000 tecken')
    .optional()
    .or(z.literal('')),
  gdprConsent: z
    .boolean()
    .refine(val => val === true, {
      message: 'Du måste godkänna behandling av personuppgifter',
    }),
})

/** TypeScript type from Zod schema */
export type QuoteFormData = z.infer<typeof quoteFormSchema>

// ===== TYPES =====

/** Form field error type */
export interface FormFieldError<T> {
  field: keyof T
  message: string
}

/** Form submission state */
type FormState = 'idle' | 'submitting' | 'success' | 'error'

// ===== COMPOSABLE =====
/**
 * Quote form composable with validation and state management
 */
export function useQuoteForm() {
  // ===== STATE =====
  const formData = ref<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: undefined as unknown as 'person' | 'company',
    subject: 'Offert förfrågan',
    productCategory: '',
    product: '',
    productCount: undefined as unknown as number,
    images: [],
    message: '',
    gdprConsent: false,
  })

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
   */
  function validateField(field: keyof QuoteFormData): boolean {
    try {
      const fieldSchema = quoteFormSchema.shape[field]
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
      quoteFormSchema.parse(formData.value)
      fieldErrors.value.clear()
      generalError.value = null
      return true
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.value.clear()
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof QuoteFormData
          fieldErrors.value.set(field, err.message)
        })
      }
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
   * Prop-injected fields (subject, productCategory, product, files) are preserved.
   */
  function resetForm(): void {
    formData.value.name = ''
    formData.value.email = ''
    formData.value.phone = ''
    formData.value.customerType = undefined as unknown as 'person' | 'company'
    formData.value.productCount = undefined as unknown as number
    formData.value.message = ''
    formData.value.gdprConsent = false
    // subject, productCategory, product and images are intentionally NOT reset —
    // they are controlled by the parent component via props.
    initialFormData.value = (({ images: _i, ...rest }) => rest)(formData.value)
    clearErrors()
    formState.value = 'idle'
  }

  /**
   * Submit form data to Netlify Forms
   */
  async function submitForm(): Promise<boolean> {
    if (!validateForm()) {
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
      formDataToSubmit.append('product_count', String(formData.value.productCount))
      formData.value.images?.forEach((file, index) => {
        formDataToSubmit.append(`image_${index + 1}`, file)
        console.log(`Appending file to FormData: image_${index + 1} - ${file.name} (${file.size} bytes)`)
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
