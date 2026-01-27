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
  width: 1920,
  height: 1280,
  alt: 'Hero banner image',
})
</script>

<template>
  <section class="container-section">
    <!-- Hero Image -->
    <NuxtImg
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      format="webp"
      fit="cover"
      quality="80"
      sizes="sm:100vw md:100vw lg:1280px"
      loading="eager"
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Text Overlay -->
    <div class="overlay">
      <h1 class="title">
        <slot name="title">
          {{ props.title }}
        </slot>
      </h1>
      <div class="description">
        <slot name="description">
          <p>{{ props.description }}</p>
        </slot>
      </div>
    </div>
  </section>
</template>


<style scoped>
/* HeroImage Component Styles */

/* Container - styles for the hero image section */
.container-section {
  @apply relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden;
}

/* Text Overlay - styles for the text container on the hero image */
.overlay {
  @apply absolute bottom-0 left-0 p-4 pr-6 md:p-6 md:pr-8 lg:p-8 lg:pr-10;
  @apply z-10 w-full sm:w-fit sm:rounded-tr-[30px] max-w-3xl;
  @apply bg-neutral-900/70 sm:backdrop-blur-sm;
}

/* Title styles */
.title {
  @apply text-2xl md:text-3xl lg:text-4xl xl:text-5xl;
  @apply font-display font-bold text-white mb-3 md:mb-4;
}

/* Description styles */
.description {
  @apply font-body font-medium text-base md:text-lg lg:text-xl text-white/90;
}
</style>