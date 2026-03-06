// components/common/TextCard.vue

<script setup lang="ts">
/**
 * TextCard Component
 *
 * @description A simple text-only card with an optional prefix (e.g. emoji or step number),
 * a title and a description. Useful for value propositions, process steps and feature lists.
 *
 */

// ===== IMPORTS =====

// ===== PROPS & EMITS =====
interface Props {
  /** Optional prefix displayed above the title – e.g. an emoji or a step number */
  prefix?: string
  /** Tailwind text-color class applied to the prefix */
  prefixColor?: string
  /** Card heading */
  title: string
  /** Descriptive body text */
  description?: string
  /** Text alignment for title and description */
  align?: 'left' | 'center'
  /** Tailwind background-color class */
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: undefined,
  prefixColor: 'text-primary-300',
  description: undefined,
  align: 'left',
  backgroundColor: 'bg-white',
})

// ===== COMPOSABLES & STORES =====

// ===== STATE =====

// ===== COMPUTED =====
const alignClass = computed(() =>
  props.align === 'center' ? 'text-center' : 'text-left',
)

// ===== METHODS =====

// ===== LIFECYCLE HOOKS =====

// ===== WATCHERS =====
</script>

<template>
  <div
    :class="[
      backgroundColor,
      alignClass,
      'flex flex-col rounded-card p-6 shadow-sm ring-1 ring-neutral-100',
    ]"
  >
    <!-- Prefix: step number or icon -->
    <p
      v-if="prefix"
      :class="[prefixColor, 'mb-3 font-display text-3xl font-bold']"
      aria-hidden="true"
    >
      {{ prefix }}
    </p>

    <!-- Title -->
    <h3 class="mb-10 flex items-center justify-center h-[4rem] line-clamp-2 font-display font-semibold">
      {{ title }}
    </h3>

    <!-- Description -->
    <p
      v-if="description"
      class="text-base leading-relaxed"
    >
      {{ description }}
    </p>
  </div>
</template>
