// pages/services/printed-matter.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { CardItem, IServiceCardContent } from '~/types/CardContent'
import services from '~/assets/json/services/printed-matter/services.json'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import Carousel from '~/components/common/Carousel.vue'
import TextButton from '~/components/common/TextButton.vue'

// ===== COMPOSABLES =====
useHead({
  title: 'Professionell trycksaksproduktion | Foldrar, Broschyrer, Visitkort | Tricolor Screen',
  meta: [
    {
      name: 'description',
      content: 'Tricolor Screen erbjuder högkvalitativ trycksaksproduktion: foldrar, broschyrer, visitkort, affischer, etiketter, kuvert, klistermärken, menyer och dekaler. 28 år av expertis i tryckbranschen.',
    },
    {
      name: 'keywords',
      content: 'trycksaker, foldrar, broschyrer, visitkort, affischer, etiketter, kuvert, klistermärken, menyer, dekaler, tryckeri, profiltryck, reklammaterial',
    },
    {
      property: 'og:title',
      content: 'Professionell trycksaksproduktion - Foldrar, Broschyrer & Visitkort',
    },
    {
      property: 'og:description',
      content: 'Högkvalitativa trycksaker för alla ändamål. Från designkoncept till leverans - Tricolor Screen har löst allt sedan 1998.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})

// ===== STATE (ref/reactive) =====
const servicesData = ref<IServiceCardContent[]>(
  (services as IServiceCardContent[]).map(item => ({ ...item, maxLines: 8 }))
)
const itemsPerPage = ref(1)

// ===== COMPUTED =====
const serviceCards = computed<CardItem[]>(() =>
  servicesData.value.map((item) => ({ type: 'service', data: item })),
)

// ===== LIFECYCLE HOOKS =====
const updateItemsPerPage = () => {
  const width = window.innerWidth
  if (width >= 1024) itemsPerPage.value = 3
  else if (width >= 640) itemsPerPage.value = 2
  else itemsPerPage.value = 1
}

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
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
        id="printed-matter" 
        title="Trycksaker" 
        align="center"
        aria-label="Våra trycksaker"
      >
        <!-- Carousel view -->
        <Carousel
          :items="serviceCards"
          :per-page="itemsPerPage"
          :gap-px="16"
          :loop="true"
          show-arrows
          show-dots
          aria-label="Trycksaker"
        />
        <p class="mt-6 text-center"><strong>Är det något som saknas?</strong></p>
        <p class="text-center"><strong>Kontakta oss!</strong></p>
        <p class="text-center"><strong>Vi trycker på alla sorters material för alla ändamål.</strong></p>
        <div class="mt-6 flex justify-center">
          <NuxtLink to="/contact" class="inline-block">
              <TextButton>Kontakta Oss</TextButton>
          </NuxtLink>
        </div>
      </Section>
    </div>
  </div>
</template>

