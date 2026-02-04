<script setup lang="ts">
import Carousel from './Carousel.vue'
import type { IServiceCardContent } from '~/types/CardContent'

const exampleData: IServiceCardContent[] = [
  {
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
  },
]

function onCardClick(item: IServiceCardContent, index: number) {
  // This is just an example; in a real page you'd navigate or track analytics
  console.log('Card clicked:', index, item.title)
}
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-xl font-semibold">Our Services</h3>
    <Carousel
      :items="exampleData"
      :per-page="2"
      :gap-px="16"
      :loop="true"

      @card-click="onCardClick"
    />
  </div>
</template>
