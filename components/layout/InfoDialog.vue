<script setup lang="ts">
/**
 * InfoDialog Component
 *
 * @description An information dialog that extends BaseModal with
 * a single OK button in the footer. Perfect for displaying information.
 */

// ===== IMPORTS =====
import BaseModal from '~/components/base/BaseModal.vue'
import type { InnerBorderStyle } from '~/components/base/BaseModal.vue'
import TextButton from '../common/TextButton.vue'

// ===== TYPES =====
/** Props for InfoDialog component */
interface Props {
  /** Controls modal visibility via v-model */
  modelValue: boolean
  /** Title displayed in modal header */
  title?: string
  /** Label for OK button - default: 'OK' */
  okLabel?: string
  /** Close modal when clicking backdrop - default: true */
  closeOnBackdrop?: boolean
  /** Width of the modal */
  width?: string
  /** Height of the modal */
  height?: string
  /** Inner border style for body - default: 'none' */
  innerBorder?: InnerBorderStyle
}

// ===== PROPS & EMITS =====
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  okLabel: 'OK',
  closeOnBackdrop: true,
  width: undefined,
  height: undefined,
  innerBorder: 'none',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

// ===== METHODS =====
/**
 * Handle OK button click
 */
function handleOk(): void {
  emit('close')
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="props.modelValue"
    :title="props.title"
    :close-on-backdrop="props.closeOnBackdrop"
    :width="props.width"
    :height="props.height"
    :inner-border="props.innerBorder"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Body slot: Pass through to BaseModal -->
    <template #body>
      <slot />
    </template>

    <!-- Footer with OK button -->
    <template #footer>
      <TextButton
        :label="props.okLabel"
        :background-color="'bg-primary-600'"
        :background-color-hover="'hover:bg-primary-700'"
        :color="'text-white'"
        size="fit"
        :aria-label="props.okLabel"
        @click="handleOk"
      />
    </template>
  </BaseModal>
</template>
