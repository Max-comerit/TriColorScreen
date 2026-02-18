/**
 * Suppress specific Vue warnings in development
 * Filters out the warning from Nuxt devtools overlay component
 */
export default defineNuxtPlugin(({ vueApp }) => {
  if (import.meta.dev) {
    const originalWarn = console.warn
    
    // Override console.warn to suppress devtools overlay warning
    console.warn = function(...args) {
      const msg = args[0]
      const msgStr = String(msg)
      
      // Suppress the specific warning about extraneous attributes with z-index: 999999
      // This comes from the Nuxt devtools overlay component
      if (
        msgStr.includes('Extraneous non-props attributes') &&
        msgStr.includes('style')
      ) {
        return
      }
      
      // Call original warn for all other warnings
      originalWarn.apply(console, args)
    }
  }
})
