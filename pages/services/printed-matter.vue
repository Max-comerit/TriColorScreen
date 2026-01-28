<script setup lang="ts">
// Printed Matter page
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
    <header class="w-full relative max-h-[80vh] overflow-hidden">
      <!-- Hero image placeholder or NuxtImage -->
      <NuxtImg
        src="/images/index/hero.png"
        alt="Hero Image"
        class="w-full object-cover"
        style="aspect-ratio: 3/2; max-height: 80vh;"
      />
      <!-- Overlay text -->
      <div class="absolute bottom-0 left-0 p-3 md:p-6 z-10 bg-black/50 backdrop-blur-sm sm:rounded-tr-xl w-full md:w-auto max-w-screen-lg">
        <h1 class="text-white">
          Tricolor Screen
        </h1>
        <p class="font-bold text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
    </header>

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
