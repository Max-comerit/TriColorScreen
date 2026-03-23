// utils/validation/contactFormValidation.ts

/**
 * Contact Form Validation
 *
 * Zod schema and validation logic for contact form.
 * Dynamically imported to keep Zod out of initial bundle.
 */

import { z } from 'zod'
import type { ContactFormData } from '~/types/Forms'

// ===== CONSTANTS =====
/** Maximum file size: 7MB */
const MAX_FILE_SIZE = 7 * 1024 * 1024

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
    .regex(/^(\+\d{1,3})?[\s]*-?[\s]*(\(?\d{1,4}\)?)?[\s]*-?[\s]*\d[\d\s-]{5,14}$/, 'Ange ett giltigt telefonnummer')
    .optional()
    .or(z.literal('')),
  customerType: z
    .enum(['Privatperson', 'Företag'], {
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
      message: 'Bilden måste vara mindre än 7MB och i formatet JPEG, PNG, WebP eller GIF',
    })
    .optional()
    .nullable(),
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
export function validateField(field: keyof ContactFormData, formData: Partial<ContactFormData>): { valid: boolean; error?: string } {
  try {
    const fieldSchema = contactFormSchema.shape[field]
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
export function validateForm(formData: Partial<ContactFormData>): { valid: boolean; errors: Map<keyof ContactFormData, string> } {
  const errors = new Map<keyof ContactFormData, string>()

  try {
    contactFormSchema.parse(formData)
    return { valid: true, errors }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData
        errors.set(field, err.message)
      })
    }
    return { valid: false, errors }
  }
}
