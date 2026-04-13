// composables/useQuotePrintedMatterForm.ts

/**
 * Printed Matter Form Composable
 *
 * Provides form state management, validation, and submission handling
 * for the quote printed matter form with Zod schema validation.
 */

import { z } from 'zod'
import { computed, readonly, ref, watch, toRaw } from 'vue'
import { useQuotePrintedMatterFormStore } from '~/stores/quotePrintedMatterFormStore'
import { FORM_MAX_FILE_SIZE, FORM_MAX_TOTAL_FILE_SIZE, MAX_QUOTE_PRINTED_MATTER_FILE_COUNT } from '~/constants/ui'

// ===== CONSTANTS =====
/** Allowed file MIME types */
const ALLOWED_FILE_TYPES = ['application/pdf']

// ===== ZOD SCHEMA =====
/** Printed matter form validation schema */
export const quotePrintedMatterFormSchema = z.object({
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
  subject: z.literal('Offertförfrågan (Trycksaker)'),
  productCategory: z.literal('Trycksaker'),
  product: z
    .enum(['Foldrar', 'Broschyrer', 'Affischer', 'Visitkort', 'Kuvert', 'Menyer & Bordsryttare'], {
      errorMap: () => ({ message: 'Välj en produkt' }),
    }),
  size: z
    .string()
    .max(50, 'Storlek / Format får inte vara längre än 50 tecken')
    .optional()
    .or(z.literal('')),
  material: z
    .string()
    .max(100, 'Material / Papperstyp får inte vara längre än 100 tecken')
    .optional()
    .or(z.literal('')),
  print: z
    .string()
    .max(100, 'Tryck får inte vara längre än 100 tecken')
    .optional()
    .or(z.literal('')),
  finishing: z
    .string()
    .max(100, 'Efterbehandling får inte vara längre än 100 tecken')
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
  files: z
    .array(z.custom<File>((file) => {
      if (!file) return true // Optional field
      if (!(file instanceof File)) return false
      if (file.size > FORM_MAX_FILE_SIZE) return false
      return ALLOWED_FILE_TYPES.includes(file.type)
    }, {
      message: 'Filen måste vara mindre än 7MB och i formatet PDF',
    }))
    .refine(
      (array) => array.length <= MAX_QUOTE_PRINTED_MATTER_FILE_COUNT,
      { message: `Du kan bifoga max ${MAX_QUOTE_PRINTED_MATTER_FILE_COUNT} filer` }
    )
    .refine(
      files => files.reduce((sum, f) => sum + f.size, 0) <= FORM_MAX_TOTAL_FILE_SIZE,
      { message: `Den totala filstorleken får inte överstiga ${FORM_MAX_TOTAL_FILE_SIZE / 1024 / 1024} MB` },
    )
    .nullable()
    .optional(),
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
export type QuotePrintedMatterFormData = z.infer<typeof quotePrintedMatterFormSchema>

// ===== TYPES =====

/** Form submission state */
type FormState = 'idle' | 'submitting' | 'success' | 'error'

// ===== COMPOSABLE =====
/**
 * Printed matter form composable with validation and state management
 */
export function usePrintedMatterForm() {
  // ===== STORE =====
  const quotePrintedMatterFormStore = useQuotePrintedMatterFormStore()

  // ===== STATE =====
  const formData = ref<QuotePrintedMatterFormData>({ ...quotePrintedMatterFormStore.formData })
  const initialFormData = ref<QuotePrintedMatterFormData>(JSON.parse(JSON.stringify(formData.value)))
  const formState = ref<FormState>('idle')
  const fieldErrors = ref<Map<keyof QuotePrintedMatterFormData, string>>(new Map())
  const generalError = ref<string | null>(null)

  // ===== COMPUTED =====
  /**
   * Check if form data has changed from initial state.
   * Files are not tracked in change detection as they are only handled during submission.
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
   */
  function validateField(field: keyof QuotePrintedMatterFormData): boolean {
    try {
      const fieldSchema = quotePrintedMatterFormSchema.shape[field]
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
      quotePrintedMatterFormSchema.parse(formData.value)
      fieldErrors.value.clear()
      generalError.value = null
      return true
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        fieldErrors.value.clear()
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof QuotePrintedMatterFormData
          fieldErrors.value.set(field, err.message)
        })
      }
      return false
    }
  }

  /**
   * Get error message for a specific field
   */
  function getFieldError(field: keyof QuotePrintedMatterFormData): string | undefined {
    return fieldErrors.value.get(field)
  }

  /**
   * Clear error for a specific field
   */
  function clearFieldError(field: keyof QuotePrintedMatterFormData): void {
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
   * Prop-injected fields (subject, productCategory, product, files) are preserved by the store.
   */
  function resetForm(): void {
    formData.value.name = ''
    formData.value.email = ''
    formData.value.phone = ''
    formData.value.customerType = '' as 'Privatperson' | 'Företag'
    // subject and productCategory are intentionally NOT reset —
    // they are controlled by the parent component via props.
    formData.value.product = '' as 'Foldrar' | 'Broschyrer' | 'Affischer' | 'Visitkort' | 'Kuvert' | 'Menyer & Bordsryttare'
    formData.value.size = ''
    formData.value.material = ''
    formData.value.print = ''
    formData.value.finishing = ''
    formData.value.productCount = undefined as unknown as number
    formData.value.files = null
    formData.value.message = ''
    formData.value.gdprConsent = false
    initialFormData.value = JSON.parse(JSON.stringify(formData.value))
    clearErrors()
    formState.value = 'idle'
    quotePrintedMatterFormStore.resetForm()
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
      formDataToSubmit.append('form-name', 'quote-printed-matter')
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
      if (formData.value.size) {
        formDataToSubmit.append('size', formData.value.size)
      }
      if (formData.value.material) {
        formDataToSubmit.append('material', formData.value.material)
      }
      if (formData.value.print) {
        formDataToSubmit.append('print', formData.value.print)
      }
      if (formData.value.finishing) {
        formDataToSubmit.append('finishing', formData.value.finishing)
      }
      formDataToSubmit.append('product_count', String(formData.value.productCount))
      formData.value.files?.forEach((file, index) => {
        // toRaw unwraps Vue's reactive Proxy — FormData.append uses internal-slot
        // brand checks that fail on Proxy-wrapped File/Blob objects.
        formDataToSubmit.append(`file_${index + 1}`, toRaw(file))
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
      initialFormData.value = JSON.parse(JSON.stringify(formData.value))
      // Reset form after successful submission
      quotePrintedMatterFormStore.resetForm()
      formData.value = { ...quotePrintedMatterFormStore.formData }

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
    quotePrintedMatterFormStore.setFormData(newData)
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
