<script setup lang="ts">
// ===== IMPORTS =====
import { useSiteUrl } from '~/composables/useSiteUrl'
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CtaSection from '~/components/features/CtaSection.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import servicesData from '~/assets/json/services/event-advertisement/services.json'

const HERO_IMAGE = '/images/services/event-advertisement/hero.jpg'

// ===== PROPS & EMITS =====

// ===== COMPOSABLES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Mässor & Events',
  meta: [
    {
      name: 'description',
      content: 'Allt för mässor och events: skyltar, banderoller, dekaler, flaggor och profilkläder. Tricolor Screen hjälper dig att skapa tydlig, professionell närvaro.',
    },
    {
      name: 'keywords',
      content: 'mässor, events, skyltar, banderoller, dekaler, flaggor, profilkläder, roll-ups, byggskyltar, skyltning',
    },
    { property: 'og:title', content: 'Mässor & Events - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Tricolor Screen hjälper dig att ta fram mässmaterial som skyltar, banderoller, dekaler, flaggor och profilkläder.',
    },
    { property: 'og:url', content: `${siteUrl}/services/event-advertisement` },
    { property: 'og:image', content: `${siteUrl}${HERO_IMAGE}` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Mässor & Events - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Tricolor Screen hjälper dig att ta fram mässmaterial som skyltar, banderoller, dekaler, flaggor och profilkläder.',
    },
    { name: 'twitter:image', content: `${siteUrl}${HERO_IMAGE}` },
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
      :src="HERO_IMAGE"
      title="Allt för Mässor & Events"
      description="Mässmaterial som skyltar, banderoller, dekaler, flaggor och profilkläder. Vi får dig att synas!"
      :width="1280"
      :height="854"
      alt=""
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
          :min-item-width="280"
          :gap="24"
          aria-label="Tjänster för mässor och event"
          section-id="event-advertisement-services"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Redo inför nästa event?"
        text="Berätta om ditt event och vad du behöver. Vi tar fram ett förslag som passar din tidplan och budget. Enkelt, snabbt och personligt."
      />

    </div>
  </div>
</template>

