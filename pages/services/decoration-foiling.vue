// pages/services/decoration-foiling.vue

<script setup lang="ts">
// ===== IMPORTS =====
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import HorizontalCard from '~/components/common/HorizontalCard.vue'
import Section from '~/components/common/Section.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import decorationFoilingServicesData from '~/assets/json/services/decoration-foiling/services.json'
import horizontalCardsData from '~/assets/json/services/decoration-foiling/horizontal-cards.json'

// ===== COMPOSABLES =====
useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
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
      content: '/images/services/decoration-foiling/hero.png',
    },
  ],
})
// ===== STATE =====
type HorizontalCardContent = {
  title: string
  description: string
  imageSrc: string
  alt?: string
}

const decorationFoilingServices = decorationFoilingServicesData as IServiceCardContent[]
const horizontalCards = horizontalCardsData as HorizontalCardContent[]

// Map to CardGrid's expected CardItem[] shape
const decorationFoilingCards: CardItem[] = decorationFoilingServices.map((service) => ({
  type: 'service',
  data: {
    ...service,
    maxLines: 26,
  },
}))

</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/services/decoration-foiling/hero.png"
      title="Dekor & Foliering som lämnar avtryck"
      description="Foliering är det smarta sättet att få fram budskap på ytor som annars är svårtillgängliga för marknadsföring, exempelvis på glas och karosser"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    >
      <template #title>
        <span class="block">Dekor</span>
        <span class="block">Foliering</span>
      </template>
    </HeroImage>

    <!-- Sections -->
    <div class="layout-container">
      <Section
        id="decoration-foiling"
        title="Bildekor och helfoliering"
        align="center"
        aria-label="Bildekor och helfoliering"
      >
        <ul class="flex flex-col gap-6" aria-label="Utvalda tjänster">
          <li v-for="(card, index) in horizontalCards" :key="card.title">
            <HorizontalCard
              :title="card.title"
              :image-src="card.imageSrc"
              :image-alt="card.alt"
              :description="card.description"
              :image-first="index % 2 === 0 ? false : true"
              text-color="black"
              size="fit"
              cursor="default"
            />
          </li>
        </ul>
      </Section>
      <Section
        id="services"
        title="Våra tjänster"
        align="center"
        aria-label="Våra tjänster"
      >
        <div class="flex flex-col gap-6">
          <p class="mx-auto max-w-4xl text-base leading-relaxed text-black text-lg">
            Vi på TriColorScreen hjälper dig som privatperson eller er som företag med olika typer av bildekor och
            fordonsdekor samt helfoliering i Stockholm. Välj bland mängder av utföranden såsom blank, matt, metallic,
            chrome, chrome delete, print med mera. Vi hjälper dig även med stripning, bildekor, dekaler och solfilm.
          </p>
          <CardGrid
            :card-content-arr="decorationFoilingCards"
            :min-item-width="240"
            :gap="24"
            aria-label="Tjänster inom foliering och bildekor"
            section-id="decoration-foiling-services"
          />
        </div>
      </Section>
    </div>
  </div>
</template>

