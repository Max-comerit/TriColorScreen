// pages/services/screen-printing-embroidery.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IImageCardContent } from '~/types/CardContent'
import { useSiteUrl } from '~/composables/useSiteUrl'
import images from '~/assets/json/services/screen-printing-embroidery/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import { useResponsivePerPage } from '~/composables/useResponsivePerPage'
import { defineAsyncComponent } from 'vue'
const Carousel = defineAsyncComponent(() => import('~/components/common/Carousel.vue'))

// ===== COMPOSABLES & STORES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Screentryck, Brodyr & Textiltryck',
  meta: [
    {
      name: 'description',
      content: 'Vi erbjuder professionella lösningar inom screentryck, brodyr och textiltryck för företag och privatpersoner.',
    },
    {
      name: 'keywords',
      content: 'screentryck, brodyr, textiltryck, tricolor screen, tryckeri, profiltryck, reklammaterial, företagskläder, eventkläder',
    },
    { property: 'og:title', content: 'Screentryck, Brodyr & Textiltryck - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Professionella lösningar inom screentryck, brodyr och textiltryck för företag och privatpersoner. Kontakta oss för skräddarsydda trycklösningar.',
    },
    { property: 'og:url', content: `${siteUrl}/services/screen-printing-embroidery` },
    { property: 'og:image', content: `${siteUrl}/images/services/screen-printing-embroidery/hero-v2.jpg` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '1272' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Screentryck, Brodyr & Textiltryck - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Professionella lösningar inom screentryck, brodyr och textiltryck för företag och privatpersoner.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/services/screen-printing-embroidery/hero-v2.jpg` },
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
      src="/images/services/screen-printing-embroidery/hero-v2.jpg"
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
          <Carousel
          :items="imageCards"
          :per-page="perPage"
          :gap-px="16"
          :loop="true"
          show-arrows
          show-dots
          outer-border="bordered"
          aria-label="Tryckmetoder och resultat"
          class="mb-4"
        />

      <!-- Store section -->
      <section
        id="store"
        class="relative overflow-hidden py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-12 rounded-card"
        aria-label="Vårt lager och sortiment"
      >
        <!-- Background image -->
        <NuxtImg
          src="/images/services/screen-printing-embroidery/store.jpg"
          alt="Tricolor Screens lager med textilier och tryckta plagg"
          width="600"
          height="400"
          format="webp"
          quality="70"
          sizes="100vw sm:768px md:1024px lg:1280px 2xl:1280px"
          densities="x1"
          fit="cover"
          loading="lazy"
          decoding="async"
          draggable="false"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <!-- Dark overlay for text legibility -->
        <div class="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div class="container relative z-10 mx-auto text-center px-4 sm:px-6 lg:px-8">
          <header class="mb-8 md:mb-12">
            <h2 class="font-display text-white">Textiler i butik och på lager</h2>
          </header>
          <div class="mx-auto max-w-3xl space-y-4">
            <p class="leading-relaxed text-white">
              <span class="block mb-3">Vi har alla sorters textiler hos oss på Öregrundsgatan 24 i Stockholm på Gärdet.</span>
              <span class="block">Använd designverktyget i
              <NuxtLink
                to="/custom-design"
                class="font-semibold text-white underline hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >DESIGNA SJÄLV</NuxtLink>
              för att designa dina textilier och se hur de kommer att se ut.
              Skicka sedan en offertförfrågan via formuläret så återkommer vi med en offert så snart som möjligt.</span>
            </p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

