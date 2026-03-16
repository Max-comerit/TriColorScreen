// pages/contact.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { defineAsyncComponent } from 'vue'
import { useSiteUrl } from '~/composables/useSiteUrl'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import ContactPanel from '~/components/features/ContactPanel.vue'
// Lazy-load ContactForm so Zod is kept out of the shared synchronous bundle
const ContactForm = defineAsyncComponent(() => import('~/components/features/ContactForm.vue'))

// ===== COMPOSABLES =====
const router = useRouter()
const siteUrl = useSiteUrl()

useHead({
  title: 'Kontakta Oss',
  meta: [
    {
      name: 'description',
      content: 'Kontakta Tricolor Screen för reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Vi hjälper dig med professionella lösningar för företag och privatpersoner.',
    },
    {
      name: 'keywords',
      content: 'kontakt, tricolor screen, offert, reklam, profiltryck, brodyr, textiltryck, bilfoliering, Stockholm',
    },
    { property: 'og:title', content: 'Kontakta Oss - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Kontakta Tricolor Screen för reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Vi ser fram emot ditt ärende!',
    },
    { property: 'og:url', content: `${siteUrl}/contact` },
    { property: 'og:image', content: `${siteUrl}/images/contact/hero.jpg` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Kontakta Oss - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Kontakta Tricolor Screen för reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/contact/hero.jpg` },
  ],
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
      alt=""
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
        aria-label="Kontakta oss och skicka förfrågan"
      >
        <div class="flex flex-col justify-center items-center gap-12">
          <div class="flex flex-col lg:flex-row justify-center lg:justify-around items-center lg:mb-8 lg:items-stretch gap-8">
            <div class="max-w-full sm:max-w-[50%]">
              <h3 class="text-center lg:text-left">Vad behöver ni hjälp med?</h3>
              <p class="text-center lg:text-left">Bifoga en fil i meddelandet med det motiv ni vill ha i tryck och ange vilken tjänst ni vill använda - Logo / Text / Design / Bild / Bildekor etc. Så kontaktar vi er omgående.</p>
            </div>
            <ContactPanel />
          </div>
          <ContactForm />
        </div>

      </Section>
      <Section 
        id="testimonials" 
        title="Hitta Oss" 
        align="center"
        aria-label="Hitta oss på Tricolor Screen"
      >
        <figure class="flex flex-col items-center gap-2 mx-auto max-w-full">
          <div class="w-full max-w-2xl aspect-video border border-neutral-900 rounded-card overflow-hidden">
            <iframe 
              title="Google Maps - Tricolor Screen location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.3229615671016!2d18.110771677289637!3d59.344256609825635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f82caa3b3dbe7%3A0xed88aaff18ddd6f3!2sTricolor%20Screen!5e0!3m2!1ssv!2sse!4v1770820576918!5m2!1ssv!2sse"
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
  </div>
</template>

