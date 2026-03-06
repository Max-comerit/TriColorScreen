// pages/index.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent, IReviewCardContent } from '~/types/CardContent'
import serviceCategories from '~/assets/json/index/serviceCategories.json'
import reviews from '~/assets/json/index/reviews.json'
import { defineAsyncComponent } from 'vue'
import HeroImage from '~/components/common/HeroImage.vue'
import BragBar from '~/components/features/BragBar.vue'
import Section from '~/components/common/Section.vue'
import CardGrid from '~/components/common/CardGrid.vue'
// Lazy-load Carousel into its own chunk — it and Embla are only needed on mobile
const Carousel = defineAsyncComponent(() => import('~/components/common/Carousel.vue'))

// ===== COMPOSABLES =====
useHead({
  title: 'Tricolor Screen - Reklam-, Profil- och Textiltryck | Brodyr | Bilfoliering | Grafisk Design',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder kompletta trycklösningar: trycksaker, screentryck, brodyr, textiltryck, bildekor, bilfoliering, grafisk produktion och eventreklam. 28 år av expertis.',
    },
    {
      name: 'keywords',
      content: 'reklam, profiltryck, textiltryck, brodyr, screentryck, bilfoliering, bildekor, trycksaker, visitkort, broschyrer, affischer, foldrar, dekaler, grafisk design, tryckeri Stockholm',
    },
    {
      property: 'og:title',
      content: 'Tricolor Screen - Professionella Trycklösningar för Företag',
    },
    {
      property: 'og:description',
      content: 'Kompletta trycklösningar: trycksaker, screentryck, brodyr, textiltryck, bildekor och bilfoliering. Vi hjälper ditt företag att sticka ut!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/index/hero.jpg',
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
      src="/images/index/hero.jpg"
      title="Tricolor Screen"
      description="Vi hjälper dig med allt inom reklam / profiltryck, brodyr / textiltryck / bildekor / bilfoliering."
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    />

    <!-- Brag Bar -->
    <BragBar />

    <div class="layout-container">

      <!-- Intro -->
      <Section
        id="intro"
        title="Välkommen till Tricolor Screen"
        aria-label="Om Tricolor Screen"
        align="center"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Sedan 1996 har vi levererat professionellt tryck och profilmaterial till företag och privatpersoner.
            Trycksaker, broderade kläder, skyltar, bildekor eller en ny grafisk profil – vi tar hand om hela processen från idé till färdig produkt.
          </p>
          <p class="leading-relaxed">
            Med 28 års erfarenhet vet vi vad som krävs för ett resultat som håller och gör intryck.
            Vi lyssnar på dina behov, ger ärlig rådgivning och levererar alltid i tid.
            Ditt varumärke är i trygga händer.
          </p>
        </div>
      </Section>

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
          :min-item-width="320"
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
            :min-item-width="280"
            :gap="24"
            aria-label="Kundrecensioner"
          />
        </div>
      </Section>
    </div>
  </div>
</template>
