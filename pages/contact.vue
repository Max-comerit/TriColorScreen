// pages/contact.vue

<script setup lang="ts">
// ===== IMPORTS =====
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import ConfirmDialog from '~/components/layout/ConfirmDialog.vue'

// ===== STATE =====
const showConfirmDialog = ref(false)
const hasFormChanges = ref(false)
let nextRoute: string | null = null

// ===== COMPOSABLES =====
const router = useRouter()

useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
  ],
})

// ===== METHODS =====
/**
 * Handle confirm action when leaving page with form changes
 */
function handleConfirm(): void {
  hasFormChanges.value = false // Reset before navigating to allow the guard to pass
  showConfirmDialog.value = false
  if (nextRoute) {
    router.push(nextRoute)
    nextRoute = null
  }
}

/**
 * Mark form as having changes
 */
function markFormAsChanged(): void {
  hasFormChanges.value = true
}

/**
 * Reset form changes state
 */
// function resetFormChanges(): void {
//   hasFormChanges.value = false
//   nextRoute = null
// }

// ===== LIFECYCLE HOOKS =====
/**
 * Setup page leave guard using beforeRouteLeave
 */
definePageMeta({
  validate: async (_route) => true,
})

onBeforeRouteLeave((to, _from) => {
  if (hasFormChanges.value) {
    nextRoute = to.path
    showConfirmDialog.value = true
    return false
  }
})

/**
 * Initialize form state for testing
 */
onMounted(() => {
  markFormAsChanged() // Mark form as changed for testing purposes
})
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/contact/hero.jpg"
      title="Kontakta Oss På TCS"
      :width="1280"
      :height="854"
      alt="Kontakta Oss På Tricolor Screen"
      :center="false"
    >
      <template #description>
        <p class="mb-0 font-body font-medium text-base sm:text-lg lg:text-xl text-white/90">
          Fyll i formuläret nedan så återkommer vi så snart som möjligt.
        </p>
        <p class="mb-0 font-body font-medium text-base sm:text-lg lg:text-xl text-white/90">
          Vi ser fram emot att höra från dig!
        </p>
      </template>
    </HeroImage>
    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="contact"
        title="Kontakta Oss" 
        align="center"
        aria-label="Kontakta Oss och Skicka Förfrågan"
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </Section>
      <Section 
        id="testimonials" 
        title="Omdömen" 
        align="center"
        aria-label="Kundrecensioner och omdömen"
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </Section>
    </div>

    <!-- Navigation Guard: Confirm Dialog for unsaved form changes -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Osparade ändringar"
      cancel-label="Avbryt"
      confirm-label="Fortsätt"
      width="24rem"
      @confirm="handleConfirm"
    >
      <p>Alla formulärdata kommer att gå förlorade om du fortsätter.</p>
      <p>Är du säker på att du vill fortsätta?</p>
    </ConfirmDialog>
  </div>
</template>

