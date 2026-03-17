// components/features/TextboxControls.vue

<script setup lang="ts">
// 1. Imports
import { type Canvas, Textbox, ActiveSelection } from 'fabric'
import { ref, shallowRef, computed, watch, onMounted, onUnmounted } from 'vue'
import { setTextboxTextRadius, MAX_TEXT_RADIUS } from '@/utils/customDesign'
import { CircularTextbox } from '~/utils/circularTextbox'
import BaseDropdown from '~/components/base/BaseDropdown.vue'
import type { DropdownGroup } from '~/components/base/BaseDropdown.vue'

// Font names used for eager preloading on mount
const FONT_NAMES = [
  'Inter', 'Open Sans', 'Roboto',
  'Merriweather', 'Playfair Display', 'PT Serif',
  'Dancing Script', 'Pacifico',
  'Bebas Neue', 'Oswald',
]

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
}

const props = defineProps<Props>()

// 3. Composables & Stores
// (none)

// 4. State (ref/reactive)
const selectedTextboxes = shallowRef<Textbox[]>([])
const fontFamily = ref("'Inter', sans-serif")
const isBold = ref(false)
const isItalic = ref(false)
const textAlign = ref<'left' | 'center' | 'right'>('left')
const fill = ref('#000000')
const textRadius = ref(0)
const textValue = ref('')
const circularMode = ref(false)

let attachedCanvas: Canvas | null = null

// 5. Computed
const hasSelection = computed(() => selectedTextboxes.value.length > 0)

const fontGroups: DropdownGroup[] = [
  {
    label: 'Sans-Serif',
    options: [
      { label: 'Inter', value: "'Inter', sans-serif", style: "font-family: 'Inter', sans-serif" },
      { label: 'Open Sans', value: "'Open Sans', sans-serif", style: "font-family: 'Open Sans', sans-serif" },
      { label: 'Roboto', value: "'Roboto', sans-serif", style: "font-family: 'Roboto', sans-serif" },
    ],
  },
  {
    label: 'Serif',
    options: [
      { label: 'Merriweather', value: "'Merriweather', serif", style: "font-family: 'Merriweather', serif" },
      { label: 'Playfair Display', value: "'Playfair Display', serif", style: "font-family: 'Playfair Display', serif" },
      { label: 'PT Serif', value: "'PT Serif', serif", style: "font-family: 'PT Serif', serif" },
    ],
  },
  {
    label: 'Script',
    options: [
      { label: 'Dancing Script', value: "'Dancing Script', cursive", style: "font-family: 'Dancing Script', cursive" },
      { label: 'Pacifico', value: "'Pacifico', cursive", style: "font-family: 'Pacifico', cursive" },
    ],
  },
  {
    label: 'Display',
    options: [
      { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif", style: "font-family: 'Bebas Neue', sans-serif" },
      { label: 'Oswald', value: "'Oswald', sans-serif", style: "font-family: 'Oswald', sans-serif" },
    ],
  },
]

// 6. Methods
function isTextbox(obj: unknown): obj is Textbox {
  return obj instanceof Textbox
}

function getTextboxesFromSelection(): Textbox[] {
  if (!props.canvas) return []
  const active = props.canvas.getActiveObject()
  if (!active) return []

  if (active instanceof ActiveSelection) {
    return (active.getObjects() as unknown[]).filter(isTextbox) as Textbox[]
  }

  if (isTextbox(active)) return [active]

  return []
}

function updateFromSelection() {
  selectedTextboxes.value = getTextboxesFromSelection()
  syncFromFirst()
}

function clearSelection() {
  selectedTextboxes.value = []
}

function handleTextChanged(e: { target?: unknown }) {
  const target = e.target
  if (isTextbox(target) && selectedTextboxes.value.includes(target)) {
    textValue.value = target.text ?? ''
  }
}

function attach(canvas: Canvas) {
  canvas.on('selection:created', updateFromSelection)
  canvas.on('selection:updated', updateFromSelection)
  canvas.on('selection:cleared', clearSelection)
  canvas.on('text:changed', handleTextChanged)
  canvas.on('object:modified', updateFromSelection)
}

function detach(canvas: Canvas) {
  canvas.off('selection:created', updateFromSelection)
  canvas.off('selection:updated', updateFromSelection)
  canvas.off('selection:cleared', clearSelection)
  canvas.off('text:changed', handleTextChanged)
  canvas.off('object:modified', updateFromSelection)
}

function syncFromFirst() {
  const first = selectedTextboxes.value[0]
  if (!first) return

  fontFamily.value = first.fontFamily ?? 'sans-serif'
  isBold.value = first.fontWeight === 'bold' || first.fontWeight === 700
  isItalic.value = first.fontStyle === 'italic'
  textAlign.value = (first.textAlign as 'left' | 'center' | 'right') ?? 'left'
  fill.value = (first.fill as string) ?? '#000000'
  textValue.value = first.text ?? ''
  textRadius.value = first instanceof CircularTextbox ? first.textRadius : 0
}

function applyToAll(updater: (tb: Textbox) => void) {
  if (!props.canvas || selectedTextboxes.value.length === 0) return
  for (const tb of selectedTextboxes.value) {
    updater(tb)
    tb.initDimensions()
    tb.setCoords()
  }
  props.canvas.requestRenderAll()
}

/**
 * Wait for the browser to load the font before telling Fabric to render.
 * Without this, Firefox/Safari may render in the fallback font on first switch.
 */
async function ensureFontLoaded(fontValue: string): Promise<void> {
  const name = fontValue.replace(/['"]*/g, '').split(',')[0].trim()
  try {
    await document.fonts.load(`400 16px "${name}"`)
  } catch {
    // best-effort: proceed even if the API fails
  }
}

async function updateFontFamily() {
  await ensureFontLoaded(fontFamily.value)
  applyToAll(tb => tb.set('fontFamily', fontFamily.value))
}

function toggleBold() {
  isBold.value = !isBold.value
  applyToAll(tb => tb.set('fontWeight', isBold.value ? 'bold' : 'normal'))
}

function toggleItalic() {
  isItalic.value = !isItalic.value
  applyToAll(tb => tb.set('fontStyle', isItalic.value ? 'italic' : 'normal'))
}

function cycleAlignment() {
  const order: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right']
  const next = order[(order.indexOf(textAlign.value) + 1) % order.length]
  textAlign.value = next
  applyToAll(tb => tb.set('textAlign', next))
}

function updateColor() {
  applyToAll(tb => tb.set('fill', fill.value))
}

function updateText() {
  applyToAll(tb => tb.set('text', textValue.value))
}

function updateRadius() {
  circularMode.value = true
}

function closeCircularMode() {
  circularMode.value = false
}

function applyCircularRadius() {
  applyToAll((tb) => {
    if (tb instanceof CircularTextbox) {
      setTextboxTextRadius(tb, textRadius.value)
    }
  })
}

// 7. Lifecycle hooks
onMounted(() => {
  // Eagerly load all fonts so they are ready before the user interacts.
  // This prevents the Firefox/Safari "wrong font on first switch" issue.
  Promise.allSettled(
    FONT_NAMES.map(name => document.fonts.load(`400 16px "${name}"`))
  )
})

onUnmounted(() => {
  if (attachedCanvas) detach(attachedCanvas)
})

// 8. Watchers
watch(() => props.canvas, (newCanvas, oldCanvas) => {
  if (oldCanvas) detach(oldCanvas)
  if (newCanvas) {
    attach(newCanvas)
    attachedCanvas = newCanvas
  }
}, { immediate: true })
</script>


<template>
  <div
    v-if="hasSelection"
    class="w-full max-w-2xl mx-auto mt-4 px-4"
  >
    <!-- Circular Text Mode -->
    <div v-if="circularMode" class="flex items-center gap-3 p-3 sm:p-2 bg-white border border-gray-300 rounded-lg shadow-md">
      <label class="flex-1 flex flex-col gap-2">
        <span class="text-sm font-medium text-gray-700">Cirkulär textradie</span>
        <input
          v-model.number="textRadius"
          type="range"
          :min="-MAX_TEXT_RADIUS"
          :max="MAX_TEXT_RADIUS"
          class="h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          @input="applyCircularRadius"
          @change="applyCircularRadius"
        >
        <span class="text-xs text-gray-600">{{ textRadius }}px</span>
      </label>
      <button
        type="button"
        class="min-w-[44px] min-h-[44px] flex items-center justify-center px-3 py-2 border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 form-button-base outline-tight-button"
        title="Close"
        aria-label="Close circular text mode"
        @click="closeCircularMode"
      >
        <img src="@/assets/images/common/close-icon.svg?url" alt="" class="w-5 h-5" >
      </button>
    </div>

    <!-- Normal Toolbar Mode -->
    <div v-else class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 p-3 sm:p-2 bg-white border border-gray-300 rounded-lg shadow-md">
      <!-- Text Input - Full width on mobile, flexible on larger screens -->
      <label class="flex items-center gap-2 flex-1 min-w-0">
        <span class="sr-only">Text content</span>
        <input
          v-model="textValue"
          type="text"
          autocomplete="off"
          placeholder="Enter text"
          class="flex-1 min-w-0 h-11 px-3 py-2 border-gray-300 form-input-base outline-tight-input"
          @input="updateText"
        >
      </label>

      <!-- Controls Container - Wraps on small screens -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Font Family -->
        <BaseDropdown
          :groups="fontGroups"
          :model-value="fontFamily"
          label="Select font family"
          class="min-w-[120px] sm:min-w-[140px]"
          @change="(val) => { fontFamily = String(val); updateFontFamily() }"
        />

        <!-- Bold -->
        <button
          type="button"
          :class="{ 'bg-gray-800 text-white border-gray-800': isBold, 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100': !isBold }"
          class="min-w-[44px] min-h-[44px] px-3 py-2 font-bold cursor-pointer form-button-base outline-tight-button"
          title="Bold"
          aria-label="Toggle bold"
          :aria-pressed="isBold"
          @click="toggleBold"
        >
          B
        </button>

        <!-- Italic -->
        <button
          type="button"
          :class="{ 'bg-gray-800 text-white border-gray-800': isItalic, 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100': !isItalic }"
          class="min-w-[44px] min-h-[44px] px-3 py-2 italic cursor-pointer form-button-base outline-tight-button"
          title="Italic"
          aria-label="Toggle italic"
          :aria-pressed="isItalic"
          @click="toggleItalic"
        >
          I
        </button>

        <!-- Alignment Cycle -->
        <button
          type="button"
          class="min-w-[44px] min-h-[44px] flex items-center justify-center px-3 py-2 border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 form-button-base outline-tight-button"
          title="Text Alignment"
          aria-label="Cycle text alignment"
          @click="cycleAlignment"
        >
          <!-- Align Left -->
          <svg v-if="textAlign === 'left'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
          <!-- Align Center -->
          <svg v-else-if="textAlign === 'center'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <!-- Align Right -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <!-- Color -->
        <input
          v-model="fill"
          type="color"
          class="min-w-[44px] min-h-[44px] h-11 w-11 border-gray-300 cursor-pointer bg-gray-50 form-input-base outline-tight-input"
          title="Text Color"
          aria-label="Choose text color"
          @input="updateColor"
        >

        <!-- Circular Text -->
        <button
          type="button"
          class="min-w-[44px] min-h-[44px] flex items-center justify-center px-2 py-1 border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 form-button-base outline-tight-button"
          title="Circular Text"
          aria-label="Apply circular text effect"
          @click="updateRadius"
        >
          <img src="@/assets/images/custom-design/circular-text-icon.svg?url" alt="" class="h-7 w-7" >
        </button>

      </div>
    </div>
  </div>
</template>

