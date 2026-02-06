// pages/services/printed-matter.vue

<script setup lang="ts">
// Printed Matter page
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
      src="/images/services/printed-matter/hero.png"
      title="Designa produkter med eget tryck"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    >
      <template #description>
        <p class="text-accent-400 font-medium text-base sm:text-lg lg:text-xl mb-3">
          <strong>Alla typer av trycksaker.</strong>
        </p>
        <p class="font-body font-medium text-base sm:text-lg lg:text-xl text-white/90">
          Vi har valt att fokusera på ett otroligt brett utbud av trycksaker tack vare våra 28 år i branschen. Hos oss hittar du alltid produkter med hög kvalitét och fantastiska tryckresultat.
        </p>
      </template>
    </HeroImage>

    <!-- Sections -->
    <div class="layout-container">
      <Section 
        id="services" 
        title="Våra tjänster" 
        align="center"
        aria-label="Våra tjänster och lösningar"
      />
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

