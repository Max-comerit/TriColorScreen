<script setup lang="ts">
/**
 * ConfirmDialog Component
 *
 * @description A confirmation dialog that extends BaseModal with
 * Cancel and OK buttons in the footer. Perfect for confirming actions.
 */

// ===== IMPORTS =====
import BaseModal from '~/components/base/BaseModal.vue'
import TextButton from '../common/TextButton.vue'
import { TAP_ANIMATION_TIME } from '~/constants/ui'

// ===== TYPES =====
/** Props for ConfirmDialog component */
interface Props {
  /** Controls modal visibility via v-model */
  modelValue: boolean
  /** Title displayed in modal header */
  title?: string
  /** Label for cancel button - default: 'Cancel' */
  cancelLabel?: string
  /** Label for confirm button - default: 'OK' */
  confirmLabel?: string
  /** Close modal when clicking backdrop - default: false */
  closeOnBackdrop?: boolean
  /** Width of the modal */
  width?: string
  /** Height of the modal */
  height?: string
}

// ===== PROPS & EMITS =====
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  cancelLabel: 'Cancel',
  confirmLabel: 'OK',
  closeOnBackdrop: false,
  width: undefined,
  height: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()

// ===== METHODS =====
/**
 * Handle cancel button click
 */
async function handleCancel(): Promise<void> {
  // Delay validation TAP_ANIMATION_TIME ms to allow tap animation to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))

  emit('cancel')
  emit('update:modelValue', false)
}

/**
 * Handle confirm button click
 */
async function handleConfirm(): Promise<void> {
  // Delay validation TAP_ANIMATION_TIME ms to allow tap animation to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))
  
  emit('confirm')
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
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Body slot: Pass through to BaseModal -->
    <template #body>
      <slot />
    </template>

    <!-- Footer with Cancel and OK buttons -->
    <template #footer>
      <TextButton
        :label="props.cancelLabel"
        :background-color="'bg-neutral-100'"
        :background-color-hover="'hover:bg-neutral-200'"
        :color ="'text-neutral-900'"
        size="fit"
        :aria-label="props.cancelLabel"
        @click="handleCancel"
      />
      <TextButton
        :label="props.confirmLabel"
        size="fit"
        :aria-label="props.confirmLabel"
        @click="handleConfirm"
      />
    </template>
  </BaseModal>
</template>
