// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'

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
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/custom-design/hero.jpg"
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
        title="Design Verktyg" 
        align="center"
        aria-label="Design Verktyg"
      >
        <article class="w-full border border-black rounded-card overflow-hidden">
          <img src="/images/custom-design/t-shirt-front.jpg" alt="Designverktyg för att skapa anpassade tryck och brodyrmönster" width="800" height="800">

        </article>

      </Section>
    </div>
  </div>
</template>

