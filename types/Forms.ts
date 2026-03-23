/**
 * Form Type Definitions
 *
 * Centralized types for form data shapes across the application.
 * These are kept separate from validation logic to prevent bundling Zod
 * with components that only need the types for TypeScript.
 */

// ===== CONTACT FORM =====
export interface ContactFormData {
  name: string
  email: string
  phone: string
  customerType: 'Privatperson' | 'Företag'
  subject: string
  message: string
  image: File | null
  gdprConsent: boolean
}

// ===== QUOTE FORM =====
export interface QuoteFormData {
  name: string
  email: string
  phone: string
  customerType: 'Privatperson' | 'Företag'
  subject: 'Offertförfrågan'
  productCategory?: string
  product?: string
  productId?: string
  size?: string
  productCount: number
  images: File[] | null
  message: string
  gdprConsent: boolean
}

// ===== FORM STATE =====
export type FormState = 'idle' | 'submitting' | 'success' | 'error'
