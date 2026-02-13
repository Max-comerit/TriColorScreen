<script setup lang="ts">
/**
 * IconButton Component
 *
 * @description An icon button component that wraps BaseButton and provides
 * flexible icon usage through either a src prop or an icon slot.
 * Requires aria-label for accessibility.
 */

// ===== IMPORTS =====
import BaseButton, { type Props as BaseButtonProps } from '../base/BaseButton.vue'

/** Props for IconButton component */
interface Props extends BaseButtonProps {
  /** Icon image source (path or URL) - optional if using icon slot */
  iconSrc?: string
  /** Alt text for icon image - required when using iconSrc */
  iconAlt?: string
  /** ARIA label for accessibility - REQUIRED for icon-only buttons */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconSrc: undefined,
  iconAlt: '',
  ariaLabel: undefined,
  variant: 'primary',
  size: 'responsive',
  disabled: false,
  busy: false,
  backgroundColor: undefined,
  backgroundColorHover: undefined,
  color: undefined,
  type: 'button',
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
    :type="props.type"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :busy="props.busy"
    :background-color="props.backgroundColor"
    :background-color-hover="props.backgroundColorHover"
    :color="props.color"
    :aria-label="props.ariaLabel"
    class="icon-button"
    @click="handleClick"
  >
    <!-- Icon slot for custom icon components (e.g., SVG components) -->
    <slot name="icon">
      <!-- Fallback to img element if iconSrc prop is provided -->
      <img
        v-if="props.iconSrc"
        :src="props.iconSrc"
        :alt="props.iconAlt"
        :class="iconSize"
        class="icon-image"
        width="24"
        height="24"
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