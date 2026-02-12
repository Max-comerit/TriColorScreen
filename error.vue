<script setup lang="ts">
// ===== IMPORTS =====
import { computed } from 'vue'
import type { NuxtError } from '#app'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import Section from '~/components/common/Section.vue'

// ===== PROPS & EMITS =====
interface Props {
  /** Error object passed from Nuxt error boundary */
  error: NuxtError
}

const props = defineProps<Props>()

// ===== COMPOSABLES & STORES =====
/**
 * Set page metadata for error page
 * - robots: noindex, nofollow to prevent indexing error pages
 * - title: Translated to Swedish
 */
useHead({
  title: 'Fel | Tricolor Screen',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

// ===== COMPUTED =====
/**
 * Extract HTTP status code from error object
 * Defaults to 500 if error is undefined
 */
const statusCode = computed(() => props.error?.statusCode ?? 500)

/**
 * Check if error is a 404 Not Found error
 */
const isNotFound = computed(() => statusCode.value === 404)

/**
 * Dynamic error title based on status code
 * - 404: "Sidan hittades inte"
 * - Other: "Något gick fel"
 */
const title = computed(() => (isNotFound.value ? 'Sidan hittades inte' : 'Något gick fel'))

/**
 * Dynamic error description based on status code
 * - 404: User-friendly message about missing page
 * - Other: Generic error message with recovery instructions
 */
const description = computed(() =>
  isNotFound.value
    ? 'Sidan du söker finns inte eller har flyttats.'
    : 'Ett oväntat fel inträffade. Försök igen eller gå tillbaka till startsidan.',
)

// ===== METHODS =====
/**
 * Handle navigation back to home page
 * Clears the error boundary and redirects to home
 */
function handleGoHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex flex-col min-h-[100svh] bg-gradient-to-br from-primary-50 via-layout-body to-accent-50">
    <!-- App Header -->
    <AppHeader />

    <!-- Main Content -->
    <main id="main-content" role="main" aria-label="Felsida" tabindex="-1" class="flex flex-1 items-center">
      <!-- Error Container Section -->
      <Section
        aria-label="Felavsnitt"
        background-color="bg-transparent relative overflow-hidden w-full"
        text-color="text-layout-text-on-light"
        :contained="false"
        align="center"
      >
        <!-- Decorative Background Blobs -->
        <div aria-hidden="true" class="absolute inset-0 pointer-events-none">
          <div class="absolute -top-16 -right-20 h-56 w-56 rounded-full bg-primary-200 opacity-50 blur-3xl" />
          <div class="absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-secondary-200 opacity-40 blur-3xl" />
        </div>

        <!-- Error Card Content -->
        <div class="relative layout-container py-12 md:py-16 lg:py-20 w-fit">
          <div class="max-w-2xl p-6 md:p-10 rounded-card border border-primary-100 bg-layout-body shadow-drop">
            <!-- Error Code Badge -->
            <p class="text-sm font-semibold text-primary-700">
              Fel {{ statusCode }}
            </p>

            <!-- Error Title -->
            <h1 class="font-display text-layout-text-on-light">
              {{ title }}
            </h1>

            <!-- Error Description -->
            <p class="text-layout-text-on-light" role="status" aria-live="polite">
              {{ description }}
            </p>

            <!-- Action Buttons -->
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <!-- Back to Home Button -->
              <BaseButton
                variant="primary"
                size="fit"
                aria-label="Gå tillbaka till startsidan"
                @click="handleGoHome"
              >
                Till Startsidan
              </BaseButton>

              <!-- Contact Link -->
              <NuxtLink
                to="/contact"
                class="font-semibold text-primary-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ml-auto"
              >
                Kontakta oss
              </NuxtLink>
            </div>
          </div>
        </div>
      </Section>
    </main>

    <!-- App Footer -->
    <AppFooter />
  </div>
</template>
