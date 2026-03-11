// pages/services/graphic-production.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent, ITextCardContent } from '~/types/CardContent'
import { useSiteUrl } from '~/composables/useSiteUrl'
import services from '~/assets/json/services/graphic-production/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CardGrid from '~/components/common/CardGrid.vue'
import CtaSection from '~/components/features/CtaSection.vue'


// ===== PROPS & EMITS =====
// (Page component - no props/emits needed)

// ===== COMPOSABLES & STORES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Design & Grafisk Produktion',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen designar och producerar logotyper, broschyrer, folders, affischer, skyltar, rollups, banderoller, visitkort och presentationsmaterial. Vi fokuserar på rätt budskap och val av papper för din trycksak.',
    },
    {
      name: 'keywords',
      content: 'logotyper, broschyrer, folders, affischer, skyltar, rollups, banderoller, visitkort, kuvert, presentationsmaterial, menyer, grafisk design, trycksaker, varumärkesdesign',
    },
    { property: 'og:title', content: 'Design & Grafisk Produktion - Logotyper, Broschyrer & Visitkort' },
    {
      property: 'og:description',
      content: 'Vi designar logotyper, broschyrer, affischer och all sorts grafiskt material. Från budskap till färdiga trycksaker med rätt papper och kommunikativ design.',
    },
    { property: 'og:url', content: `${siteUrl}/services/graphic-production` },
    { property: 'og:image', content: `${siteUrl}/images/services/graphic-production/hero.jpg` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Design & Grafisk Produktion - Logotyper, Broschyrer & Visitkort' },
    {
      name: 'twitter:description',
      content: 'Vi designar logotyper, broschyrer, affischer och all sorts grafiskt material. Från budskap till färdiga trycksaker.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/services/graphic-production/hero.jpg` },
  ],
})

// ===== STATE =====
const servicesData = ref<IServiceCardContent[]>(
  (services as IServiceCardContent[]).map(item => ({ ...item, maxLines: 8 }))
)

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  servicesData.value.map((item) => ({ type: 'service', data: item })),
)

// ===== METHODS =====
// (No additional methods needed)
const stepCards = computed<CardItem[]>(() => (
  [
    {
      title: 'Budskap först',
      description: 'Det första vi frågar är: vad vill ni förmedla? Rätt budskap är grunden för all grafisk produktion – utan det spelar varken design eller material någon roll.',
      backgroundColor: "bg-primary-50"
    },
    {
      title: 'Design & material',
      description: 'Vi tar fram en design som kommunicerar rätt och väljer material som stärker intrycket. Valet av papper är avgörande – fel karaktär kan försvaga ett annars starkt budskap.',
      backgroundColor: "bg-primary-50"
    },
    {
      title: 'Produktion & leverans',
      description: 'Vi trycker materialet i den kvantitet du behöver och säkerställer att allt är tekniskt och kommunikativt korrekt innan det hamnar i dina händer.',
      backgroundColor: "bg-primary-50"
    },
  ] satisfies ITextCardContent[]
).map(item => ({
  type: 'text' as const,
  data: item,
})))

</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/services/graphic-production/hero.jpg"
      title="Design & Grafisk Produktion"
      description="Vi hjälper dig att designa din logotyp och allt annat som är kopplat till ditt varumärke på ett sätt som förför dina kunder."
      :width="1280"
      :height="854"
      alt="Grafisk design och tryckmaterial med klistermärken, färgprover, klädmockups och varumärkesprofilering."
    />

    <div class="layout-container">

      <!-- Intro -->
      <Section
        id="intro"
        title="Design som kommunicerar"
        aria-label="Om vår grafiska produktion"
        align="center"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Vi har producerat underlag för de flesta typer av grafiskt material. Oavsett vad du
            behöver – logotyp, broschyr, skylt eller visitkort – kan vi med största sannolikhet
            lösa det åt dig, från idé till färdig trycksak.
          </p>
          <p class="leading-relaxed">
            Vi är alltid måna om att det grafiska är både kommunikativt och tekniskt korrekt.
            Kommer texten att synas? Sänder bilden rätt budskap? Vi ställer de frågorna
            innan du ens behöver tänka på dem.
          </p>
        </div>
      </Section>

      <!-- Process -->
      <Section
        id="process"
        title="Hur vi arbetar"
        description="En enkel process från brief till leverans – vi guidar dig hela vägen."
        align="center"
        aria-label="Vår arbetsprocess"
        class="p-4"
      >
        <CardGrid
          :card-content-arr="stepCards"
          :min-item-width="280"
          :gap="24"
          aria-label="Arbetsprocess steg"
        />
      </Section>

      <!-- Services -->
      <Section
        id="services"
        title="Våra tjänster"
        align="center"
        aria-label="Våra tjänster inom design och grafisk produktion"
      >
        <CardGrid
          :card-content-arr="serviceCards"
          :min-item-width="280"
          :gap="24"
          aria-label="Tjänster inom grafisk produktion"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Har du ett projekt i åtanke?"
        text="Berätta om ditt varumärke och vad du behöver – vi återkommer med ett förslag som passar ditt ändamål och din budget."
      />

    </div>
  </div>
</template>

