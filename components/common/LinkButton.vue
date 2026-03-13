<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import type { Size, Variant } from '../base/BaseButton.vue'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  to: RouteLocationRaw
  label?: string
  variant?: Variant
  size?: Size
  disabled?: boolean
  busy?: boolean
  backgroundColor?: string
  backgroundColorHover?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'LinkButton',
  variant: 'primary',
  size: 'responsive',
  disabled: false,
  busy: false,
  backgroundColor: undefined,
  backgroundColorHover: undefined,
  color: undefined,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isDisabled = computed(() => props.disabled || props.busy)

const baseClasses =
  'link-button inline-flex items-center justify-center font-medium rounded-button transition overflow-hidden ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 hover:text-white focus-visible:ring-primary-600 shadow-drop',
  secondary:
    'bg-secondary-300 text-black hover:bg-secondary-400 hover:text-black focus-visible:ring-secondary-600 shadow-drop',
  outline:
    'border border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-neutral-400 shadow-drop',
  text: 'text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-neutral-400',
}

const sizeClasses: Record<Size, string> = {
  responsive:
    'w-[140px] h-[50px] text-sm sm:w-[170px] sm:h-[60px] sm:text-base lg:w-[200px] lg:h-[70px] lg:text-lg',
  sm: 'w-[140px] h-[50px] text-sm',
  md: 'w-[170px] h-[60px] text-base',
  lg: 'w-[200px] h-[70px] text-lg',
  fit: 'w-fit h-fit p-3 text-sm sm:text-base md:text-lg lg:text-xl min-h-[44px] min-w-[44px] shrink-0',
}

const linkClasses = computed(() => {
  const classes = [baseClasses]

  const hasCustomBg = props.backgroundColor && props.backgroundColor.includes('-')
  const hasCustomColor = props.color && props.color.includes('-')

  if (!hasCustomBg && !hasCustomColor) {
    classes.push(variantClasses[props.variant])
  }

  classes.push(sizeClasses[props.size])

  if (props.backgroundColor && props.backgroundColor.includes('-')) {
    classes.push(props.backgroundColor)
  } else if (props.backgroundColor) {
    classes.push('has-custom-bg')
  }

  if (props.backgroundColorHover && props.backgroundColorHover.includes('-')) {
    classes.push(props.backgroundColorHover)
  }

  if (props.color && props.color.includes('-')) {
    classes.push(props.color)
  } else if (props.color) {
    classes.push('has-custom-color')
  }

  if (isDisabled.value) {
    classes.push('opacity-50 cursor-not-allowed pointer-events-none')
  }

  return classes
})

const linkStyle = computed(() => {
  const style: Record<string, string> = {}

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

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <NuxtLink
    v-bind="$attrs"
    :to="props.to"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :tabindex="isDisabled ? -1 : undefined"
    :class="linkClasses"
    :style="linkStyle"
    @click="onClick"
  >
    <span v-if="props.busy" class="flex items-center gap-2">
      <LoadingSpinner />
      <slot>{{ props.label }}</slot>
    </span>
    <span v-else>
      <slot>{{ props.label }}</slot>
    </span>
  </NuxtLink>
</template>

<style scoped>
.link-button.has-custom-bg {
  background-color: var(--btn-bg);
}

.link-button.has-custom-color {
  color: var(--btn-color);
}

.link-button.has-custom-bg:hover {
  background-color: var(--btn-bg-hover, var(--btn-bg));
}

.link-button.has-custom-color:hover {
  color: var(--btn-color);
}
</style>