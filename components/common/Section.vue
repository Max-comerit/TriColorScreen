// components/common/Section.vue

<script setup lang="ts">
/**
 * Section Component
 *
 * A reusable semantic section container with optional header, description and customizable styling.
 * Provides consistent spacing and responsive layout for page sections.
 */

/** Props interface for Section component */
interface Props {
  /** Section heading text (optional) */
  title?: string
  /** Section description text displayed below title (optional) */
  description?: string
  /** Unique ID for the section (used for navigation/anchors) */
  id?: string
  /** Tailwind background color class */
  backgroundColor?: string
  /** Tailwind text color class for title and description */
  textColor?: string
  /** Whether to constrain content width with container */
  contained?: boolean
  /** Text alignment for header */
  align?: 'left' | 'center' | 'right'
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Tailwind padding-y class */
  paddingY?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  id: undefined,
  backgroundColor: 'bg-transparent',
  textColor: 'text-neutral-900',
  contained: true,
  align: 'left',
  ariaLabel: undefined,
  paddingY: 'py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-12',
})

// ===== COMPUTED =====
/** Computed class for text alignment */
const alignClass = computed(() => {
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[props.align]
})
</script>

<template>
  <section
    :id="id"
    :class="[backgroundColor, textColor, paddingY]"
    :aria-label="ariaLabel || title"
  >
    <div :class="{ 'container mx-auto': contained }">
      <!-- Section header (optional) -->
      <header v-if="title || description" :class="['mb-8 md:mb-12', alignClass]">
        <!-- Section title -->
        <h2
          v-if="title"
          class="font-display"
        >
          {{ title }}
        </h2>

        <!-- Section description -->
        <p
          v-if="description"
          class="mt-4 font-sans leading-relaxed"
          :class="{ 'mx-auto max-w-3xl': align === 'center' }"
        >
          {{ description }}
        </p>
      </header>

      <!-- Main content slot -->
      <slot />
    </div>
  </section>
</template>