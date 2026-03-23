// utils/validation/quoteFormValidation.ts

/**
 * Quote Form Validation
 *
 * Zod schema and validation logic for quote form.
 * Dynamically imported to keep Zod out of initial bundle.
 */

import { z } from 'zod'
import type { QuoteFormData } from '~/types/Forms'

// ===== CONSTANTS =====
/** Maximum file size: 7MB */
const MAX_FILE_SIZE = 7 * 1024 * 1024

/** Maximum number of images allowed */
export const MAX_IMAGE_COUNT = 16

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
    .enum(['Privatperson', 'Företag'], {
      errorMap: () => ({ message: 'Välj om du är privatperson eller företag' }),
    }),
  subject: z.literal('Offertförfrågan'),
  productCategory: z
    .string()
    .optional()
    .or(z.literal('')),
  product: z
    .string()
    .optional()
    .or(z.literal('')),
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
  images: z
    .array(z.custom<File>((file) => {
      if (!file) return true // Optional field
      if (!(file instanceof File)) return false
      if (file.size > MAX_FILE_SIZE) return false
      return ALLOWED_IMAGE_TYPES.includes(file.type)
    }, {
      message: 'Bilden måste vara mindre än 7MB och i formatet JPEG, PNG, WebP eller GIF',
    }))
    .max(MAX_IMAGE_COUNT, { message: `Maximalt ${MAX_IMAGE_COUNT} bilder kan bifogas` })
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

// Type is imported from ~/types/Forms to keep types separate from validation logic

// ===== VALIDATION FUNCTIONS =====

/**
 * Validate a single field
 */
export function validateField(field: keyof QuoteFormData, formData: Partial<QuoteFormData>): { valid: boolean; error?: string } {
  try {
    const fieldSchema = quoteFormSchema.shape[field]
    fieldSchema.parse(formData[field])
    return { valid: true }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: 'Validation failed' }
  }
}

/**
 * Validate entire form
 */
export function validateForm(formData: Partial<QuoteFormData>): { valid: boolean; errors: Map<keyof QuoteFormData, string> } {
  const errors = new Map<keyof QuoteFormData, string>()

  try {
    quoteFormSchema.parse(formData)
    return { valid: true, errors }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof QuoteFormData
        errors.set(field, err.message)
      })
    }
    return { valid: false, errors }
  }
}
