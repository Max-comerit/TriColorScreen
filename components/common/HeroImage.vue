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
 *   src="/images/index/hero.jpg"
 *   :video-sources="[
 *     { src: '/videos/hero.webm', type: 'video/webm' },
 *     { src: '/videos/hero.mp4', type: 'video/mp4' }
 *   ]"
 *   title="Welcome to TriColor Screen"
 *   description="Professional screen printing services"
 *   :width="1280"
 *   :height="854"
 *   alt="Team working on screen printing project"
 * />
 */

// ===== IMPORTS =====
import type { VideoSource } from '~/types/HeroImage'

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
  /** Primary video sources (WebP format & MP4 format as fallback is recommended) */
  videoSources?: VideoSource[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Title Here',
  description: 'Description here',
  width: 1280,
  height: 854,
  alt: 'Hero banner image',
  videoSources: () => []
})

// ===== STATE =====
// Start true (matches server render); corrected on mount for old Safari.
// CSS.supports() does not read layout geometry so causes no forced reflow.
const supportsAspectRatio = ref(true)

// Video is injected into the DOM only after the page `load` event so it does
// not compete with the LCP image request. Once the video fires `canplay` the
// NuxtImg placeholder is hidden.
const videoMounted = ref(false)
const videoCanPlay = ref(false)

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
  if (isSafari) {
    const m = navigator.userAgent.match(/Version\/(\d+)\.(\d+)/)
    if (m) {
      const [major, minor] = [parseInt(m[1]), parseInt(m[2])]
      if (major < 16 || (major === 16 && minor < 3)) supportsAspectRatio.value = false
    }
  }

  // Mount video only after all page resources have loaded so it does not
  // compete with the LCP image. Handles the case where onMounted fires after
  // the load event (e.g. lazy-loaded components / navigations).
  if (props.videoSources.length > 0) {
    const initVideo = () => { videoMounted.value = true }
    if (document.readyState === 'complete') {
      initVideo()
    } else {
      window.addEventListener('load', initVideo, { once: true })
    }
  }
})

</script>

<template>
  <section
    class="container-section"
    :style="containerStyle"
  >
    <!-- Hero Image – eager LCP element; hidden once the video is ready to play -->
    <NuxtImg
      v-show="!videoCanPlay"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      format="webp"
      quality="80"
      sizes="xs:640px sm:768px md:1024px lg:1280px 1280px"
      densities="x1 x2"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
    />

    <!-- Video – injected after the page load event so it does not compete with LCP -->
    <video
      v-if="videoMounted"
      autoplay
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
      @canplay="videoCanPlay = true"
    >
      <source
        v-for="video in props.videoSources"
        :key="video.src"
        :src="video.src"
        :type="video.type"
      >
    </video>

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