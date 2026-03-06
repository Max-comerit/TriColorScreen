// pages/services/screen-printing-embroidery.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IImageCardContent } from '~/types/CardContent'
import images from '~/assets/json/services/screen-printing-embroidery/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import { useResponsivePerPage } from '~/composables/useResponsivePerPage'
import { defineAsyncComponent } from 'vue'
const Carousel = defineAsyncComponent(() => import('~/components/common/Carousel.vue'))

// ===== COMPOSABLES =====
useHead({
  title: 'Screentryck, Brodyr & Textiltryck | Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Vi erbjuder professionella lösningar inom screentryck, brodyr och textiltryck för företag och privatpersoner.',
    },
    {
      name: 'keywords',
      content: 'screentryck, brodyr, textiltryck, tricolor screen, tryckeri, profiltryck, reklammaterial, företagskläder, eventkläder',
    },
    {
      property: 'og:title',
      content: 'Screentryck, Brodyr & Textiltryck | Tricolor Screen',
    },
    {
      property: 'og:description',
      content: 'Professionella lösningar inom screentryck, brodyr och textiltryck för företag och privatpersoner. Kontakta oss för skräddarsydda trycklösningar.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/services/screen-printing-embroidery/hero.jpg',
    },
  ],
})

const { perPage } = useResponsivePerPage()

// ===== COMPUTED =====
const imageCards = computed<CardItem[]>(() =>
  (images as IImageCardContent[]).map((item) => ({ type: 'image', data: item })),
)
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/services/screen-printing-embroidery/hero.jpg"
      :video-sources="[
        { src: '/videos/services/screen-printing-embroidery/hero.webm', type: 'video/webm' },
        { src: '/videos/services/screen-printing-embroidery/hero.mp4', type: 'video/mp4' }
      ]"
      title="Screentryck, Brodyr & Textiltryck"
      description="Vi använder alla sorters metoder för att trycka er design på valt underlag."
      :width="1280"
      :height="1276"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    />

    <div class="layout-container">

      <!-- Intro -->
    <Section
      id="intro"
      title="Rätt metod för rätt material"
      aria-label="Om våra tryckmetoder"
      align="center"
    >
      <div class="mx-auto max-w-3xl space-y-4">
        <p class="leading-relaxed">
          Vi trycker på många typer av textilier och guidar dig genom hela processen,
          från val av plagg till färdig produkt. Olika material och användningsområden
          kräver olika tryckmetoder, och vi arbetar bland annat med screentryck,
          brodyr, DTF-tryck och sublimering.
        </p>
        <p class="leading-relaxed">
          Företagskläder, eventtröjor, profilartiklar eller hobbyplagg.
          Vi ser till att du får rätt metod för ett hållbart resultat och ett bra pris.
          All rådgivning anpassas efter ditt behov och användningsområde.
        </p>
      </div>
    </Section>

      <!-- Gallery -->
      <Section
        id="gallery"
        description="Vi trycker på alla sorters textilier med personlig vägledning och rådgör med er om vilken tryckmetod som passar just ert ändamål."
        align="center"
        aria-label="Exempel på tryckmetoder"
      >
        <Carousel
          :items="imageCards"
          :per-page="perPage"
          :gap-px="16"
          :loop="true"
          show-arrows
          show-dots
          aria-label="Tryckmetoder och resultat"
        />
      </Section>

      <!-- Store section -->
      <Section
        id="store"
        title="Textiler i butik och på lager"
        aria-label="Vårt lager och sortiment"
        align="center"
        background-color="bg-primary-50"
      >
        <div class="mx-auto max-w-3xl space-y-4">
            <p class="text leading-relaxed">
              Vi har alla sorters textiler hos oss på Öregrundsgatan 24 i Stockholm på Gärdet. 
              <br>
              Använd designverktyget i 
              <NuxtLink to="/custom-design" class="font-semibold underline hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">DESIGNA SJÄLV</NuxtLink>
              för att designa dina textilier och se hur de kommer att se ut. 
              Skicka sedan en offertförfrågan via formuläret så återkommer vi med en offert så snart som möjligt.
            </p>
        </div>
      </Section>

    </div>
  </div>
</template>

