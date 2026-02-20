// components/common/HeroImage.vue

<script setup lang="ts">
/**
 * HeroImage Component
 *
 * @description A hero image component with overlay text for page headers.
 * Features optimized image loading with responsive sizing and accessible text overlay.
 *
 * @example
 * <HeroImage
 *   src="/images/index/hero-banner.png"
 *   title="Welcome to TriColor Screen"
 *   description="Professional screen printing services"
 *   :width="1920"
 *   :height="1280"
 *   alt="Team working on screen printing project"
 * />
 */

// ===== PROPS =====
interface Props {
  /** Image source path */
  src: string
  /** Page title displayed on hero (use slot for custom formatting) */
  title?: string
  /** Brief description text (use slot for custom formatting) */
  description?: string
  /** Image width for optimization */
  width?: number
  /** Image height for optimization */
  height?: number
  /** Descriptive alt text for accessibility */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Title Here',
  description: 'Description here',
  width: 1280,
  height: 854,
  alt: 'Hero banner image',
})

// ===== STATE =====
// Start true (matches server render); corrected on mount for old Safari.
// CSS.supports() does not read layout geometry so causes no forced reflow.
const supportsAspectRatio = ref(true)

// ===== COMPUTED =====
const aspectRatio = computed(() => {
  // Prevent division by zero
  if (!props.width || !props.height) return 3 / 2
  return props.width / props.height
})

// ===== METHODS =====
const containerStyle = computed(() =>
  supportsAspectRatio.value ? { aspectRatio: aspectRatio.value } : {}
)

// ===== LIFECYCLE =====
onMounted(() => {
  // Safari < 16.3 (March 2023) has an aspect-ratio bug in flex/grid containers.
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  if (!isSafari) return // non-Safari: keep true, no DOM update needed

  const m = navigator.userAgent.match(/Version\/(\d+)\.(\d+)/)
  if (!m) return
  const [major, minor] = [parseInt(m[1]), parseInt(m[2])]
  const hasBug = major < 16 || (major === 16 && minor < 3)
  if (hasBug) supportsAspectRatio.value = false
})

</script>

<template>
  <section
    class="container-section"
    :style="containerStyle"
  >
    <!-- Hero Image -->
    <NuxtImg
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      format="webp"
      quality="80"
      sizes="xl:100vw 1280px"
      densities="x1 x2"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Text Overlay -->
    <div class="overlay" role="presentation">
      <h1 class="title">
        <slot name="title">
          {{ props.title }}
        </slot>
      </h1>
      <slot name="description">
        <p class="description">{{ props.description }}</p>
      </slot>
    </div>
  </section>
</template>


<style scoped>
/* HeroImage Component Styles */

/* Container - styles for the hero image section */
.container-section {
  @apply relative w-full min-h-[50svh] max-h-[80svh] overflow-hidden;
}

/* Text Overlay - styles for the text container on the hero image */
.overlay {
  @apply absolute bottom-0 left-0 p-4 pr-6 sm:p-6 sm:pr-8 lg:p-8 lg:pr-10;
  @apply z-10 w-full sm:w-fit sm:rounded-tr-[30px] sm:max-w-screen-md;
  @apply bg-neutral-900/70 sm:backdrop-blur-sm;
}

/* Title styles */
.title {
  @apply text-2xl sm:text-3xl lg:text-4xl;
  @apply font-display font-bold text-white mb-3 md:mb-4;
}

/* Description styles */
.description {
  @apply mb-0 font-body font-medium text-base sm:text-lg lg:text-xl text-white/90;
}
</style>