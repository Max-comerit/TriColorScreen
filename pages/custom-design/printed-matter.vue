// pages/custom-design/printed-matter.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { defineAsyncComponent } from 'vue'
import { useSiteUrl } from '~/composables/useSiteUrl'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'

// Lazy-load QuotePrintedMatterForm so Zod is kept out of the shared synchronous bundle
const QuotePrintedMatterForm = defineAsyncComponent(() => import('~/components/features/QuotePrintedMatterForm.vue'))

// ===== COMPOSABLES =====
const siteUrl = useSiteUrl()

useHead({
  title: 'Designa egna trycksaker',
  meta: [
    {
      name: 'description',
      content: 'Designa egna trycksaker med Tricolor Screen.',
    },
    {
      name: 'keywords',
      content: 'trycksaker, designa trycksaker, foldrar, broschyrer, affischer, visitkort, kuvert, menyer, bordsryttare',
    },
    { property: 'og:title', content: 'Designa egna trycksaker - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Skapa unika trycksaker med eget tryck. ',
    },
    { property: 'og:url', content: `${siteUrl}/custom-design/printed-matter` },
    { property: 'og:image', content: `${siteUrl}/images/custom-design/printed-matter/hero.jpg` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Designa egna trycksaker - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Skapa unika trycksaker med eget tryck.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/custom-design/printed-matter/hero.jpg` },
  ],
})
</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/custom-design/printed-matter/hero.jpg"
      title="Designa trycksaker med eget tryck"
      description="Designa dina unika trycksaker och ladda upp din design till oss."
      :width="1280"
      :height="854"
      alt=""
    />

    <!-- Sections -->
    <div class="layout-container">
      <!-- Intro -->
      <Section
        id="intro"
        title="Skapa dina egna trycksaker"
        aria-label="Hur du designar dina egna trycksaker"
        align="center"
         padding-y="pt-4 md:pt-6 lg:pt-8 xl:pt-12 2xl:pt-16"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Designa dina unika trycksaker och ladda upp din design till oss.
          </p>
          <p class="leading-relaxed">
            Vi återkommer snabbt med pris och leveranstid.
          </p>
        </div>
      </Section>

      <!-- Design Tool -->
      <Section
        id="services"
        align="center"
        aria-label="Design Verktyg"
      >
        <!-- Trycksaksformulär -->
        <div
          class="mt-10 flex justify-center"
          aria-label="Trycksaksformulär"
        >
          <QuotePrintedMatterForm />
        </div>
      </Section>
    </div>
  </div>
</template>
