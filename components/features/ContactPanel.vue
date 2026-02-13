<template>
  <section class="w-fit flex flex-col gap-4 p-6 bg-accent-200 rounded-card shadow-drop overflow-hidden">
    <!-- Telefon -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Telefon</h3>
      <div class="flex flex-col gap-1 text-base text-gray-700">
        <a href="tel:+46866530595" class="font-bold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
          (+46) 08 665 30 95
        </a>
        <a href="tel:+46704964958" class="font-bold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
          (+46) 070 496 4958
        </a>
      </div>
    </div>

    <!-- Email -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Email</h3>
      <a href="mailto:info@tricolorscreen.se" class="font-bold text-base text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded w-fit">
        info@tricolorscreen.se
      </a>
    </div>

    <!-- Öppettider -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Öppettider</h3>
      <p class="font-bold text-base text-gray-700">
        Måndag - Fredag: <span class="font-bold">10.00 - 17.00</span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static contact panel component - no props or state needed
</script>
