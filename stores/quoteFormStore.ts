import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QuoteFormData } from '~/composables/useQuoteForm'

/**
 * Quote Form Pinia Store
 *
 * Manages quote form state with reactivity using Vue 3 composition API.
 */
export const useQuoteFormStore = defineStore('quoteForm', () => {
  // ===== STATE =====
  const formData = ref<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: '' as 'Privatperson' | 'Företag',
    subject: 'Offertförfrågan',
    productCategory: '',
    product: '',
    productId: '',
    size: '',
    productCount: undefined as unknown as number,
    images: [],
    message: '',
    gdprConsent: false,
  })

  // ===== ACTIONS =====
  /**
   * Update form data
   */
  function updateFormData(updates: Partial<QuoteFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: QuoteFormData): void {
    formData.value = { ...data }
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof QuoteFormData>(field: K, value: QuoteFormData[K]): void {
    formData.value[field] = value
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
      subject: 'Offertförfrågan',
      productCategory: '',
      product: '',
      productId: '',
      size: '',
      productCount: undefined as unknown as number,
      images: [],
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
