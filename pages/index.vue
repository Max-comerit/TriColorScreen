// pages/index.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { CardType } from '~/types/CardContent'
import { serviceCategories } from '~/utils/data/index/serviceCategories'
import { reviews } from '~/utils/data/index/reviews'
import HeroImage from '~/components/common/HeroImage.vue'
import BragBar from '~/components/features/BragBar.vue'
import Section from '~/components/common/Section.vue'
import CardGrid from '~/components/common/CardGrid.vue'

useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/index/hero.png"
      title="Tricolor Screen"
      description="Vi hjälper dig med allt inom reklam / profiltryck, brodyr / textiltryck / bildekor / bilfoliering"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    />

    <!-- Brag Bar -->
    <BragBar />

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="services"
        title="Våra tjänster" 
        align="center"
        aria-label="Våra tjänster"
      >
        <!-- Service categories card grid -->
        <CardGrid
          :card-content-arr="serviceCategories"
          :type="CardType.Service"
          :min-item-width="280"
          :gap="24"
          aria-label="Tjänstekategorier"
        />
      </Section>
      <Section 
        id="testimonials" 
        title="Omdömen" 
        align="center"
        aria-label="Kundrecensioner och omdömen"
      >
        <!-- Review card grid -->
        <CardGrid
          :card-content-arr="reviews"
          :type="CardType.Review"
          :min-item-width="280"
          :gap="24"
          aria-label="Kundrecensioner"
        />
      </Section>
    </div>
  </div>
</template>
