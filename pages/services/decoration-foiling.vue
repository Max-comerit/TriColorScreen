// pages/services/decoration-foiling.vue

<script setup lang="ts">
// ===== IMPORTS =====
import CardGrid from '~/components/common/CardGrid.vue'
import HeroImage from '~/components/common/HeroImage.vue'
import HorizontalCard from '~/components/common/HorizontalCard.vue'
import Section from '~/components/common/Section.vue'
import { decorationFoilingServices, horizontalCards } from '~/utils/data/services/decoration-foiling/services'
import type { CardItem } from '~/types/CardContent'

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
      src="/images/services/decoration-foiling/car-decor.png"
      title="Dekor & Foliering som lämnar avtryck"
      description="Foliering är det smarta sättet att få fram budskap på ytor som annars är  svårtillgängliga för marknadsföring, exempelvis på glas och karosser"
      :width="1280"
      :height="854"
      alt="Professional screen printing equipment and process at TriColor Screen workshop"
    >
      <template #title>
        <span class="block">Dekor</span>
        <span class="block">Foliering</span>
      </template>
    </HeroImage>

    <!-- Sections -->
    <div class="layout-container">
      <Section
        id="decoration-foiling"
        align="center"
        aria-label="Bildekor och helfoliering"
      >
        <div class="flex flex-col gap-6">
          <HorizontalCard
            v-for="(card, index) in horizontalCards"
            :key="card.title"
            :title="card.title"
            :image-src="card.imageSrc"
            :image-alt="card.alt"
            :description="card.description"
            :image-first="index % 2 === 0 ? false : true"
            size="fit"
            cursor="default"
          />
        </div>
      </Section>
      <Section
        id="services"
        title="Våra tjänster"
        align="center"
        aria-label="Våra tjänster"
      >
        <div class="flex flex-col gap-6">
          <p class="mx-auto max-w-4xl text-base leading-relaxed text-neutral-700">
            Vi på TriColorScreen hjälper dig som privatperson eller er som företag med olika typer av bildekor och
            fordonsdekor samt helfoliering i Stockholm. Välj bland mängder av utföranden såsom blank, matt, metallic,
            chrome, chrome delete, print med mera. Vi hjälper dig även med stripning, bildekor, dekaler och solfilm.
          </p>
          <CardGrid
            :card-content-arr="decorationFoilingServices"
            :min-item-width="260"
            :gap="24"
            aria-label="Tjänster inom foliering och bildekor"
            section-id="decoration-foiling-services"
          />
        </div>
      </Section>
    </div>
  </div>
</template>

