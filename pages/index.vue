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
import Carousel from '~/components/common/Carousel.vue';
import type { IServiceCardContent } from '~/types/CardContent';
const exampleData: IServiceCardContent[] = [

  {
    title: 'Decoration & Foiling',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'Special finishes including foiling, embossing and varnishes.',
    link: '/services/decoration-foiling',
  },  {
    title: 'Premium Screen Printing',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'High-quality printing for apparel and promotional goods with fast turnaround and great colors.',
    link: '/services/screen-printing-embroidery',
  },
  {
    title: 'Custom Embroidery',
    imageSrc: '/images/index/printed-matter.png',
    description: 'Precision embroidery on caps, shirts and patches for a professional finish.',
    link: '/services/screen-printing-embroidery',
  },
  {
    title: 'Graphic Production',
    imageSrc: '/images/index/graphic-production.png',
    description: 'From proposals to print-ready files and large format solutions.',
    link: '/services/graphic-production',
  },
  {
    title: 'Event Advertisement',
    imageSrc: '/images/index/event-advertisement.png',
    description: 'Large format prints and banners for events and conferences.',
    link: '/services/event-advertisement',
  },
  {
    title: 'Custom Printed Matter',
    imageSrc: '/images/index/printed-matter.png',
    description: 'Business cards, flyers and brochures with premium finishing options.',
    link: '/services/printed-matter',
  },
  {
    title: 'Decoration & Foiling',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'Special finishes including foiling, embossing and varnishes.',
    link: '/services/decoration-foiling',
  },  {
    title: 'Premium Screen Printing',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'High-quality printing for apparel and promotional goods with fast turnaround and great colors.',
    link: '/services/screen-printing-embroidery',
  },
  {
    title: 'Custom Embroidery',
    imageSrc: '/images/index/printed-matter.png',
    description: 'Precision embroidery on caps, shirts and patches for a professional finish.',
    link: '/services/screen-printing-embroidery',
  },
  
]

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

const perPage = useResponsivePerPage().perPage
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
          :card-content-arr="serviceCategories"
          :type="CardType.Service"
          :min-item-width="280"
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
        <!-- Review card grid -->
        <CardGrid
          :card-content-arr="reviews"
          :type="CardType.Review"
          :min-item-width="280"
          :gap="24"
          aria-label="Kundrecensioner"
        />
      </Section>
      <Carousel
      :items="exampleData"
      :per-page="perPage"
      :gap-px="16"
      :loop="true"


    />
    </div>
  </div>
</template>
