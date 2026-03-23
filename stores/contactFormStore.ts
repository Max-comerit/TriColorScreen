import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContactFormData } from '~/types/Forms'

/**
 * Contact Form Pinia Store
 *
 * Manages contact form state with reactivity using Vue 3 composition API.
 */
export const useContactFormStore = defineStore('contactForm', () => {
  // ===== STATE =====
  const formData = ref<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    customerType: '' as 'Privatperson' | 'Företag',
    subject: '',
    message: '',
    image: null as File | null,
    gdprConsent: false,
  })

  // ===== ACTIONS =====
  /**
   * Update form data
   */
  function updateFormData(updates: Partial<ContactFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: ContactFormData): void {
    formData.value = { ...data }
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]): void {
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
      subject: '',
      message: '',
      image: null as File | null,
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
