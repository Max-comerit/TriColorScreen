<script setup lang="ts">
import BragBar from '~/components/features/BragBar.vue';

// Index page
useHead({
  title: 'Tricolor Screen - Vi hjälper dig med allt inom reklam/profiltryck, brodyr/ textiltryck/ bildekor/ bilfoliering',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder reklam- och profiltryck, brodyr, textiltryck, bildekor och bilfoliering. Professionella lösningar för företag och privatpersoner.',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
})
</script>

<template>
  <main>
    <!-- Index page content -->
         <BragBar />

  </main>
</template>
