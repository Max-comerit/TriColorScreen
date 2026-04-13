// composables/useQuoteTextilesForm.ts

/**
 * Quote Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the quote textiles form with Zod schema validation.
 */

import { z } from 'zod'
import { useQuoteTextilesFormStore } from '~/stores/quoteTextilesFormStore'
import { FORM_MAX_FILE_SIZE, FORM_MAX_TOTAL_FILE_SIZE, MAX_QUOTE_TEXTILES_IMAGE_COUNT } from '~/constants/ui'

// ===== CONSTANTS =====
/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// ===== ZOD SCHEMA =====
/** Quote form validation schema */
export const quoteTextilesFormSchema = z.object({
  subject: z.literal('Offertförfrågan (Textil, Reklam och Bildekor)'),
  productCategory: z
    .string()
    .optional()
    .or(z.literal('')),
  product: z
    .string()
    .optional()
    .or(z.literal('')),
  images: z
    .array(z.custom<File>((file) => {
      if (!file) return true // Optional field
      if (!(file instanceof File)) return false
      if (file.size > FORM_MAX_FILE_SIZE) return false
      return ALLOWED_IMAGE_TYPES.includes(file.type)
    }, {
      message: 'Bilden måste vara mindre än 7MB och i formatet JPEG, PNG, WebP, GIF eller SVG',
    }))
    .refine(
      (array) => array.length <= MAX_QUOTE_TEXTILES_IMAGE_COUNT,
      { message: `Du kan bifoga max ${MAX_QUOTE_TEXTILES_IMAGE_COUNT} bilder` }
    )
    .refine(
      files => files.reduce((sum, f) => sum + f.size, 0) <= FORM_MAX_TOTAL_FILE_SIZE,
      { message: `Den totala filstorleken får inte överstiga ${FORM_MAX_TOTAL_FILE_SIZE / 1024 / 1024} MB` },
    )
    .nullable()
    .optional(),
  canvasTexts: z.string().optional(),
  productId: z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/, 'Produkt ID får endast innehålla bokstäver, siffror, _ och -')
    .max(20, 'Produkt ID får inte vara längre än 20 tecken')
    .optional()
    .or(z.literal('')),
  size: z
    .string()
    .regex(/^[A-Za-z0-9.,/\-xX]+$/, 'Storlek får endast innehålla bokstäver, siffror, . , / och -')
    .max(10, 'Storlek får inte vara längre än 10 tecken')
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
  message: z
    .string()
    .max(2000, 'Meddelandet får inte vara längre än 2000 tecken')
    .optional()
    .or(z.literal('')),
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
    .enum(['Privatperson', 'Företag'], {
      errorMap: () => ({ message: 'Välj om du är privatperson eller företag' }),
    }),
  gdprConsent: z
    .boolean()
    .refine(val => val === true, {
      message: 'Du måste godkänna behandling av personuppgifter',
    }),
})

/** TypeScript type from Zod schema */
export type QuoteTextilesFormData = z.infer<typeof quoteTextilesFormSchema>

// ===== TYPES =====

/** Form submission state */
type FormState = 'idle' | 'submitting' | 'success' | 'error'

// ===== COMPOSABLE =====
/**
 * Quote form composable with validation and state management
 */
export function useQuoteTextilesForm() {
  // ===== STORE =====
  const quoteTextilesFormStore = useQuoteTextilesFormStore()

  // ===== STATE =====
  const formData = ref<QuoteTextilesFormData>({ ...quoteTextilesFormStore.formData })
  const initialFormData = ref<Omit<QuoteTextilesFormData, 'images' | 'canvasTexts'>>(
    (({ images: _i, canvasTexts: _ct, ...rest }) => rest)(formData.value),
  )
  const formState = ref<FormState>('idle')
  const fieldErrors = ref<Map<keyof QuoteTextilesFormData, string>>(new Map())
  const generalError = ref<string | null>(null)

  // ===== COMPUTED =====
  /**
   * Check if user-editable form data has changed from initial state.
   * Files are excluded because they are prop-injected and cannot be serialised.
   */
  const isChanged = computed(() => {
    const editableData = (({ images: _i, canvasTexts: _ct, ...rest }) => rest)(formData.value)
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
  function validateField(field: keyof QuoteTextilesFormData): boolean {
    try {
      const fieldSchema = quoteTextilesFormSchema.shape[field]
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
      quoteTextilesFormSchema.parse(formData.value)
      fieldErrors.value.clear()
      generalError.value = null
      return true
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.value.clear()
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof QuoteTextilesFormData
          fieldErrors.value.set(field, err.message)
        })
      }
      return false
    }
  }

  /**
   * Get error message for a specific field
   */
  function getFieldError(field: keyof QuoteTextilesFormData): string | undefined {
    return fieldErrors.value.get(field)
  }

  /**
   * Clear error for a specific field
   */
  function clearFieldError(field: keyof QuoteTextilesFormData): void {
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
    formData.value.canvasTexts = ''
    formData.value.message = ''
    formData.value.gdprConsent = false
    initialFormData.value = (({ images: _i, canvasTexts: _ct, ...rest }) => rest)(formData.value)
    clearErrors()
    formState.value = 'idle'
    quoteTextilesFormStore.resetForm()
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
      formDataToSubmit.append('form-name', 'quote-textiles')
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
        // toRaw unwraps Vue's reactive Proxy — FormData.append uses internal-slot
        // brand checks that fail on Proxy-wrapped File/Blob objects.
        formDataToSubmit.append(`image_${index + 1}`, toRaw(file))
      })
      if (formData.value.message) {
        formDataToSubmit.append('message', formData.value.message)
      }
      formDataToSubmit.append('gdpr_consent', formData.value.gdprConsent.toString())
      if (formData.value.canvasTexts) {
        formDataToSubmit.append('texter', formData.value.canvasTexts)
      }
      formDataToSubmit.append('bot-field', '')

      // Determine submission endpoint based on environment
      // Local development: use /api/forms/submit (logs submission)
      // Production: use Netlify Forms endpoint at /
      const endpoint = import.meta.dev ? '/api/forms/submit' : '/'

      // Submit to Netlify Forms or local endpoint
      // Note: Do not set Content-Type — browser sets it with the correct multipart boundary
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formDataToSubmit,
      })

      if (!response.ok) {
        throw new Error('Formuläret kunde inte skickas. Försök igen.')
      }

      formState.value = 'success'
      initialFormData.value = (({ images: _i, ...rest }) => rest)(formData.value)
      // Reset form after successful submission
      quoteTextilesFormStore.resetForm()
      formData.value = { ...quoteTextilesFormStore.formData }

      return true
    }
    catch (error) {
      formState.value = 'error'
      if (error instanceof Error) {
        console.error('Form submission error:', error.message)
      }

      generalError.value = 'Ett oväntat fel inträffade. Försök igen senare.'

      return false
    }
  }

  // ===== WATCHERS =====
  /**
   * Sync formData changes to Pinia store for session persistence
   */
  watch(formData, (newData) => {
    quoteTextilesFormStore.setFormData(newData)
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
