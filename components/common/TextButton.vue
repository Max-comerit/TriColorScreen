<script setup lang="ts">
/**
 * TextButton Component
 *
 * @description A text button component that wraps BaseButton and provides
 * flexible label usage through either a prop or a slot
 */

// ===== IMPORTS =====
import BaseButton from '../base/BaseButton.vue'

/** Available button style variants */
type Variant = 'primary' | 'secondary' | 'outline' | 'text'

/** Available button size options */
type Size = 'sm' | 'md' | 'lg'

/** Props for TextButton component */
interface Props {
  /** Button label text - default: '' */
  label?: string
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
  /** Optional custom text color */
  color?: string
}

withDefaults(defineProps<Props>(), {
  label: 'TextButton',
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
    @click="handleClick"
  >
    <!-- Use label slot if provided, otherwise use label prop -->
    <slot>{{ label }}</slot>
  </BaseButton>
</template>