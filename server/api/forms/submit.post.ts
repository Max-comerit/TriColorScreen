/**
 * API endpoint for handling form submissions locally during development
 * Routes to /api/forms/submit
 * 
 * This is a fallback for local testing - in production, Netlify Forms handles this.
 * Includes a simulated network delay to mimic real network latency.
 * 
 * IMPORTANT: This endpoint only works in development mode.
 * In production, form submissions are handled by Netlify Forms at the / endpoint.
 */

import { DEV_FORM_SUBMISSION_DELAY } from '~/constants/ui'

export default defineEventHandler(async (event) => {
  // Block access in production - this endpoint is dev-only
  if (!import.meta.dev) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    })
  }

  try {
    const formData = await readFormData(event)
    const formName = formData.get('form-name')

    // Simulate network latency for testing
    await new Promise(resolve => setTimeout(resolve, DEV_FORM_SUBMISSION_DELAY))

    // Log the submission for debugging
    console.log(`✅ Form submitted locally: ${formName}`)
    console.log(`   Fields: ${Array.from(formData.keys()).join(', ')}`)

    // In production, this would be handled by Netlify Forms
    // For local testing, we just acknowledge it
    return {
      success: true,
      message: 'Formuläret mottogs (lokal testning)',
      formName,
    }
  } catch (error) {
    console.error('❌ Form submission error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form submission',
    })
  }
})
