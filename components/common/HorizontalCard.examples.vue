<script setup lang="ts">
import HorizontalCard from './HorizontalCard.vue'

/**
 * Example exports for HorizontalCard component.
 * These can be imported in docs or storybook-like pages.
 */

const exampleData = [
  {
    title: 'Premium Screen Printing',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'High-quality printing for apparel and promotional goods with fast turnaround and great colors.',
    backgroundColor: 'bg-primary-50',
    pointer: 'text',
    size: 'fit',
  },
  {
    title: 'Custom Embroidery',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'Precision embroidery on caps, shirts and patches for a professional finish.',
    backgroundColor: 'bg-secondary-50',
    imageFirst: false,
    height:"100%",
  },
  {
    title: 'Graphic Production',
    imageSrc: '/images/index/decoration-foiling.png',
    description: 'From proposals to print-ready files and large format solutions.',
    backgroundColor: 'bg-accent-100',
  },
]
</script>

<template>
  <div class="space-y-6">
    <div v-for="(item, i) in exampleData" :key="i">
      <HorizontalCard
        :title="item.title"
        :image-src="item.imageSrc"
        :description="item.description"
        :background-color="item.backgroundColor"
        :image-first="item.imageFirst"
        :cursor="item.pointer"
        :height="item.height"
      />
    </div>
  </div>
</template>
