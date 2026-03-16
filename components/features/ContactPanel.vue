<template>
  <section class="w-fit flex flex-col gap-4 p-6 bg-accent-100 rounded-card overflow-hidden">
    <!-- Telefon -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Telefon</h3>
      <address class="flex flex-col gap-1 text-base">
        <a href="tel:+46866530595" class="font-bold outline-visible-tight-link w-fit ">
          (+46) 08 665 30 95
        </a>
        <a href="tel:+46704964958" class="font-bold outline-visible-tight-link w-fit">
          (+46) 070 496 4958
        </a>
      </address>
    </div>

    <!-- Email -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Email</h3>
      <address class="flex flex-col gap-1 text-base">
        <a href="mailto:info@tricolorscreen.se" class="font-bold outline-visible-tight-link w-fit">
          info@tricolorscreen.se
        </a>
      </address>
    </div>

    <!-- Öppettider -->
    <div class="flex flex-col gap-2">
      <h3 class="m-0 text-lg font-semibold font-display text-primary">Öppettider</h3>
      <p class="font-bold text-base text-neutral-800">
        Måndag - Fredag: <span class="font-bold">10.00 - 17.00</span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static contact panel component - no props or state needed
</script>
