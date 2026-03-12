<script setup lang="ts">
import BragBarItem from './BragBarItem.vue'

import checkSolidFull from '~/assets/images/brag-bar/check-solid-full.svg'
import starSolidFull from '~/assets/images/brag-bar/star-solid-full.svg'
import phoneSolidFull from '~/assets/images/brag-bar/phone-solid-full.svg'
import truckSolidFull from '~/assets/images/brag-bar/truck-solid-full.svg'

const bragItems = [
    {
    icon: truckSolidFull,
    text: 'Snabba Leveranser',
  },
  {
    icon: checkSolidFull,
    text: 'Över 25 Års Erfarenhet',
  },
  {
    icon: starSolidFull,
    text: 'Högkvalitativ Tryck och Design',
  },
    {
    icon: phoneSolidFull,
    text: 'Personlig Kundservice',
  },
]
</script>

<template>
  <section class="grid w-full grid-cols-2 md:grid-cols-4 bg-primary-600 md:justify-items-center min-h-[184px] sm:min-h-[200px] md:min-h-[100px]">
    <BragBarItem
      v-for="(item) in bragItems"
      :key="item.text"
      :icon="item.icon"
      :text="item.text"
    />
  </section>
</template>
