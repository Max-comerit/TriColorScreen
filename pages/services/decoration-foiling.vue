<script setup lang="ts">
// ===== IMPORTS =====
import { useSiteUrl } from '~/composables/useSiteUrl'
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import CtaSection from '~/components/features/CtaSection.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import decorationFoilingServicesData from '~/assets/json/services/decoration-foiling/services.json'

const HERO_IMAGE = '/images/services/decoration-foiling/hero-v2.jpg'
const HERO_VIDEO_WEBM = '/videos/services/decoration-foiling/hero.webm'
const HERO_VIDEO_MP4 = '/videos/services/decoration-foiling/hero.mp4'

// ===== PROPS & EMITS =====

// ===== COMPOSABLES & STORES =====
const siteUrl = useSiteUrl()
useHead({
  title: 'Bildekor & Helfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder professionell bildekor, fordonsdekor och helfoliering för privatpersoner och företag i Stockholm. Hög kvalitet och snabb leverans.',
    },
    {
      name: 'keywords',
      content: 'bildekor, fordonsdekor, helfoliering, dekorfolie, bilfoliering, fönsterdekor, fasaddekor, Stockholm, reklam',
    },
    { property: 'og:title', content: 'Bildekor & Helfoliering - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Professionell bildekor, fordonsdekor och helfoliering för privatpersoner och företag i Stockholm.',
    },
    { property: 'og:url', content: `${siteUrl}/services/decoration-foiling` },
    { property: 'og:image', content: `${siteUrl}${HERO_IMAGE}` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '2331' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Dekorfolie & Bilfoliering - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Professionell bildekor, fordonsdekor och helfoliering för privatpersoner och företag i Stockholm.',
    },
    { name: 'twitter:image', content: `${siteUrl}${HERO_IMAGE}` },
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
      :src="HERO_IMAGE"
      :video-sources="[
        { src: HERO_VIDEO_WEBM, type: 'video/webm' },
        { src: HERO_VIDEO_MP4, type: 'video/mp4' }
      ]"
      title="Dekor & Foliering"
      description="Bildekor, helfoliering, glasfasader och insynsskydd. Ditt budskap på ytor som syns."
      :width="1280"
      :height="854"
      alt=""
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
            glasfasad - vi hittar rätt lösning för just ditt behov.
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
          :min-item-width="280"
          :gap="24"
          aria-label="Tjänster inom foliering och bildekor"
          section-id="decoration-foiling-services"
        />
      </Section>

      <!-- CTA -->
      <CtaSection
        heading="Intresserad? Hör av dig!"
        text="Berätta om ditt fordon eller din yta - vi hjälper dig att välja rätt material och utförande, och sätter ihop en lösning som passar din budget."
      />

    </div>
  </div>
</template>

