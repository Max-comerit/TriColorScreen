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

// ===== PROPS & EMITS =====
// (Page component - no props/emits needed)

// ===== COMPOSABLES & STORES =====
useHead({
  title: 'Design och Grafisk Produktion | Logotyper, Broschyrer, Visitkort | Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen designar och producerar logotyper, broschyrer, folders, affischer, skyltar, rollups, banderoller, visitkort och presentationsmaterial. Vi fokuserar på rätt budskap och val av papper för din trycksak.',
    },
    {
      name: 'keywords',
      content: 'logotyper, broschyrer, folders, affischer, skyltar, rollups, banderoller, visitkort, kuvert, presentationsmaterial, menyer, grafisk design, trycksaker, varumärkesdesign',
    },
    {
      property: 'og:title',
      content: 'Design och Grafisk Produktion - Logotyper, Broschyrer & Visitkort',
    },
    {
      property: 'og:description',
      content: 'Vi designar logotyper, broschyrer, affischer och all sorts grafiska material. Från budskap till färdiga trycksaker med rätt papper och kommunikativ design.',
    },
    {
      property: 'og:type',
      content: 'website',
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

// ===== METHODS =====
// (No additional methods needed)

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
          :key="`horizontal-card-${index}`"
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

