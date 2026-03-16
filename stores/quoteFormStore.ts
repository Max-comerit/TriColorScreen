import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE } from '~/constants/storage'
import type { QuoteFormData } from '~/composables/useQuoteForm'

// ===== CONSTANTS =====
const DB_NAME = STORAGE.DB_NAME
const DB_VERSION = STORAGE.DB_VERSION
const STORE_NAME = STORAGE.STORES.QUOTE_FORM
const FORM_DATA_KEY = STORAGE.QUOTE_FORM.FORM_DATA_KEY

/**
 * Quote Form Pinia Store
 *
 * Persists quote form data to IndexedDB so users don't lose their input
 * when navigating away from the custom-design page.
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
   * Update form data - will auto-persist to IndexedDB
   */
  function updateFormData(updates: Partial<QuoteFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
    saveToIndexedDB()
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: QuoteFormData): void {
    formData.value = { ...data }
    saveToIndexedDB()
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof QuoteFormData>(field: K, value: QuoteFormData[K]): void {
    formData.value[field] = value
    saveToIndexedDB()
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
    saveToIndexedDB()
  }

  /**
   * Get IndexedDB database instance
   */
  function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'))
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORAGE.STORES.QUOTE_FORM)) {
          db.createObjectStore(STORAGE.STORES.QUOTE_FORM)
        }
        // Also ensure contactForm store exists
        if (!db.objectStoreNames.contains(STORAGE.STORES.CONTACT_FORM)) {
          db.createObjectStore(STORAGE.STORES.CONTACT_FORM)
        }
      }
    })
  }

  /**
   * Load form data from IndexedDB
   */
  async function loadFromIndexedDB(): Promise<void> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)

      const data = await new Promise<Record<string, unknown> | undefined>((resolve, reject) => {
        const request = store.get(FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })

      if (data) {
        formData.value = {
          ...formData.value,
          name: (data.name as string) ?? '',
          email: (data.email as string) ?? '',
          phone: (data.phone as string) ?? '',
          customerType: (data.customerType as 'Privatperson' | 'Företag') ?? ('Privatperson' as const),
          subject: ((data.subject as string) ?? 'Offertförfrågan') as 'Offertförfrågan',
          productCategory: (data.productCategory as string) ?? '',
          product: (data.product as string) ?? '',
          productId: (data.productId as string) ?? '',
          size: (data.size as string) ?? '',
          productCount: (data.productCount as number) ?? undefined,
          message: (data.message as string) ?? '',
          gdprConsent: (data.gdprConsent as boolean) ?? false,
          // Note: images array is reset to empty by design
          // Images are collected fresh from the canvas when form is focused, not persisted
          images: [],
        }
      }
    } catch (error) {
      console.warn('Failed to load quote form data from IndexedDB:', error)
    }
  }

  /**
   * Save form data to IndexedDB
   */
  async function saveToIndexedDB(): Promise<void> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      // Create a serializable version without File objects
      const dataToStore = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        customerType: formData.value.customerType,
        subject: formData.value.subject,
        productCategory: formData.value.productCategory,
        product: formData.value.product,
        productId: formData.value.productId,
        size: formData.value.size,
        productCount: formData.value.productCount,
        message: formData.value.message,
        gdprConsent: formData.value.gdprConsent,
      }

      await new Promise<void>((resolve, reject) => {
        const request = store.put(dataToStore, FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.warn('Failed to save quote form data to IndexedDB:', error)
    }
  }

  /**
   * Clear all form data from IndexedDB
   */
  async function clearFromIndexedDB(): Promise<void> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      resetForm()
    } catch (error) {
      console.warn('Failed to clear quote form data from IndexedDB:', error)
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
    loadFromIndexedDB,
    saveToIndexedDB,
    clearFromIndexedDB,
  }
})
