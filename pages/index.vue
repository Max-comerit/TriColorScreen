// pages/index.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent, IReviewCardContent } from '~/types/CardContent'
import serviceCategories from '~/assets/json/index/serviceCategories.json'
import reviews from '~/assets/json/index/reviews.json'
import HeroImage from '~/components/common/HeroImage.vue'
import BragBar from '~/components/features/BragBar.vue'
import Section from '~/components/common/Section.vue'
import CardGrid from '~/components/common/CardGrid.vue'
import Carousel from '~/components/common/Carousel.vue'

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
const serviceCategoriesData = ref<IServiceCardContent[]>(serviceCategories as IServiceCardContent[])
const reviewsData = ref<IReviewCardContent[]>(reviews as IReviewCardContent[])

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  serviceCategoriesData.value.map((item) => ({ type: 'service', data: item })),
)

const reviewCards = computed<CardItem[]>(() =>
  reviewsData.value.map((item) => ({ type: 'review', data: item })),
)

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
      <!-- Service Categories -->
      <Section 
        id="services"
        title="Våra tjänster" 
        align="center"
        aria-label="Våra tjänster"
      >
        <!-- Service categories card grid -->
        <CardGrid
          :card-content-arr="serviceCards"
          :min-item-width="281"
          :gap="24"
          aria-label="Tjänstekategorier"
        />
      </Section>
      <!-- Reviews -->
      <Section 
        id="testimonials" 
        title="Omdömen" 
        align="center"
        aria-label="Kundrecensioner och omdömen"
      >
        <!-- Mobile carousel view -->
        <div class="sm:hidden">
          <Carousel
            :items="reviewCards"
            :per-page="1"
            :gap-px="16"
            :loop="true"
            show-arrows
            show-dots
            aria-label="Kundrecensioner"
          />
        </div>

        <!-- Desktop grid view -->
        <div class="hidden sm:block">
          <CardGrid
            :card-content-arr="reviewCards"
            :min-item-width="281"
            :gap="24"
            aria-label="Kundrecensioner"
          />
        </div>
      </Section>
    </div>
  </div>
</template>
