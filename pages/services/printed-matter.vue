<script setup lang="ts">
// Printed Matter page
import HeroImage from '~/components/common/HeroImage.vue'

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
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      :width="1280"
      :height="854"
      alt="Tricolor Screen hero image"
    />

    <!-- Boxed content -->
    <div class="max-w-screen-xl mx-auto px-5 py-6">
      <section>
        <h2>Section 1</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </section>

      <section>
        <h2>Section 2</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis temporibus est velit provident blanditiis obcaecati veritatis ipsum inventore doloremque ab eum deleniti maxime dolor id, sit repellendus quisquam laudantium porro.</p>
      </section>
    </div>
  </div>
</template>

