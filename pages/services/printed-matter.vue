// pages/services/printed-matter.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import { useSiteUrl } from '~/composables/useSiteUrl'
import services from '~/assets/json/services/printed-matter/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CtaSection from '~/components/features/CtaSection.vue'
import { useResponsivePerPage } from '~/composables/useResponsivePerPage'
import { defineAsyncComponent } from 'vue'
const Carousel = defineAsyncComponent(() => import('~/components/common/Carousel.vue'))

// ===== COMPOSABLES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Trycksaker',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder högkvalitativ trycksaksproduktion: foldrar, broschyrer, visitkort, affischer, etiketter, kuvert, klistermärken, menyer och dekaler. 28 år av expertis i tryckbranschen.',
    },
    {
      name: 'keywords',
      content: 'trycksaker, foldrar, broschyrer, visitkort, affischer, etiketter, kuvert, klistermärken, menyer, dekaler, tryckeri, profiltryck, reklammaterial',
    },
    { property: 'og:title', content: 'Trycksaker - Foldrar, Broschyrer & Visitkort' },
    {
      property: 'og:description',
      content: 'Högkvalitativa trycksaker för alla ändamål. Från designkoncept till leverans - Tricolor Screen har löst allt sedan 1998.',
    },
    { property: 'og:url', content: `${siteUrl}/services/printed-matter` },
    { property: 'og:image', content: `${siteUrl}/images/services/printed-matter/hero.jpg` },
    { name: 'twitter:title', content: 'Trycksaker - Foldrar, Broschyrer & Visitkort' },
    {
      name: 'twitter:description',
      content: 'Högkvalitativa trycksaker för alla ändamål. Från designkoncept till leverans - Tricolor Screen har löst allt sedan 1998.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/services/printed-matter/hero.jpg` },
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}/services/printed-matter` },
  ],
})

const { perPage } = useResponsivePerPage()

// ===== STATE =====
const servicesData = ref<IServiceCardContent[]>(
  (services as IServiceCardContent[]).map(item => ({ ...item, maxLines: 8 }))
)

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  servicesData.value.map((item) => ({ type: 'service', data: item })),
)
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/services/printed-matter/hero.jpg"
      title="Designa produkter med eget tryck"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    >
      <template #description>
        <p class="text-accent-400 font-medium text-base sm:text-lg lg:text-xl mb-3">
          <strong>Alla typer av trycksaker.</strong>
        </p>
        <p class="font-body font-medium text-base sm:text-lg lg:text-xl text-white/90">
          Vi har valt att fokusera på ett otroligt brett utbud av trycksaker tack vare vår långa erfarenhet i branschen. Hos oss hittar du alltid produkter med hög kvalitét och fantastiska tryckresultat.
        </p>
      </template>
    </HeroImage>

    <div class="layout-container">

      <!-- Intro -->
      <Section
        id="intro"
        title="Trycksaker som syns och håller"
        aria-label="Om våra trycksaker"
        align="center"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Från visitkort till hela broschyrkampanjer.
            Vi tar hand om hela processen, från idé till färdig trycksak.
            Med över 25 års erfarenhet vet vi vad som krävs för ett resultat som gör intryck.
          </p>
          <p class="leading-relaxed">
            Vi trycker på en mängd olika material och för många olika ändamål.
            Hittar du inte exakt det du söker bland våra produkter?
            Hör av dig, vi hjälper dig att hitta rätt lösning.
          </p>
        </div>
      </Section>

      <!-- Products carousel -->
      <Section
        id="printed-matter"
        title="Våra trycksaker"
        align="center"
        aria-label="Våra trycksaker"
        padding-y="pb-4 md:pb-6 lg:pb-8 xl:pb-12 2xl:pb-16"
      >
        <Carousel
          :items="serviceCards"
          :per-page="perPage"
          :gap-px="16"
          :loop="true"
          show-arrows
          show-dots
          aria-label="Trycksaker"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Hittar du inte vad du letar efter?"
        text="Vi trycker på i princip alla material och kan ta fram skräddarsydda lösningar. Berätta vad du behöver så återkommer vi med ett förslag."
      />

    </div>
  </div>
</template>

