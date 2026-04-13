import { defineStore } from 'pinia'
import { ref } from 'vue'

// Lazy-load QuotePrintedMatterFormData type - composable is only imported when actually used
type QuotePrintedMatterFormData = import('~/composables/useQuotePrintedMatterForm').QuotePrintedMatterFormData

/**
 * Quote Printed Matter Form Pinia Store
 *
 * Manages printed matter form state with reactivity using Vue 3 composition API.
 */
export const useQuotePrintedMatterFormStore = defineStore('quotePrintedMatterForm', () => {
  // ===== STATE =====
  const formData = ref<QuotePrintedMatterFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: '' as 'Privatperson' | 'Företag',
    subject: 'Offertförfrågan (Trycksaker)',
    productCategory: 'Trycksaker',
    product: '',
    size: '',
    material: '',
    print: '',
    finishing: '',
    productCount: undefined as unknown as number,
    files: null,
    message: '',
    gdprConsent: false,
  })

  // ===== ACTIONS =====
  /**
   * Update form data
   */
  function updateFormData(updates: Partial<QuotePrintedMatterFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: QuotePrintedMatterFormData): void {
    formData.value = { ...data }
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof QuotePrintedMatterFormData>(field: K, value: QuotePrintedMatterFormData[K]): void {
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
      product: '',
      size: '',
      material: '',
      print: '',
      finishing: '',
      productCount: undefined as unknown as number,
      files: null,
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
