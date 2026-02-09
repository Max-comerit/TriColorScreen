// pages/services/graphic-production.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import services from '~/assets/json/services/graphic-production/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
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
      title="Tricolor Screen"
      description="Vi hjälper dig med allt inom reklam / profiltryck, brodyr / textiltryck / bildekor / bilfoliering"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    />

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="services" 
        title="Våra tjänster" 
        align="center"
        aria-label="Våra tjänster och lösningar"
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </Section>
      <Section 
        id="graphic-production" 
        title="Grafisk Produktion" 
        align="center"
        aria-label="Grafisk Produktion"
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

