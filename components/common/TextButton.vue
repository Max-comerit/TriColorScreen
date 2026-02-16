<script setup lang="ts">
/**
 * TextButton Component
 *
 * @description A text button component that wraps BaseButton and provides
 * flexible label usage through either a prop or a slot
 */

// ===== IMPORTS =====
import BaseButton, { type Props as BaseButtonProps } from '../base/BaseButton.vue'

defineOptions({
  inheritAttrs: false,
})

/** Props for TextButton component */
interface Props extends BaseButtonProps {
  /** Button label text - default: 'TextButton' */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'TextButton',
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
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    :type="props.type"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :busy="props.busy"
    :background-color="props.backgroundColor"
    :background-color-hover="props.backgroundColorHover"
    :color="props.color"
    @click="handleClick"
  >
    <!-- Use label slot if provided, otherwise use label prop -->
    <span :class="{ 'px-3': props.size === 'fit' }">
      <slot>{{ props.label }}</slot>
    </span>
  </BaseButton>
</template>