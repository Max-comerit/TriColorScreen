// pages/custom-design.vue

<script setup lang="ts">
// ===== IMPORTS =====
import type { Canvas } from 'fabric'
import { defineAsyncComponent, ref } from 'vue'
import { useSiteUrl } from '~/composables/useSiteUrl'
import ImageIcon from '~/assets/images/custom-design/image-icon.svg?component'
import TextIcon from '~/assets/images/custom-design/text-icon.svg?component'
import HeroImage from '~/components/common/HeroImage.vue'
import Section from '~/components/common/Section.vue'
import IconButton from '~/components/common/IconButton.vue'
import TextboxControls from '~/components/features/TextboxControls.vue'
import BackgroundSelector from '~/components/features/BackgroundSelector.vue'
import IconTextButton from '~/components/common/IconTextButton.vue'

// Lazy-load CanvasPanel and QuoteForm so Fabric.js and Zod are kept out of the shared synchronous bundle
const CanvasPanel = defineAsyncComponent(() => import('~/components/features/CanvasPanel.vue'))
const QuoteForm = defineAsyncComponent(() => import('~/components/features/QuoteForm.vue'))

// Dynamically import fonts to avoid blocking the main thread
if (import.meta.client) {
  import('~/assets/css/custom-design-fonts.css')
}

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

const fileInputRef = ref<HTMLInputElement | null>(null)
const image = ref<File | undefined>()
const textCnt = ref<number>(0) // Incrementing number to trigger reactivity in CanvasPanel when adding text
const canvasMap = ref<(Canvas | undefined)[]>([])
const activeCanvas = ref<Canvas | null>(null)

// ===== METHODS =====

/**
 * Trigger the hidden file input to open the file dialog for image selection.
 * The actual handling of the selected file is done in handleImageSelected.
 */
function uploadImage(): void {
  // Trigger file input dialog
  fileInputRef.value?.click()
}

/**
 * Handle image file selection, validate it's an image, and store it in state for the CanvasPanel to consume and add to the canvas.
 * Resets the file input value to allow selecting the same file again if needed.
 * 
 * @param event 
 */
async function handleImageSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate that it's an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  image.value = file

  // Reset input so same file can be selected again
  input.value = ''
}

function addText(): void {
  textCnt.value++
}

/**
 * Handle canvas map update event and store the updated map of canvas instances
 * @param newCanvasMap Updated array of canvas instances, indexed by side number
 */
function handleChangedCanvasMap(newCanvasMap: (Canvas | undefined)[]): void {
  canvasMap.value = newCanvasMap
}

/**
 * Handle active canvas update event and store the updated active canvas
 * @param canvas Updated active canvas instance or null
 */
function handleChangedActiveCanvas(canvas: Canvas | null): void {
  activeCanvas.value = canvas
}

// ===== LIFECYCLE HOOKS =====

// ===== WATCHERS =====

</script>

<template>
  <div>
    <!-- Hidden file input for image selection -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      @change="handleImageSelected"
    >


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
        <BackgroundSelector />
        <div class="designer grid grid-cols-1 sm:grid-cols-[1fr_minmax(350px,800px)_1fr] gap-4 items-start">
          <!-- Placeholder element to center canvas horizontally (must have same width as IconButton elements) -->
          <div class="hidden sm:block md:w-[48px]" />
          <CanvasPanel :image="image" :text-cnt="textCnt" @changed:canvas-map="handleChangedCanvasMap" @changed:active-canvas="handleChangedActiveCanvas" />
          <div class="flex flex-row sm:flex-col justify-center gap-3">
            <div class="xl:hidden">
              <IconButton
                aria-label="Upload image design"
                variant="primary"
                size="fit"
                class="w-fit"
                @click="uploadImage()"
              >
                <template #icon>
                  <ImageIcon class="!w-6 !h-6" />
                </template>
              </IconButton>
            </div>
            <div class="hidden xl:inline">
              <IconTextButton
                aria-label="Upload image design"
                variant="primary"
                size="fit"
                class="w-fit hidden xl:flex"
                label="Lägg till bild"
                background-color="bg-primary-700"
                color="white"
                @click="uploadImage()"
              >
                <template #icon>
                  <ImageIcon class="!w-6 !h-6" />
                </template>
              </IconTextButton>
            </div>
            <div class="xl:hidden">
            <IconButton
              aria-label="Add text design"
              variant="primary"
              size="fit"
              class="w-fit"
              @click="addText()"
            >
              <template #icon>
                <TextIcon class="!w-6 !h-6" />
              </template>
            </IconButton>
            </div>
             <div class="hidden xl:inline">
            <IconTextButton
              aria-label="Add text design"
              variant="primary"
              size="fit"
              class="w-fit"
              label="Lägg till text"
              background-color="bg-primary-700"
              color="white"
              @click="addText()"
            >
              <template #icon>
                <TextIcon class="!w-6 !h-6" />
              </template>
            </IconTextButton>
            </div>
          </div>
        </div>
        <TextboxControls :canvas="activeCanvas as any" />

        <!-- Offertformulär -->
        <div
          class="mt-10 flex justify-center"
          aria-label="Offertformulär"
        >
          <QuoteForm :canvas-map="canvasMap as any"/>
        </div>
      </Section>
    </div>
  </div>
</template>
