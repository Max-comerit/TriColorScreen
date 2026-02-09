// pages/services/graphic-production.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent, IHorizontalCardContent } from '~/types/CardContent'
import horizontalCards from '~/assets/json/services/graphic-production/horizontal-cards.json'
import services from '~/assets/json/services/graphic-production/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import HorizontalCard from '~/components/common/HorizontalCard.vue'
import CardGrid from '~/components/common/CardGrid.vue'

// ===== COMPOSABLES =====
useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
  ],
})

// ===== STATE (ref/reactive) =====
const servicesData = ref<IServiceCardContent[]>(services as IServiceCardContent[])
const horizontalCardsData = ref<IHorizontalCardContent[]>(
  (horizontalCards as IHorizontalCardContent[]).map(item => ({ ...item, maxLines: 12 }))
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
      src="/images/services/graphic-production/hero.png"
      title="Design och Grafisk Produktion"
      description="Vi hjälper dig att designa din logotyp och allt annat som är kopplat till ditt varumärke på ett sätt som förför dina kunder."
      :width="1280"
      :height="854"
      alt="Grafisk design och tryckmaterial med klistermärken, färgprover, klädmockups och varumärkesprofilering."
    />

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="graphic-production" 
        title="Grafisk Produktion"
        align="center"
        aria-label="Grafisk Produktion"
      >
        <HorizontalCard
          v-for="(card, index) in horizontalCardsData" 
          :key="index"
          :title="card.title"
          :image-src="card.imageSrc"
          :description="card.description"
          :max-lines="card.maxLines"
          :link="card.link"
          size="fit"
          class="mb-6"
        />
      </Section>
      <Section 
        id="graphic-production-services" 
        title="Våra tjänster inom Design och Grafisk Produktion" 
        align="center"
        aria-label="Våra tjänster inom Design och Grafisk Produktion"
      >
        <!-- Service card grid -->
        <CardGrid
          :card-content-arr="serviceCards"
          :min-item-width="280"
          :gap="24"
          aria-label="Tjänstekategorier"
        />
      </Section>
    </div>
  </div>
</template>

