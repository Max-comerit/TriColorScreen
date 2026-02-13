<!-- IconTextButton.vue -->
<script setup lang="ts">
/**
 * IconTextButton Component
 *
 * @description An icon & text button component that wraps BaseButton and
 * provides flexible icon and text usage through either props or slots.
 * Requires aria-label for accessibility.
 */

// ===== IMPORTS =====
import BaseButton, { type Props as BaseButtonProps } from '../base/BaseButton.vue'

/** Icon position relative to label */
type IconPosition = 'left' | 'right'

/** Props for IconTextButton component */
interface Props extends BaseButtonProps {
  /** Icon image source (path or URL) - optional if using icon slot */
  iconSrc?: string
  /** Button label text - default: 'IconTextButton' */
  label?: string
  /** Icon position relative to label - default: 'left' */
  iconPosition?: IconPosition
  /** Alt text for icon image - required when using iconSrc */
  iconAlt?: string
  /** ARIA label for accessibility - REQUIRED for icon-only buttons */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconSrc: undefined,
  iconAlt: '',
  label: 'IconTextButton',
  iconPosition: 'left',
  ariaLabel: undefined,
  variant: 'primary',
  size: 'responsive',
  disabled: false,
  busy: false,
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
    :busy="busy"
    :background-color="backgroundColor"
    :background-color-hover="backgroundColorHover"
    :color="color"
    :aria-label="ariaLabel"
    class="icon-text-button"
    @click="handleClick"
  >
    <div class="flex flex-row items-center justify-center gap-3" :class="{ 'flex-row-reverse': iconPosition === 'right', 'px-3': size === 'fit' } ">
      <!-- Icon slot for custom icon components (e.g., SVG components) -->
      <slot name="icon">
        <!-- Fallback to img element if iconSrc prop is provided -->
        <img
          v-if="iconSrc"
          :src="iconSrc"
          :alt="iconAlt"
          :class="iconSize"
          class="icon-image flex-shrink-0"
        >
      </slot>
      {{ label }}
    </div>
  </BaseButton>
</template>

<style scoped>
/* IconTextButton specific styles */
.icon-text-button {
  @apply inline-flex items-center justify-center;
}

.icon-image {
  @apply object-contain;
}

/* Ensure icon inherits color from parent when using color prop */
.icon-text-button :deep(svg) {
  @apply flex-shrink-0;
}

/* Apply custom color to SVG icons */
.icon-text-button :deep(svg path) {
  fill: currentColor;
}
</style>