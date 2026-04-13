// constants/ui.ts

/**
 * Tap/click animation time in milliseconds
 * Should be kept in sync with --tap-duration CSS variable in assets/css/variables.css
 */
export const TAP_ANIMATION_TIME = 200 // ms

// ===== Form file upload limits =====

/** Maximum file size per file for form uploads: 7MB */
export const FORM_MAX_FILE_SIZE = 7 * 1024 * 1024

/** Maximum total upload size per form submission: 7MB (Netlify Forms limit) */
export const FORM_MAX_TOTAL_FILE_SIZE = 7 * 1024 * 1024

/** Maximum number of images allowed in the contact form */
export const MAX_CONTACT_IMAGE_COUNT = 10

/** Maximum number of images allowed in the quote textiles form */
export const MAX_QUOTE_TEXTILES_IMAGE_COUNT = 16

/** Maximum number of files allowed in the quote printed matter form */
export const MAX_QUOTE_PRINTED_MATTER_FILE_COUNT = 16
