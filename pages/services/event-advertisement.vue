<script setup lang="ts">
// ===== IMPORTS =====
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import TextButton from '~/components/common/TextButton.vue'
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import servicesData from '~/assets/json/services/event-advertisement/services.json'

// ===== PROPS & EMITS =====

// ===== COMPOSABLES =====
useHead({
  title: 'Allt för mässor & events | TriColorScreen',
  meta: [
    {
      name: 'description',
      content: 'Allt för mässor och events: skyltar, banderoller, dekaler, flaggor och profilkläder. TriColorScreen hjälper dig att skapa tydlig, professionell närvaro.',
    },
    {
      name: 'keywords',
      content: 'mässor, events, skyltar, banderoller, dekaler, flaggor, profilkläder, roll-ups, byggskyltar, skyltning',
    },
    {
      property: 'og:title',
      content: 'Allt för mässor & events | TriColorScreen',
    },
    {
      property: 'og:description',
      content: 'TriColorScreen hjälper dig att ta fram mässmaterial som skyltar, banderoller, dekaler, flaggor och profilkläder.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/images/services/event-advertisement/hero.png',
    },
  ],
})

// ===== STATE =====
const services = servicesData as IServiceCardContent[]

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  services.map((service) => ({
    type: 'service',
    data: {
      ...service,
      maxLines: 6,
    },
  }))
)

// ===== METHODS =====

// ===== LIFECYCLE HOOKS =====

// ===== WATCHERS =====
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage
      src="/images/services/event-advertisement/hero.png"
      title="Allt för mässor & events"
      description="Vid mässor, konferenser och andra event är det många olika bitar som skall fungera. TriColorScreen hjälper dig att ta fram mässmaterial som t.ex. skyltar, banderoller, dekaler, flaggor och profilkläder."
      :width="1280"
      :height="854"
      alt="Monter och profilmaterial för mässor och events"
    />

    <!-- Sections -->
    <div class="layout-container">
      <Section
        id="services"
        title="Event Reklam"
        align="center"
        aria-label="Våra tjänster för mässor och event"
      >
        <div class="flex flex-col gap-6">
          <CardGrid
            :card-content-arr="serviceCards"
            :min-item-width="240"
            :gap="24"
            aria-label="Tjänster för mässor och event"
            section-id="event-advertisement-services"
          />
        </div>
      </Section>
      <Section
        id="promo"
        title="Tricolorscreen får er att sticka ut på eventet!"
        align="center"
        aria-label="Tricolorscreen får er att sticka ut på eventet!"
      >
        <div class="items-center flex flex-col gap-6">
          <div class="w-full overflow-hidden rounded-card">
            <NuxtImg
              src="/images/services/event-advertisement/promo.jpg"
              alt="Profilmaterial för mässor och events"
              width="960"
              height="720"
              format="webp"
              quality="80"
              sizes="100vw sm:80vw lg:50vw"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          </div>
          <p class="font-semibold">20% Rabatt på er första event beställning!</p>
          <NuxtLink to="/contact" class="inline-flex">
            <TextButton>Kontakta oss</TextButton>
          </NuxtLink>
        </div>
      </Section>
    </div>
  </div>
</template>

