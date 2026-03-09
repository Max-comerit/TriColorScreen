// pages/about.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem } from '~/types/CardContent'
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import TextButton from '~/components/common/TextButton.vue'

// ===== COMPOSABLES =====
useHead({
  title: 'Om Oss – Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Lär känna Tricolor Screen – ett familjeföretag med över 25 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    {
      property: 'og:title',
      content: 'Om oss – Tricolor Screen',
    },
    {
      property: 'og:description',
      content: 'Lär känna Tricolor Screen – ett familjeföretag med över 25 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    {
      property: 'og:image',
      content: '/images/about/hero.jpg',
    },
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
      description: 'Vi vet att deadlines är viktiga. Med effektiva processer levererar vi i tid – varje gång.',
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
      src="/images/about/hero.jpg"
      title="Om Oss"
      description="Lär känna teamet bakom Tricolor Screen – över 28 år av passion för tryck och design."
      :width="1280"
      :height="854"
      alt="Tricolor Screen-teamet i verkstaden"
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
            Tricolor Screen grundades 1996 med en enkel men stark övertygelse: att alla företag –
            stora som små – förtjänar professionellt tryckt profilmaterial till ett rättvist pris.
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
            <p class="font-display text-4xl font-bold text-primary-600" :aria-label="stat.ariaLabel">{{ stat.value }}</p>
            <p class="font-medium text-neutral-600">{{ stat.label }}</p>
          </li>
        </ul>
      </Section>

      <!-- Our Values -->
      <Section
        id="values"
        title="Våra värderingar"
        description="Det här är principerna som vägleder allt vi gör – från hur vi möter kunder till hur vi hanterar varje order."
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
      <Section
        id="contact-cta"
        aria-label="Kontakta oss"
        background-color="bg-primary-600"
        text-color="text-white"
        align="center"
        class="px-4 md:px-8 lg:px-16 rounded"
      >
        <div class="space-y-4 text-center">
          <h2 class="font-display text-white">Låt oss hjälpa dig</h2>
          <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
            Vi tror på enkla samtal och ärliga råd. Berätta vad du behöver så hittar vi
            tillsammans den bästa lösningen för dig och ditt företag.
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-2">
            <NuxtLink
              to="/contact"
            >
              <TextButton class="border">Kontakta oss</TextButton>
            </NuxtLink>
          </div>
        </div>
      </Section>

    </div>
  </div>
</template>

