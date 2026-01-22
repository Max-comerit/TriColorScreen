<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Spinner from '../common/LoadingSpinner.vue'

/** Available button style variants */
type Variant = 'primary' | 'secondary' | 'outline' | 'text'
/** Available button sizes */
type Size = 'sm' | 'md' | 'lg'

/** Props for BaseButton component */
interface Props {
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
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  backgroundColor: undefined,
})

/** Passthrough attributes (aria-label, aria-describedby, etc.) */
const attrs = useAttrs()

/** Emitted when button is clicked */
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/** Disable button when either disabled prop is true or loading is true */
const isDisabled = computed(() => props.disabled || props.loading)

/** Base button classes shared across all variants */
const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-[16px] transition ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

/** Variant-specific styling */
const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-700 focus-visible:ring-primary-600 shadow-drop',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-700 focus-visible:ring-secondary-600 shadow-drop',
  outline:
    'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400 shadow-drop',
  text:
    'text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
}

/** Size-specific dimensions and typography */
const sizeClasses: Record<Size, string> = {
  sm: 'w-[140px] h-[50px] text-sm',
  md: 'w-[170px] h-[60px] text-base',
  lg: 'w-[200px] h-[70px] text-lg',
}

/** Combine all computed classes */
const buttonClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
])

/** Apply custom background color if provided */
const buttonStyle = computed(() =>
  props.backgroundColor ? { backgroundColor: props.backgroundColor } : undefined
)

/** Handle click event - prevents click when disabled or loading */
function onClick(event: MouseEvent) {
  if (isDisabled.value) return
  emit('click', event)
}
</script>


<template>
  <button
    type="button"
    v-bind="attrs"
    :disabled="isDisabled"
    :class="buttonClasses"
    :style="buttonStyle"
    :aria-busy="props.loading"
    @click="onClick"
  >
    <span v-if="props.loading" class="flex items-center gap-2">
      <Spinner />
      <span class="sr-only">Loading</span>
    </span>

    <span v-else>
      <slot />
    </span>
  </button>
</template>
