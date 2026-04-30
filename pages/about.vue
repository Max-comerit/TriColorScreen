// pages/about.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem } from '~/types/CardContent'
import CardGrid from '~/components/common/CardGrid.vue'
import { useSiteUrl } from '~/composables/useSiteUrl'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CtaSection from '~/components/features/CtaSection.vue'

const HERO_IMAGE = '/images/about/hero-v2.jpg'

// ===== COMPOSABLES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Om Oss',
  meta: [
    {
      name: 'description',
      content: 'Lär känna Tricolor Screen - ett familjeföretag med över 25 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    {
      name: 'keywords',
      content: 'om oss, tricolor screen, familjeföretag, reklam, profiltryck, brodyr, textiltryck, bildekor, bilfoliering, tryckeri Stockholm',
    },
    { property: 'og:title', content: 'Om Oss - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Lär känna Tricolor Screen - ett familjeföretag med över 25 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    { property: 'og:url', content: `${siteUrl}/about` },
    { property: 'og:image', content: `${siteUrl}${HERO_IMAGE}` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Om Oss - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Lär känna Tricolor Screen - ett familjeföretag med över 25 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    { name: 'twitter:image', content: `${siteUrl}${HERO_IMAGE}` },
  ],
})

// ===== STATE =====
const stats = ref([
  { value: '28+', label: 'År i branschen', ariaLabel: 'Mer än 25 år i branschen' },
  { value: '5 000+', label: 'Nöjda kunder', ariaLabel: 'Över 5 000 nöjda kunder' },
  { value: '50 000+', label: 'Levererade ordrar', ariaLabel: 'Över 50 000 levererade ordrar' },
  { value: '100%', label: 'Familjeägt', ariaLabel: '100% familjeägt företag' },
])

// ===== COMPUTED =====
const valueCards = computed<CardItem[]>(() => [
  {
    type: 'text',
    data: {
      title: 'Kvalitet i varje detalj',
      description: 'Vi kompromissar aldrig med kvaliteten. Varje order behandlas med omsorg från första kontakt till leverans.',
      align: 'center',
      backgroundColor: "bg-primary-50"
    },
  },
  {
    type: 'text',
    data: {
      title: 'Personlig service',
      description: 'Vi lyssnar på dina behov och ger rådgivning som passar just ditt projekt och din budget.',
      align: 'center',
      backgroundColor: "bg-primary-50"
    },
  },
  {
    type: 'text',
    data: {
      title: 'Snabba leveranser',
      description: 'Vi vet att deadlines är viktiga. Med effektiva processer levererar vi i tid - varje gång.',
      align: 'center',
      backgroundColor: "bg-primary-50"
    },
  },
  {
    type: 'text',
    data: {
      title: 'Hållbarhet',
      description: 'Vi använder miljövänliga material och processer där det är möjligt, för en bättre framtid.',
      align: 'center',
      backgroundColor: "bg-primary-50"
    },
  },
])

</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      :src="HERO_IMAGE"
      title="Om Oss"
      description="Lär känna teamet bakom Tricolor Screen - mer än 25 år av passion för tryck och design."
      :width="1280"
      :height="854"
      alt=""
    />

    <div class="layout-container">

      <!-- Our Story -->
      <Section
        id="our-story"
        title="Vår historia"
        aria-label="Vår historia och bakgrund"
        align="center"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Tricolor Screen grundades 1996 med en enkel men stark övertygelse: att alla företag -
            stora som små - förtjänar professionellt tryckt profilmaterial till ett rättvist pris.
            Vad som startade som ett litet screentryckeri har vuxit till ett fullserviceföretag
            inom reklam- och profiltryck.
          </p>
          <p class="leading-relaxed">
            Idag erbjuder vi ett brett sortiment av tjänster: reklam- och profiltryck, brodyr,
            textiltryck, bildekor och bilfoliering. Med modern utrustning och ett dedikerat team
            levererar vi hög kvalitet varje dag.
          </p>
          <p class="leading-relaxed">
            Vi är stolta över att ha byggt långvariga relationer med våra kunder, från lokala
            småföretag till stora nationella organisationer. Ditt varumärke är i trygga händer.
          </p>
        </div>
      </Section>

      <!-- Stats -->
      <Section
        id="stats"
        aria-label="Nyckeltal och milstolpar"
        background-color="bg-primary-50"
      >
        <ul class="grid grid-cols-2 gap-6 text-center md:grid-cols-4" role="list">
          <li v-for="stat in stats" :key="stat.label" class="space-y-1">
            <h3 class="font-display text-4xl font-bold text-primary-700" :aria-label="stat.ariaLabel">{{ stat.value }}</h3>
            <p class="text-neutral-800">{{ stat.label }}</p>
          </li>
        </ul>
      </Section>

      <!-- Our Values -->
      <Section
        id="values"
        title="Våra värderingar"
        description="Det här är principerna som vägleder allt vi gör - från hur vi möter kunder till hur vi hanterar varje order."
        align="center"
        aria-label="Våra kärnvärderingar"
      >
        <CardGrid
          :card-content-arr="valueCards"
          :min-item-width="220"
          :gap="24"
          aria-label="Våra värderingar"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Låt oss hjälpa dig"
        text="Vi tror på enkla samtal och ärliga råd. Berätta vad du behöver så hittar vi tillsammans den bästa lösningen för dig och ditt företag."
      />

    </div>
  </div>
</template>

