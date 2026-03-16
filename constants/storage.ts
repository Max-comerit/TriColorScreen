/**
 * Storage Configuration
 *
 * Centralized constants for IndexedDB and form storage management
 */

// ===== INDEXEDDB CONFIGURATION =====
export const STORAGE = {
  // Database configuration
  DB_NAME: 'tricolordb',
  DB_VERSION: 2,

  // Object store names
  STORES: {
    CONTACT_FORM: 'contactForm',
    QUOTE_FORM: 'quoteForm',
  },

  // Keys for contact form storage
  CONTACT_FORM: {
    FORM_DATA_KEY: 'formData',
    IMAGE_FILE_KEY: 'imageFile',
  },

  // Keys for quote form storage
  QUOTE_FORM: {
    FORM_DATA_KEY: 'formData',
  },
} as const
