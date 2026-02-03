<script setup lang="ts">
/**
 * BaseModal Component
 *
 * @description A modal dialog component with keyboard support (ESC to close),
 * accessibility features, and customizable title and action buttons.
 * Uses v-model for controlling visibility and emits confirm event on OK.
 */

// ===== TYPES =====
/** Props for BaseModal component */
interface Props {
  /** Controls modal visibility via v-model */
  modelValue: boolean
  /** Title displayed in modal header */
  title?: string
  /** Whether clicking on backdrop closes the modal */
  closeOnBackdrop?: boolean
  /** Width of the modal */
  width?: string
  /** Height of the modal */
  height?: string
}

// ===== PROPS & EMITS =====
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  closeOnBackdrop: false,
  width: 'fit-content',
  height: 'fit-content',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// ===== METHODS =====
/**
 * Close modal by emitting update:modelValue event
 */
function close(): void {
  emit('update:modelValue', false)
}

// ===== LIFECYCLE HOOKS =====
/**
 * Setup keyboard support (ESC key) to close modal
 */
onMounted(() => {
  const handler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close()
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
  })
})
</script>

<template>
  <Teleport to="body">
    <!-- Modal Backdrop -->
    <div
      v-if="props.modelValue"
      class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      @click.self="props.closeOnBackdrop ? close() : null"
    >
      <!-- Modal Dialog -->
      <dialog
        open
        class="bg-white p-7 min-w-48 max-w-[calc(100vw_-_2rem)] rounded-modal shadow-drop relative"
        :style="{ width: props.width, height: props.height }"
        :aria-labelledby="props.title ? 'modal-title' : undefined"
      >
        <!-- Close Button -->
        <button
          aria-label="Close dialog"
          class="absolute top-2 right-4 p-4 sm:p-4 md:p-3 lg:p-3 border-none bg-transparent text-lg sm:text-lg md:text-xl lg:text-2xl cursor-pointer text-neutral-500 hover:text-neutral-900 transition-colors"
          @click="close"
        >
          X
        </button>

        <!-- Header -->
        <header v-if="props.title">
          <h2
            id="modal-title"
            class="m-0 text-lg md:text-xl lg:text-[22px] lg:leading-[30px] font-semibold text-neutral-900"
          >
            <strong>{{ props.title }}</strong>
          </h2>
        </header>

        <!-- Body Slot -->
        <section class="py-5 text-neutral-700">
          <slot name="body" />
        </section>

        <!-- Footer Slot -->
        <footer class="pt-5 flex flex-wrap justify-end gap-4 border-t border-neutral-200">
          <slot name="footer" />
        </footer>
      </dialog>
    </div>
  </Teleport>
</template>