import { defineStore } from 'pinia'

// Lazy-load QuoteTextilesFormData type - composable is only imported when actually used
type QuoteTextilesFormData = import('~/composables/useQuoteTextilesForm').QuoteTextilesFormData

/**
 * Quote Textiles Form Pinia Store
 *
 * Manages quote textiles form state with reactivity using Vue 3 composition API.
 */
export const useQuoteTextilesFormStore = defineStore('quoteTextilesForm', () => {
  // ===== STATE =====
  const formData = ref<QuoteTextilesFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: '' as 'Privatperson' | 'Företag',
    subject: 'Offertförfrågan (Textil, Reklam och Bildekor)',
    productCategory: '',
    product: '',
    productId: '',
    size: '',
    productCount: undefined as unknown as number,
    images: [],
    canvasTexts: '',
    message: '',
    gdprConsent: false,
  })

  // ===== ACTIONS =====
  /**
   * Update form data
   */
  function updateFormData(updates: Partial<QuoteTextilesFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: QuoteTextilesFormData): void {
    formData.value = { ...data }
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof QuoteTextilesFormData>(field: K, value: QuoteTextilesFormData[K]): void {
    formData.value[field] = value
  }

  /**
   * Reset form to initial state.
   * Preserves subject, productCategory, and product as they are controlled by parent.
   */
  function resetForm(): void {
    formData.value = {
      name: '',
      email: '',
      phone: '',
      customerType: '' as 'Privatperson' | 'Företag',
      subject: formData.value.subject,
      productCategory: formData.value.productCategory,
      product: formData.value.product,
      productId: '',
      size: '',
      productCount: undefined as unknown as number,
      images: [],
      canvasTexts: '',
      message: '',
      gdprConsent: false,
    }
  }



  return {
    // ===== STATE =====
    formData,

    // ===== ACTIONS =====
    updateFormData,
    setFormData,
    updateField,
    resetForm,
  }
})
