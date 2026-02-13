// pages/contact.vue

<script setup lang="ts">
// ===== IMPORTS =====
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import ContactPanel from '~/components/features/ContactPanel.vue'
import ContactForm from '~/components/features/ContactForm.vue'
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
  const routeToNavigate = nextRoute
  resetFormChanges() // Reset before navigating to allow the guard to pass
  showConfirmDialog.value = false
  if (routeToNavigate) {
    router.push(routeToNavigate)
  }
}

/**
 * Mark form as having changes
 */
function markFormAsChanged(newValue: boolean): void {
  hasFormChanges.value = newValue
}

/**
 * Reset form changes state
 */
function resetFormChanges(): void {
  hasFormChanges.value = false
  nextRoute = null
}

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
</script>

<template>
  <div>
    <!-- ✅ Hidden static form for Netlify form detection during build -->
    <form name="contact" method="POST" action="/" data-netlify="true" enctype="multipart/form-data" hidden>
      <input type="hidden" name="form-name" value="contact">
      <input type="text" name="name">
      <input type="email" name="email">
      <input type="tel" name="phone">
      <select name="customer_type">
        <option value="person">person</option>
        <option value="company">company</option>
      </select>
      <input type="text" name="subject">
      <input type="file" name="image">
      <textarea name="message"></textarea>
      <input type="checkbox" name="gdpr_consent">
    </form>

    <!-- Hero: full width -->
    <HeroImage 
      src="/images/contact/hero.jpg"
      title="Kontakta Oss På TCS"
      :width="1280"
      :height="854"
      alt="Kontakta oss på Tricolor Screen"
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
        title="Kontakta oss" 
        align="center"
        aria-label="Kontakta oss och skicka förfrågan"
      >
        <div class="flex flex-col justify-center items-center gap-12">
          <div class="flex flex-col lg:flex-row justify-center lg:justify-around items-center lg:mb-8 lg:items-stretch gap-8">
            <div class="max-w-full sm:max-w-[50%]">
              <h3 class="text-center sm:text-left">Vad behöver ni hjälp med?</h3>
              <p class="text-center sm:text-left">Bifoga en fil i  meddelandet med det motiv ni vill ha i tryck och ange i meddelandet  vilken tjänst ni vill använda er av - Logo / Text / Design / Bild / Bildekor etc i Bifoga fil så kontaktar vi er per omgående</p>
            </div>
            <ContactPanel />
          </div>
          <ContactForm @changed="markFormAsChanged" />
        </div>

      </Section>
      <Section 
        id="testimonials" 
        title="Hitta oss" 
        align="center"
        aria-label="Hitta oss på Tricolor Screen"
      >
        <figure class="flex flex-col items-center gap-2 mx-auto max-w-full">
          <div class="w-full max-w-2xl aspect-video border border-neutral-900 rounded-card overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.3229615671016!2d18.110771677289637!3d59.344256609825635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f82caa23991cb%3A0x93e6e807638dedc7!2s%C3%96regrundsgatan%2024%2C%20115%2059%20Stockholm!5e0!3m2!1ssv!2sse!4v1770815817256!5m2!1ssv!2sse"
              style="border:0;" 
              allowfullscreen="false" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              class="w-full h-full border border-neutral-900 rounded-card"
            />
          </div>
        </figure>
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

