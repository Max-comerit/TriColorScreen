<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

/** Available button style variants */
type Variant = 'primary' | 'secondary' | 'outline' | 'text'

/** Available button size options */
type Size = 'sm' | 'md' | 'lg' | 'fit'

/** Props for BaseButton component */
export interface Props {
  /** Button style variant - default: 'primary' */
  variant?: Variant
  /** Button size - default: 'md' */
  size?: Size
  /** Disable button interaction - default: false */
  disabled?: boolean
  /** Show loading state with spinner - default: false */
  loading?: boolean
  /** Optional custom background color (hex, rgb, var, Tailwind CSS classes, etc.) */
  backgroundColor?: string
  /** Optional custom background color on hover state (hex, rgb, var, Tailwind CSS classes, etc.) */
  backgroundColorHover?: string
  /** Optional custom text color (hex, rgb, var, Tailwind CSS classes, etc.) */
  color?: string
}

export type { Variant, Size }

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  backgroundColor: undefined,
  backgroundColorHover: undefined,
  color: undefined,
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
  'base-button inline-flex items-center justify-center font-medium rounded-button transition overflow-hidden ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

/** Variant-specific styling (colors, text, shadows) */
const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-700 focus-visible:ring-primary-600 shadow-drop',
  secondary:
    'bg-secondary-300 text-black hover:bg-secondary-400 focus-visible:ring-secondary-600 shadow-drop',
  outline:
    'border border-neutral-300 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400 shadow-drop',
  text: 'text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400',
}

/** Size-specific dimensions and typography */
const sizeClasses: Record<Size, string> = {
  sm: 'w-[140px] h-[50px] text-sm',
  md: 'w-[170px] h-[60px] text-base',
  lg: 'w-[200px] h-[70px] text-lg',
  fit: 'w-fit h-fit p-3 text-sm sm:text-base md:text-lg lg:text-xl min-h-[44px] min-w-[44px] shrink-0',
}

/** Combine all computed classes and add flag for custom background colors */
const buttonClasses = computed(() => {
  const classes = [baseClasses]

  // Only apply variant classes if not using custom background or color
  const hasCustomBg = props.backgroundColor && props.backgroundColor.includes('-')
  const hasCustomColor = props.color && props.color.includes('-')

  if (!hasCustomBg && !hasCustomColor) {
    classes.push(variantClasses[props.variant])
  }

  classes.push(sizeClasses[props.size])

  // Add backgroundColor as Tailwind class if it looks like one
  if (props.backgroundColor && props.backgroundColor.includes('-')) {
    classes.push(props.backgroundColor)
  } else if (props.backgroundColor) {
    classes.push('has-custom-bg')
  }

  // Add backgroundColorHover as Tailwind class if it looks like one (for hover state)
  // Note: For Tailwind hover classes, they should be passed with the hover: prefix
  if (props.backgroundColorHover && props.backgroundColorHover.includes('-')) {
    classes.push(props.backgroundColorHover)
  }

  // Add color as Tailwind class if it looks like one
  if (props.color && props.color.includes('-')) {
    classes.push(props.color)
  } else if (props.color) {
    classes.push('has-custom-color')
  }

  return classes
})

/**
 * Expose CSS variables for custom background colors (non-Tailwind values only)
 * Uses CSS custom properties to allow styling in the <style> block
 * --btn-bg: primary background color (if backgroundColor prop is a CSS value)
 * --btn-bg-hover: hover background color (if backgroundColorHover prop is a CSS value)
 */
const buttonStyle = computed(() => {
  const style: Record<string, string> = {}

  // Only use CSS variables if the values don't look like Tailwind classes
  if (props.backgroundColor && !props.backgroundColor.includes('-')) {
    style['--btn-bg'] = props.backgroundColor
  }

  if (props.backgroundColorHover && !props.backgroundColorHover.includes('-')) {
    style['--btn-bg-hover'] = props.backgroundColorHover
  }

  if (props.color && !props.color.includes('-')) {
    style['--btn-color'] = props.color
  }

  return style
})

/** Handle click event - prevents click when disabled or loading */
function onClick(event: MouseEvent) {
  if (isDisabled.value) return
  emit('click', event)
}
</script>

<template>
  <!-- Main button element with conditional classes and styles -->
  <button
    type="button"
    v-bind="attrs"
    :disabled="isDisabled"
    :class="buttonClasses"
    :style="buttonStyle"
    :aria-busy="props.loading"
    @click="onClick"
  >
    <!-- Loading state: Show spinner and loading indicator -->
    <span v-if="props.loading" class="flex items-center gap-2">
      <LoadingSpinner />
      <span class="sr-only">Loading</span>
    </span>

    <!-- Default state: Render slot content -->
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<style scoped>
/* Apply custom background color when has-custom-bg class is present */
.base-button.has-custom-bg {
  background-color: var(--btn-bg);
}
.base-button.has-custom-color {
  color: var(--btn-color);
}
/* Apply hover background color (fallback to primary bg if hover color not provided) */
.base-button.has-custom-bg:hover:not(:disabled) {
  background-color: var(--btn-bg-hover, var(--btn-bg));
}

/* Disabled button styling */
.base-button:disabled {
  color: black;
  @apply bg-neutral-400;
}
</style>
