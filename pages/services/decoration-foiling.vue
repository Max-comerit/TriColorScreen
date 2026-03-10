<script setup lang="ts">
// ===== IMPORTS =====
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CtaSection from '~/components/features/CtaSection.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import decorationFoilingServicesData from '~/assets/json/services/decoration-foiling/services.json'

// ===== PROPS & EMITS =====

// ===== COMPOSABLES & STORES =====
useHead({
  title: 'Bildekor & Helfoliering i Stockholm | Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
    {
      property: 'og:title',
      content: 'Dekor & foliering - Bildekor och helfoliering i Stockholm',
    },
    {
      property: 'og:description',
      content: 'Vi hjalper privatpersoner och foretag med bildekor, fordonsdekor och helfoliering i Stockholm.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/services/decoration-foiling/hero.jpg',
    },
  ],
})

// ===== STATE =====
const decorationFoilingServices = decorationFoilingServicesData as IServiceCardContent[]

// ===== COMPUTED =====
const decorationFoilingCards = computed<CardItem[]>(() =>
  decorationFoilingServices.map((service) => ({
    type: 'service',
    data: {
      ...service,
      maxLines: 26,
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
      src="/images/services/decoration-foiling/hero.jpg"
      :video-sources="[
        { src: '/videos/services/decoration-foiling/hero.webm', type: 'video/webm' },
        { src: '/videos/services/decoration-foiling/hero.mp4', type: 'video/mp4' }
      ]"
      title="Dekor & Foliering"
      description="Foliering är det smarta sättet att få fram budskap på ytor som annars är svårtillgängliga för marknadsföring, exempelvis på glas och karosser."
      :width="1280"
      :height="854"
      alt="Bilfoliering och fordonsdekoration utförd av Tricolor Screen"
    />

    <div class="layout-container">

      <!-- Intro -->
      <Section
        id="intro"
        title="Din partner för dekor och foliering"
        aria-label="Om våra dekor- och folieringstjänster"
        align="center"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Vi hjälper privatpersoner och företag med allt från enstaka bildekor till
            komplett helfoliering. Välj bland ett brett utbud av utföranden: blank, matt,
            metallic, chrome, chrome delete, print med mera.
          </p>
          <p class="leading-relaxed">
            Foliering och dekor handlar inte bara om reklam. Det kan lika gärna röra sig
            om insynsskydd i konferensrum, informativa säkerhetsdekaler eller en hel
            glasfasad – vi hittar rätt lösning för just ditt behov.
          </p>
        </div>
      </Section>

      <!-- Services -->
      <Section
        id="services"
        title="Våra tjänster"
        align="center"
        aria-label="Våra dekor- och folieringstjänster"
      >
        <CardGrid
          :card-content-arr="decorationFoilingCards"
          :min-item-width="360"
          :gap="24"
          aria-label="Tjänster inom foliering och bildekor"
          section-id="decoration-foiling-services"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Intresserad? Hör av dig!"
        text="Berätta om ditt fordon eller din yta – vi hjälper dig att välja rätt material och utförande, och sätter ihop en lösning som passar din budget."
      />

    </div>
  </div>
</template>

