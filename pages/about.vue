// pages/about.vue

<script setup lang="ts">
// ===== IMPORTS =====
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import TextButton from '~/components/common/TextButton.vue'

// ===== COMPOSABLES =====
useHead({
<<<<<<< HEAD
  title: 'Om Oss – Tricolor Screen',
=======
  title: 'Om oss – Tricolor Screen',
>>>>>>> 51a61cd (Added initial design of about page)
  meta: [
    {
      name: 'description',
      content: 'Lär känna Tricolor Screen – ett familjeföretag med över 28 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    {
      property: 'og:title',
      content: 'Om oss – Tricolor Screen',
    },
    {
      property: 'og:description',
      content: 'Lär känna Tricolor Screen – ett familjeföretag med över 28 års erfarenhet av reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering.',
    },
    {
      property: 'og:image',
      content: '/images/about/hero.jpg',
    },
  ],
})

// ===== STATE =====
<<<<<<< HEAD
const stats = ref([
  { value: '28+', label: 'År i branschen', ariaLabel: '28 år i branschen' },
  { value: '5 000+', label: 'Nöjda kunder', ariaLabel: 'Över 5 000 nöjda kunder' },
  { value: '50 000+', label: 'Levererade ordrar', ariaLabel: 'Över 50 000 levererade ordrar' },
  { value: '8', label: 'Tjänsteområden', ariaLabel: '8 tjänsteområden' },
])

const values = ref([
  {
=======
const values = ref([
  {
    icon: '🎯',
>>>>>>> 51a61cd (Added initial design of about page)
    title: 'Kvalitet i varje detalj',
    description:
      'Vi kompromissar aldrig med kvaliteten. Varje order behandlas med omsorg från första kontakt till leverans.',
  },
  {
<<<<<<< HEAD
=======
    icon: '🤝',
>>>>>>> 51a61cd (Added initial design of about page)
    title: 'Personlig service',
    description:
      'Vi lyssnar på dina behov och ger rådgivning som passar just ditt projekt och din budget.',
  },
  {
<<<<<<< HEAD
=======
    icon: '⚡',
>>>>>>> 51a61cd (Added initial design of about page)
    title: 'Snabba leveranser',
    description:
      'Vi vet att deadlines är viktiga. Med effektiva processer levererar vi i tid – varje gång.',
  },
  {
<<<<<<< HEAD
=======
    icon: '🌱',
>>>>>>> 51a61cd (Added initial design of about page)
    title: 'Hållbarhet',
    description:
      'Vi använder miljövänliga material och processer där det är möjligt, för en bättre framtid.',
  },
])

<<<<<<< HEAD
=======
const teamMembers = ref([
  {
    name: 'Andreas Andersson',
    role: 'Grundare & VD',
    description:
      'Grundade Tricolor Screen 1996 med en vision om att erbjuda högkvalitativt tryck till rimliga priser. Brinner för hantverk och kundrelationer.',
  },
  {
    name: 'Maria Lindqvist',
    role: 'Produktionschef',
    description:
      'Ansvarar för att varje order håller vår höga standard. Med 15 års erfarenhet inom tryck säkerställer Maria att allt flödar smidigt.',
  },
  {
    name: 'Erik Svensson',
    role: 'Grafisk Designer',
    description:
      'Hjälper kunder att förverkliga sina idéer med kreativ design och teknisk precision. Specialiserad på logotyper och profilmaterial.',
  },
])
>>>>>>> 51a61cd (Added initial design of about page)
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/about/hero.jpg"
      title="Om oss"
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
<<<<<<< HEAD
          <p class="leading-relaxed">
=======
          <p class="leading-relaxed text-neutral-700">
>>>>>>> 51a61cd (Added initial design of about page)
            Tricolor Screen grundades 1996 med en enkel men stark övertygelse: att alla företag –
            stora som små – förtjänar professionellt tryckt profilmaterial till ett rättvist pris.
            Vad som startade som ett litet screentryckeri har vuxit till ett fullserviceföretag
            inom reklam- och profiltryck.
          </p>
<<<<<<< HEAD
          <p class="leading-relaxed">
=======
          <p class="leading-relaxed text-neutral-700">
>>>>>>> 51a61cd (Added initial design of about page)
            Idag erbjuder vi ett brett sortiment av tjänster: reklam- och profiltryck, brodyr,
            textiltryck, bildekor och bilfoliering. Med modern utrustning och ett dedikerat team
            levererar vi hög kvalitet varje dag.
          </p>
<<<<<<< HEAD
          <p class="leading-relaxed">
=======
          <p class="leading-relaxed text-neutral-700">
>>>>>>> 51a61cd (Added initial design of about page)
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
<<<<<<< HEAD
          <li v-for="stat in stats" :key="stat.label" class="space-y-1">
            <p class="font-display text-4xl font-bold text-primary-600" :aria-label="stat.ariaLabel">{{ stat.value }}</p>
            <p class="font-medium text-neutral-600">{{ stat.label }}</p>
=======
          <li class="space-y-1">
            <p class="font-display text-4xl font-bold text-primary-600" aria-label="28 år i branschen">28+</p>
            <p class="text-sm font-medium text-neutral-600">År i branschen</p>
          </li>
          <li class="space-y-1">
            <p class="font-display text-4xl font-bold text-primary-600" aria-label="Över 5 000 nöjda kunder">5 000+</p>
            <p class="text-sm font-medium text-neutral-600">Nöjda kunder</p>
          </li>
          <li class="space-y-1">
            <p class="font-display text-4xl font-bold text-primary-600" aria-label="Över 50 000 levererade ordrar">50 000+</p>
            <p class="text-sm font-medium text-neutral-600">Levererade ordrar</p>
          </li>
          <li class="space-y-1">
            <p class="font-display text-4xl font-bold text-primary-600" aria-label="8 tjänsteområden">8</p>
            <p class="text-sm font-medium text-neutral-600">Tjänsteområden</p>
>>>>>>> 51a61cd (Added initial design of about page)
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
        <ul class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          <li
            v-for="value in values"
            :key="value.title"
<<<<<<< HEAD
            class="flex flex-col gap-2 rounded-card bg-gray-100 p-6 shadow-sm ring-1 ring-neutral-100"
          >
            <h3 class="my-auto font-display font-semibold text-center">{{ value.title }}</h3>
            <p class="my-auto text-base leading-relaxed">{{ value.description }}</p>
=======
            class="rounded-card bg-white p-6 shadow-sm ring-1 ring-neutral-100"
          >
            <p class="mb-3 text-4xl" role="img" :aria-label="value.title">{{ value.icon }}</p>
            <h3 class="mb-2 font-display font-semibold text-neutral-900">{{ value.title }}</h3>
            <p class="text-sm leading-relaxed text-neutral-600">{{ value.description }}</p>
>>>>>>> 51a61cd (Added initial design of about page)
          </li>
        </ul>
      </Section>

      <!-- CTA -->
      <Section
        id="contact-cta"
        aria-label="Kontakta oss"
        background-color="bg-primary-600"
        text-color="text-white"
        align="center"
      >
        <div class="space-y-4 text-center">
<<<<<<< HEAD
          <h2 class="font-display text-white">Låt oss hjälpa dig</h2>
          <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
            Vi tror på enkla samtal och ärliga råd. Berätta vad du behöver så hittar vi
            tillsammans den bästa lösningen för dig och ditt företag.
=======
          <h2 class="font-display text-white">Redo att samarbeta?</h2>
          <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
            Oavsett om du behöver trycksaker, broderade kläder eller en ny bildekoration – vi är
            här för att hjälpa dig. Hör av dig så tar vi det därifrån.
>>>>>>> 51a61cd (Added initial design of about page)
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-2">
            <NuxtLink
              to="/contact"
<<<<<<< HEAD
            >
              <TextButton class="border">Kontakta oss</TextButton>
=======
              class="rounded-button bg-white px-6 py-3 font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Kontakta oss
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="rounded-button border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Se våra tjänster
>>>>>>> 51a61cd (Added initial design of about page)
            </NuxtLink>
          </div>
        </div>
      </Section>

    </div>
  </div>
</template>

