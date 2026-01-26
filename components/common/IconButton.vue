<script setup lang="ts">
/**
 * IconButton Component
 *
 * @description An icon button component that wraps BaseButton and provides
 * flexible icon usage through either a src prop or an icon slot.
 * Requires aria-label for accessibility.
 */

// ===== IMPORTS =====
import BaseButton from '../base/BaseButton.vue'

/** Available button style variants */
type Variant = 'primary' | 'secondary' | 'outline' | 'text'

/** Available button size options */
type Size = 'sm' | 'md' | 'lg' | 'fit'

/** Props for IconButton component */
interface Props {
  /** Icon image source (path or URL) - optional if using icon slot */
  iconSrc?: string
  /** Alt text for icon image - required when using iconSrc */
  iconAlt?: string
  /** ARIA label for accessibility - REQUIRED for icon-only buttons */
  ariaLabel?: string
  /** Button style variant - default: 'primary' */
  variant?: Variant
  /** Button size - default: 'md' */
  size?: Size
  /** Disable button interaction - default: false */
  disabled?: boolean
  /** Show loading state with spinner - default: false */
  loading?: boolean
  /** Optional custom background color (hex, rgb, var, etc.) */
  backgroundColor?: string
  /** Optional custom background color on hover state */
  backgroundColorHover?: string
  /** Optional custom icon color */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconSrc: undefined,
  iconAlt: '',
  ariaLabel: undefined,
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  backgroundColor: undefined,
  backgroundColorHover: undefined,
  color: undefined,
})

/** Emitted when button is clicked */
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent): void => {
  emit('click', event)
}

/** Icon size based on button size */
const iconSize = computed(() => {
  switch (props.size) {
    case 'fit':
      return 'w-6 h-6'
    case 'sm':
      return 'w-5 h-5'
    case 'md':
      return 'w-6 h-6'
    case 'lg':
      return 'w-8 h-8'
    default:
      return 'w-6 h-6'
  }
})
</script>

<template>
  <BaseButton
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :background-color="backgroundColor"
    :background-color-hover="backgroundColorHover"
    :color="color"
    :aria-label="ariaLabel"
    class="icon-button"
    @click="handleClick"
  >
    <!-- Icon slot for custom icon components (e.g., SVG components) -->
    <slot name="icon">
      <!-- Fallback to img element if iconSrc prop is provided -->
      <img
        v-if="iconSrc"
        :src="iconSrc"
        :alt="iconAlt"
        :class="iconSize"
        class="icon-image"
      >
    </slot>
  </BaseButton>
</template>

<style scoped>
/* Icon button specific styles */
.icon-button {
  @apply flex items-center justify-center;
}

.icon-image {
  @apply object-contain;
}

/* Ensure icon inherits color from parent when using color prop */
.icon-button :deep(svg) {
  @apply w-full h-full;
}

/* Apply custom color to SVG icons */
.icon-button :deep(svg path) {
  fill: currentColor;
}
</style>