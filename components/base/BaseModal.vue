<script setup lang="ts">
/**
 * BaseModal Component
 *
 * @description A modal dialog component with keyboard support (ESC to close),
 * accessibility features, and customizable title and action buttons.
 * Uses v-model for controlling visibility and emits confirm event on OK.
 */

// ===== IMPORTS =====
import { watch, nextTick, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
import CloseIcon from '~/assets/images/common/close-icon.svg?component'

// ===== TYPES =====
/** Inner border style type */
export type ModalInnerBorderStyle = 'none' | 'sunken'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled]):not([readonly])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ')

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
  /** Inner border style for body - default: 'none' */
  innerBorder?: ModalInnerBorderStyle
}

// ===== PROPS & EMITS =====
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  closeOnBackdrop: false,
  width: 'fit-content',
  height: 'fit-content',
  innerBorder: 'none',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// ===== STATE =====
const modalBodyRef = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLDialogElement | null>(null)
const touchStartY = ref<number>(0)
const previouslyFocusedElement = ref<HTMLElement | null>(null)
let initialFocusFrameId: number | null = null
let restoreFocusFrameId: number | null = null

// ===== METHODS =====
function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[]
}

/**
 * Save the currently focused element so it can be restored when the modal closes.
 */
function savePreviouslyFocusedElement(): void {
  const activeElement = document.activeElement

  if (activeElement instanceof HTMLElement && activeElement !== document.body) {
    previouslyFocusedElement.value = activeElement
  } else {
    previouslyFocusedElement.value = null
  }
}

/**
 * Restore focus to the element that had focus before the modal opened.
 * The focus move is deferred until the modal has been removed from the DOM
 * and the triggering click/keydown event has fully settled.
 */
function restoreFocus(): void {
  const elementToFocus = previouslyFocusedElement.value
  previouslyFocusedElement.value = null

  if (!elementToFocus) return

  if (restoreFocusFrameId !== null) {
    cancelAnimationFrame(restoreFocusFrameId)
  }

  nextTick(() => {
    restoreFocusFrameId = window.requestAnimationFrame(() => {
      restoreFocusFrameId = null

      if (elementToFocus.isConnected && !elementToFocus.hasAttribute('disabled')) {
        elementToFocus.focus({ preventScroll: true })
      }
    })
  })
}

/**
 * Close modal by emitting update:modelValue event
 */
function close(): void {
  emit('update:modelValue', false)
}

/**
 * Handle wheel scroll to prevent scroll propagation at boundaries
 */
function handleWheelScroll(e: WheelEvent): void {
  const element = modalBodyRef.value
  if (!element) return

  const isAtTop = element.scrollTop === 0
  const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 1

  // Prevent scrolling parent if at top and scrolling up, or at bottom and scrolling down
  if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
    e.preventDefault()
  }
}

/**
 * Handle touch start to track initial Y position
 */
function handleTouchStart(e: TouchEvent): void {
  touchStartY.value = e.touches[0].clientY
}

/**
 * Handle touch move to prevent scroll propagation at boundaries
 */
function handleTouchMove(e: TouchEvent): void {
  const element = modalBodyRef.value
  if (!element) return

  const touchY = e.touches[0].clientY
  const deltaY = touchStartY.value - touchY // Positive = scrolling down, negative = scrolling up

  const isAtTop = element.scrollTop === 0
  const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 1

  // Prevent scrolling parent if at top and scrolling up, or at bottom and scrolling down
  if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
    e.preventDefault()
  }
}

/**
 * Handle keyboard navigation and events within modal
 */
function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    close()
  }

  // Focus trap: keep Tab navigation within the modal
  const modalElement = dialogRef.value
  if (e.key === 'Tab' && modalElement) {
    const focusableArray = getFocusableElements(modalElement)

    if (focusableArray.length === 0) return

    const firstElement = focusableArray[0]
    const lastElement = focusableArray[focusableArray.length - 1]

    // If focus has escaped the modal, redirect it back in
    if (!modalElement.contains(document.activeElement)) {
      e.preventDefault()
      if (e.shiftKey) {
        lastElement.focus()
      } else {
        firstElement.focus()
      }
      return
    }

    if (e.shiftKey) {
      // Shift + Tab: if on first element, go to last
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }
}

/**
 * Set focus to first focusable element when modal opens
 */
function setInitialFocus(): void {
  nextTick(() => {
    if (initialFocusFrameId !== null) {
      cancelAnimationFrame(initialFocusFrameId)
    }

    const modalElement = dialogRef.value
    if (!modalElement) return

    initialFocusFrameId = window.requestAnimationFrame(() => {
      initialFocusFrameId = null

      const firstElement = getFocusableElements(modalElement)[0]

      if (firstElement) {
        firstElement.focus({ preventScroll: true })
      } else {
        modalElement.focus({ preventScroll: true })
      }
    })
  })
}

// ===== LIFECYCLE HOOKS =====
/**
 * Setup keyboard support (ESC key) to close modal
 * and Tab key to manage focus within modal
 */
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)

  if (props.modelValue) {
    savePreviouslyFocusedElement()
    setInitialFocus()
  }
})

onBeforeUnmount(() => {
  if (previouslyFocusedElement.value) {
    restoreFocus()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)

  if (initialFocusFrameId !== null) {
    cancelAnimationFrame(initialFocusFrameId)
  }

  if (restoreFocusFrameId !== null) {
    cancelAnimationFrame(restoreFocusFrameId)
  }
})

// ===== WATCHERS =====
/**
 * Manage focus when the modal opens and closes.
 */
watch(
  () => props.modelValue,
  (isOpen, wasOpen) => {
    if (isOpen && !wasOpen) {
      savePreviouslyFocusedElement()
      setInitialFocus()
    }

    if (!isOpen && wasOpen) {
      restoreFocus()
    }
  }
)
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Modal Backdrop -->
      <div
        v-if="props.modelValue"
        class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
        @click.self="props.closeOnBackdrop ? close() : null"
      >
        <!-- Modal Dialog -->
        <dialog
          ref="dialogRef"
          open
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          class="bg-white p-7 min-w-48 max-w-[calc(100vw_-_2rem)] overflow-hidden rounded-modal shadow-drop relative flex flex-col focus:outline-none"
          :style="{ width: props.width, height: props.height }"
          :aria-labelledby="props.title ? 'modal-title' : undefined"
          aria-describedby="modal-body"
        >
          <!-- Close (X) Button -->
          <button
            aria-label="Close dialog"
            class="absolute top-2 right-4 p-2 border-none bg-transparent cursor-pointer text-neutral-500 hover:text-neutral-900 transition-colors w-11 h-11 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-12 lg:h-12 flex items-center justify-center"
            @click="close"
          >
            <CloseIcon class="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-7 lg:h-7" />
          </button>

          <!-- Header -->
          <header v-if="props.title" class="pb-5 flex-shrink-0">
            <h2
              id="modal-title"
              class="min-h-fit m-0 text-lg md:text-xl lg:text-[22px] lg:leading-[30px] font-semibold text-neutral-900"
            >
              <strong>{{ props.title }}</strong>
            </h2>
          </header>

          <!-- Body Slot -->
          <section 
            id="modal-body" 
            ref="modalBodyRef"
            class="pb-5 text-neutral-700 flex-grow overflow-y-auto min-h-0 overscroll-contain"
            :class="[
              props.innerBorder === 'sunken'
                ? 'border border-neutral-300 p-5 shadow-[inset_2px_2px_3px_rgba(0,0,0,0.2)] bg-neutral-50'
                : '',
            ]"
            @wheel="handleWheelScroll"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
          >
            <slot name="body" />
          </section>

          <!-- Footer Slot -->
          <footer class="min-h-fit pt-5 flex flex-wrap justify-end gap-4 border-t border-neutral-200 flex-shrink-0" role="group" aria-label="Dialog actions">
            <slot name="footer" />
          </footer>
        </dialog>
      </div>
    </Teleport>
  </ClientOnly>
</template>