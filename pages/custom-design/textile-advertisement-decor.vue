// pages/custom-design/textile-advertisement-decor.vue

<script setup lang="ts">
// ===== IMPORTS =====
import { useSiteUrl } from '~/composables/useSiteUrl'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'

// Lazy-load DesignPanel so Fabric.js is kept out of the shared synchronous bundle
const DesignPanel = defineAsyncComponent(() => import('~/components/features/DesignPanel.vue'))

// Lazy-load QuoteTextilesForm so Zod is kept out of the shared synchronous bundle
const QuoteTextilesForm = defineAsyncComponent(() => import('~/components/features/QuoteTextilesForm.vue'))

const HERO_IMAGE = '/images/custom-design/textile-advertisement-decor/hero-v2.jpg'

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
    { property: 'og:url', content: `${siteUrl}/custom-design/textile-advertisement-decor` },
    { property: 'og:image', content: `${siteUrl}${HERO_IMAGE}` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '854' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:title', content: 'Designa själv - Tricolor Screen' },
    {
      name: 'twitter:description',
      content: 'Skapa unika trikåprodukter med eget tryck. Använd vårt designverktyg för att ladda upp bilder och text.',
    },
    { name: 'twitter:image', content: `${siteUrl}${HERO_IMAGE}` },
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
          isDesignSectionVisible.value = true
          // Disconnect observer once section is loaded
          intersectionObserver?.disconnect()
        }
      })
    },
    { rootMargin: '1000px' } // Start rendering way before it's visible so it's ready when user scrolls to it
  )

  intersectionObserver.observe(designSectionRef.value)

  // Load DesignPanel after initial page load to avoid scroll stall
  const loadModules = () => {
    import('~/components/features/DesignPanel.vue').catch(() => {}) // Silently fail if already loading
  }

  if (document.readyState === 'complete') {
    // Page already fully loaded
    loadModules()
  } else {
    // Load DesignPanel after the initial page load event
    window.addEventListener('load', loadModules, { once: true })
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
      :src="HERO_IMAGE"
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
            <li>Välj sedan <strong>Kategori: Textil</strong> eller <strong>Arbetskläder</strong> och <strong>Produkt</strong> i designverktyget nedan (t.ex. T-Shirt om du har valt en T-Shirt i Jobman Texets produktkatalog)</li>
            <li><strong>Lägg till bilder</strong> &amp; <strong>text</strong> och se hur det kommer att se ut innan du beställer</li>
            <li>Designa olika <strong>Sidor</strong> (t.ex. Fram &amp; Bak) för en helt personlig produkt</li>
            <li>När du är nöjd med din design fyller du i din <strong>Produkt ID</strong> &amp; <strong>Storlek</strong> på din produkt från Jobman Texets produktkatalog i formuläret nedan</li>
            <li>Fyll i <strong>Antal</strong> och eventuell övrig information i <strong>Meddelande</strong></li>
            <li>Fyll i kontakt uppgifter (<strong>Namn</strong>, <strong>E-post</strong>, <strong>Telefon</strong>) och <strong>Kundtyp</strong></li>
            <li>Sedan skickar du en offertförfrågan direkt från verktyget</li>
          </ol>
          <p class="leading-relaxed">
            Vi återkommer snabbt med pris och leveranstid.
          </p>
          <p class="leading-normal">
            <em>Du kan även designa dina egna produkter i vårt designverktyg genom att välja <strong>Kategori: Övrigt</strong> och <strong>Sidan</strong> du vill trycka på, och sedan ladda upp bilder av din egen produkt.</em>
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
          <template v-if="isDesignSectionVisible">
            <DesignPanel />
          </template>
          <template v-else>
            <div class="space-y-8 flex flex-col items-center justify-center py-12">
              <LoadingSpinner type="page" />
              <p class="text-neutral-600 text-sm mt-4">Laddar designverktyg...</p>
            </div>
          </template>
        </div>
        <!-- Offertformulär -->
        <div
          class="mt-10 flex justify-center"
          aria-label="Offertformulär"
        >
          <QuoteTextilesForm />
        </div>
      </Section>
    </div>
  </div>
</template>
