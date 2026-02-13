<script setup lang="ts">
/**
 * TextButton Component
 *
 * @description A text button component that wraps BaseButton and provides
 * flexible label usage through either a prop or a slot
 */

// ===== IMPORTS =====
import BaseButton, { type Props as BaseButtonProps } from '../base/BaseButton.vue'

/** Props for TextButton component */
interface Props extends BaseButtonProps {
  /** Button label text - default: 'TextButton' */
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'TextButton',
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
    @click="handleClick"
  >
    <!-- Use label slot if provided, otherwise use label prop -->
    <span :class="{ 'px-3': size === 'fit' }">
      <slot>{{ label }}</slot>
    </span>
  </BaseButton>
</template>