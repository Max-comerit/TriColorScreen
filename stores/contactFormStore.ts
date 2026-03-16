import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContactFormData } from '~/composables/useContactForm'

// ===== CONSTANTS =====
const DB_NAME = 'tricolordb'
const STORE_NAME = 'contactForm'
const FORM_DATA_KEY = 'formData'
const IMAGE_FILE_KEY = 'imageFile'

/**
 * Contact Form Pinia Store
 *
 * Persists entire contact form data to IndexedDB for efficient storage and retrieval.
 * All form data (text fields and File objects) are stored in a single place for simplicity.
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
   * Update form data - will auto-persist to IndexedDB
   */
  function updateFormData(updates: Partial<ContactFormData>): void {
    formData.value = {
      ...formData.value,
      ...updates,
    }
    saveToIndexedDB()
  }

  /**
   * Replace entire form data
   */
  function setFormData(data: ContactFormData): void {
    formData.value = { ...data }
    saveToIndexedDB()
  }

  /**
   * Update a single field
   */
  function updateField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]): void {
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
      subject: '',
      message: '',
      image: null as File | null,
      gdprConsent: false,
    }
    saveToIndexedDB()
  }

  /**
   * Load entire form data from IndexedDB
   * Loads text fields and File object separately
   */
  async function loadFromIndexedDB(): Promise<void> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)

      // Load text fields
      const data = await new Promise<Record<string, unknown> | undefined>((resolve, reject) => {
        const request = store.get(FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })

      if (data) {
        formData.value = {
          name: (data.name as string) ?? '',
          email: (data.email as string) ?? '',
          phone: (data.phone as string) ?? '',
          customerType: (data.customerType as 'Privatperson' | 'Företag') ?? ('Privatperson' as const),
          subject: (data.subject as string) ?? '',
          message: (data.message as string) ?? '',
          gdprConsent: (data.gdprConsent as boolean) ?? false,
          image: null,
        }

        // Load File object separately
        const file = await new Promise<File | undefined>((resolve, reject) => {
          const fileRequest = store.get(IMAGE_FILE_KEY)
          fileRequest.onerror = () => reject(fileRequest.error)
          fileRequest.onsuccess = () => resolve(fileRequest.result)
        })

        if (file instanceof File) {
          formData.value.image = file
        }
      }
    } catch (error) {
      console.warn('Failed to load contact form data from IndexedDB:', error)
    }
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

      const request = indexedDB.open(DB_NAME, 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
    })
  }

  /**
   * Save entire form data to IndexedDB
   * Stores text fields separately from File object to avoid cloning issues
   */
  async function saveToIndexedDB(): Promise<void> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      // Create a serializable version without the File object
      const dataToStore = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        customerType: formData.value.customerType,
        subject: formData.value.subject,
        message: formData.value.message,
        gdprConsent: formData.value.gdprConsent,
      }

      // Store text fields
      await new Promise<void>((resolve, reject) => {
        const request = store.put(dataToStore, FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      // Store File object separately (if it exists)
      if (formData.value.image) {
        await new Promise<void>((resolve, reject) => {
          const request = store.put(formData.value.image, IMAGE_FILE_KEY)
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      }
    } catch (error) {
      console.warn('Failed to save contact form data to IndexedDB:', error)
    }
  }

  /**
   * Get previously selected image filename (for display purposes)
   */
  async function getImageFilename(): Promise<string | null> {
    try {
      const db = await getDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)

      const file = await new Promise<File | undefined>((resolve, reject) => {
        const request = store.get(IMAGE_FILE_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
      })

      return file instanceof File ? file.name : null
    } catch (error) {
      console.warn('Failed to get image filename:', error)
      return null
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

      // Delete both form data and image file
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(FORM_DATA_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(IMAGE_FILE_KEY)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      resetForm()
    } catch (error) {
      console.warn('Failed to clear contact form data from IndexedDB:', error)
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
    getImageFilename,
  }
})
