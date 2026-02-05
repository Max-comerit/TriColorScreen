// pages/services/printed-matter.vue

<script setup lang="ts">
// Printed Matter page
import Carousel from '~/components/common/Carousel.vue';
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import { printedMatterServices } from '~/utils/data/services/printed-matter/services'
import {useResponsivePerPage} from '~/composables/useResponsivePerPage';

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

const perPage = useResponsivePerPage().perPage;

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

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="services" 
        title="Våra tjänster" 
        align="center"
        aria-label="Våra tjänster och lösningar"
      >
      <Carousel 
          :items="printedMatterServices"
          aria-label="Tjänster karusell"
          :loop="true"
          :per-page="perPage"
          :gap-px="16"

        />
      </Section>
      <Section 
        id="testimonials" 
        title="Omdömen" 
        align="center"
        aria-label="Kundrecensioner och omdömen"
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </Section>
    </div>
  </div>
</template>

