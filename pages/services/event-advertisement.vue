<script setup lang="ts">
// ===== IMPORTS =====
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import TextButton from '~/components/common/TextButton.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import servicesData from '~/assets/json/services/event-advertisement/services.json'

// ===== PROPS & EMITS =====

// ===== COMPOSABLES =====
useHead({
  title: 'Allt för mässor & events | TriColorScreen',
  meta: [
    {
      name: 'description',
      content: 'Allt för mässor och events: skyltar, banderoller, dekaler, flaggor och profilkläder. TriColorScreen hjälper dig att skapa tydlig, professionell närvaro.',
    },
    {
      name: 'keywords',
      content: 'mässor, events, skyltar, banderoller, dekaler, flaggor, profilkläder, roll-ups, byggskyltar, skyltning',
    },
    {
      property: 'og:title',
      content: 'Allt för mässor & events | TriColorScreen',
    },
    {
      property: 'og:description',
      content: 'TriColorScreen hjälper dig att ta fram mässmaterial som skyltar, banderoller, dekaler, flaggor och profilkläder.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/services/event-advertisement/hero.jpg',
    },
  ],
})

// ===== STATE =====
const services = servicesData as IServiceCardContent[]

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  services.map((service) => ({
    type: 'service',
    data: {
      ...service,
      maxLines: 6,
    },
  }))
)

// ===== METHODS =====

// ===== LIFECYCLE HOOKS =====

// ===== WATCHERS =====
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/services/event-advertisement/hero.jpg"
      title="Allt för Mässor & Events"
      description="Vid mässor, konferenser och andra event är det många olika bitar som skall fungera. TriColorScreen hjälper dig att ta fram mässmaterial som t.ex. skyltar, banderoller, dekaler, flaggor och profilkläder."
      :width="1280"
      :height="854"
      alt="Monter och profilmaterial för mässor och events"
    />

    <div class="layout-container">

      <!-- Intro -->
      <Section
        id="intro"
        title="På ett event gäller det att synas"
        aria-label="Om våra mäss- och eventtjänster"
        align="center"
        padding-y="pt-4 md:pt-6 lg:pt-8 xl:pt-12 2xl:pt-16 pb-2 md:pb-4 lg:pb-6 xl:pb-6 2xl:pb-8"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            På ett event konkurrerar du om uppmärksamheten med dussintals andra aktörer.
            Rätt profilmaterial gör skillnaden. Det lockar besökare, 
            stärker ditt varumärke och skapar ett professionellt första intryck.
          </p>
          <p class="leading-relaxed">
            Vi hjälper dig hela vägen från idé till färdig lösning.
            Skyltar, banderoller, roll-ups, flaggor och profilkläder.
            Allt levereras i tid och med den kvalitet ditt varumärke förtjänar.
          </p>
        </div>
      </Section>

      <!-- Services -->
      <Section
        id="services"
        title="Våra produkter"
        align="center"
        aria-label="Våra tjänster för mässor och event"
        padding-y="pb-4 md:pb-6 lg:pb-8 xl:pb-12 2xl:pb-16 pt-2 md:pt-4 lg:pt-6 xl:pt-6 2xl:pt-8"
      >
        <CardGrid
          :card-content-arr="serviceCards"
          :min-item-width="360"
          :gap="24"
          aria-label="Tjänster för mässor och event"
          section-id="event-advertisement-services"
        />
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
          <h2 class="font-display text-white">Redo inför nästa event?</h2>
          <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
            Berätta om ditt event och vad du behöver.
            Vi tar fram ett förslag som passar din tidplan och budget.
            Enkelt, snabbt och personligt.
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-2">
            <NuxtLink to="/contact">
              <TextButton class="border">Kontakta oss</TextButton>
            </NuxtLink>
          </div>
        </div>
      </Section>

    </div>
  </div>
</template>

