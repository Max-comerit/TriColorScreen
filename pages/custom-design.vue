// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { defineAsyncComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useSiteUrl } from '~/composables/useSiteUrl'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'

// Lazy-load DesignPanel so Fabric.js is kept out of the shared synchronous bundle
const DesignPanel = defineAsyncComponent(() => import('~/components/features/DesignPanel.vue'))

// Lazy-load QuoteForm so Zod is kept out of the shared synchronous bundle
const QuoteForm = defineAsyncComponent(() => import('~/components/features/QuoteForm.vue'))

// ===== COMPOSABLES =====
const siteUrl = useSiteUrl()

useHead({
  title: 'Designa själv',
  meta: [
    {
      name: 'description',
      content: 'Skapa och designa egna trikåprodukter med vårt designverktyg. Ladda upp bilder, lägg till text och se resultatet innan produktion. Professionellt textiltryck och brodyr på t-shirts, kepsar och arbetskläder.',
    },
    {
      name: 'keywords',
      content: 'design t-shirt, custom t-shirt, eget tryck, textiltryck, brodyr, designverktyg, kepsar, arbetskläder, trikåprodukter, skjorttryck',
    },
    { property: 'og:title', content: 'Designa själv - Tricolor Screen' },
    {
      property: 'og:description',
      content: 'Skapa unika trikåprodukter med eget tryck. Använd vårt designverktyg för att ladda upp bilder och text. Professionell produktion av textiltryck och brodyr.',
    },
    { property: 'og:url', content: `${siteUrl}/custom-design` },
    { property: 'og:image', content: `${siteUrl}/images/custom-design/hero-v2.jpg` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Designa själv - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Skapa unika trikåprodukter med eget tryck. Använd vårt designverktyg för att ladda upp bilder och text.',
    },
    { name: 'twitter:image', content: `${siteUrl}/images/custom-design/hero-v2.jpg` },
  ],
})

// ===== STATE =====
// Track when user scrolls to the design section
const designSectionRef = ref<HTMLElement | null>(null)
const isDesignSectionVisible = ref(false)
let intersectionObserver: IntersectionObserver | null = null

// ===== LIFECYCLE HOOKS =====
onMounted(() => {
  if (!designSectionRef.value) return

  // Use IntersectionObserver to detect when design section comes into view
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Once visible, keep it visible (don't unload when user scrolls away)
        if (entry.isIntersecting && !isDesignSectionVisible.value) {
          // Add a small delay to ensure Suspense fallback shows
          // (even if modules are preloaded, users get visual feedback)
          setTimeout(() => {
            isDesignSectionVisible.value = true
          }, 100)
          // Disconnect observer once section is loaded
          intersectionObserver?.disconnect()
        }
      })
    },
    { threshold: 0.1 } // Trigger when 10% of section is visible
  )

  intersectionObserver.observe(designSectionRef.value)

  // Preload DesignPanel + QuoteForm after initial page load to avoid scroll stall
  const preloadModules = () => {
    import('~/components/features/DesignPanel.vue').catch(() => {}) // Silently fail if already loading
    import('~/components/features/QuoteForm.vue').catch(() => {})
  }

  if (document.readyState === 'complete') {
    // Page already fully loaded
    preloadModules()
  } else {
    // Wait for page load event
    window.addEventListener('load', preloadModules, { once: true })
  }
})

onBeforeUnmount(() => {
  intersectionObserver?.disconnect()
})


</script>

<template>
  <div>
    <!-- Hero: full width -->
    <HeroImage 
      src="/images/custom-design/hero-v2.jpg"
      title="Designa produkter med eget tryck"
      description="Skapa unika textilprodukter med vårt design verktyg. Ladda upp dina bilder, lägg till egen text och se resultatet innan produktion."
      :width="1280"
      :height="854"
      alt=""
    />

    <!-- Sections -->
    <div class="layout-container">
      <!-- Intro -->
      <Section
        id="intro"
        title="Skapa din egen design"
        aria-label="Hur du använder designverktyget"
        align="center"
         padding-y="pt-4 md:pt-6 lg:pt-8 xl:pt-12 2xl:pt-16"
      >
        <div class="mx-auto max-w-3xl space-y-4">
          <p class="leading-relaxed">
            Med vårt designverktyg kan du skapa exakt den produkt du drömmer om:
          </p>
          <ol>
            <li>Välj en produkt från
              <a
                href="https://www.jobmantexet.se"
                target="_blank"
                rel="noopener noreferrer"
                class="underline outline-visible-spaced-link"
              >Jobman Texets produktkatalog</a>
            </li>
            <li>Välj sedan samma produkt i designverktyget (t.ex. T-Shirt om du har valt en T-Shirt)</li>
            <li>Ladda upp bilder &amp; text och se hur det kommer att se ut innan du beställer</li>
            <li>Designa olika sidor (t.ex. Fram &amp; Bak) för en helt personlig produkt</li>
            <li>När du är nöjd med din design fyller du i din Kontakt Information samt Produkt ID &amp; Storlek på din produkt från
              <a
                href="https://www.jobmantexet.se"
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden="true"
                tabindex="-1"
                class="underline outline-visible-spaced-link"
              >Jobman Texets produktkatalog</a>
              i formuläret nedan</li>
              <li>Sedan skickar du en offertförfrågan direkt från verktyget</li>
          </ol>
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
        <div ref="designSectionRef">
          <Suspense>
            <template #default>
              <template v-if="isDesignSectionVisible">
                <DesignPanel />
                <!-- Offertformulär -->
                <div
                  class="mt-10 flex justify-center"
                  aria-label="Offertformulär"
                >
                  <QuoteForm />
                </div>
              </template>
            </template>
            <template #fallback>
              <div class="space-y-8">
                <div class="aspect-video bg-neutral-200 rounded-card flex items-center justify-center">
                  <p class="text-neutral-600 text-sm">Laddar designverktyg...</p>
                </div>
                <div class="mx-auto max-w-2xl h-40 bg-neutral-100 rounded-card" />
              </div>
            </template>
          </Suspense>
        </div>
      </Section>
    </div>
  </div>
</template>
