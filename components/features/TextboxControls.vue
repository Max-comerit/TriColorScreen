// components/features/TextboxControls.vue

<script setup lang="ts">
// 1. Imports
import { type Canvas, Textbox, ActiveSelection } from 'fabric'
import { ref, shallowRef, computed, watch, onMounted, onUnmounted } from 'vue'
import { setTextboxTextRadius, MIN_TEXT_RADIUS, MAX_TEXT_RADIUS } from '~/utils/canvasUtils'
import { CircularTextbox } from '~/utils/canvasCircularTextbox'
import BaseDropdown from '~/components/base/BaseDropdown.vue'
import type { DropdownGroup } from '~/components/base/BaseDropdown.vue'
import { useCanvasStore } from '@/stores/canvasStore'

// Font names used for eager preloading on mount
const FONT_NAMES = [
  'Inter', 'Open Sans', 'Roboto',
  'Lora', 'Playfair Display', 'PT Serif',
  'Dancing Script', 'Lobster Two',
  'Bebas Neue', 'Oswald',
]

// 2. Props & Emits
interface Props {
  canvas: Canvas | null
}

const props = defineProps<Props>()

// 3. Composables & Stores
const canvasStore = useCanvasStore()

// 4. State (ref/reactive)
const selectedTextboxes = shallowRef<Textbox[]>([])
const fontFamily = ref("'Inter', sans-serif")
const isBold = ref(false)
const isItalic = ref(false)
const fill = ref('#000000')
// warpSlider: -100 to 100, where 0 = no warp, ±100 = maximum warp.
// Positive = text curves upward (left side of arc), negative = downward (right side).
const warpSlider = ref(0)
const textValue = ref('')
const circularMode = ref(false)

// Maps slider intensity (0–100) → fabric radius (MAX → MIN, i.e. larger slider = tighter arc = more warp).
function sliderToRadius(v: number): number {
  if (v === 0) return 0
  const sign = v > 0 ? 1 : -1
  if (Math.abs(v) < 20) {
    return sign * (MAX_TEXT_RADIUS - 5 * ((Math.abs(v)-1) / 100) * (MAX_TEXT_RADIUS - MIN_TEXT_RADIUS))
  }
  return sign * (MAX_TEXT_RADIUS/10 - (Math.abs(v) / 100) * (MAX_TEXT_RADIUS/10 - MIN_TEXT_RADIUS))
}

// Inverse of sliderToRadius: converts stored fabric radius back to slider intensity.
function radiusToSlider(r: number): number {
  if (r === 0) return 0
  const absR = Math.abs(r)
  if (absR < MIN_TEXT_RADIUS || absR > MAX_TEXT_RADIUS) return 0
  const sign = r > 0 ? 1 : -1
  if (absR > MAX_TEXT_RADIUS/10) {
    const v = Math.round(((MAX_TEXT_RADIUS - absR) / (5 * (MAX_TEXT_RADIUS - MIN_TEXT_RADIUS))) * 100) + 1
    // Clamp to at least ±1 so an existing path isn't silently dropped
    return sign * Math.max(v, 1)
  }
  const v = Math.round(((MAX_TEXT_RADIUS/10 - absR) / (MAX_TEXT_RADIUS/10 - MIN_TEXT_RADIUS)) * 100)
  // Clamp to at least ±1 so an existing path isn't silently dropped
  return sign * Math.max(v, 1)
}

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
      { label: 'Lora', value: "'Lora', serif", style: "font-family: 'Lora', serif" },
      { label: 'Playfair Display', value: "'Playfair Display', serif", style: "font-family: 'Playfair Display', serif" },
      { label: 'PT Serif', value: "'PT Serif', serif", style: "font-family: 'PT Serif', serif" },
    ],
  },
  {
    label: 'Script',
    options: [
      { label: 'Dancing Script', value: "'Dancing Script', cursive", style: "font-family: 'Dancing Script', cursive" },
      { label: 'Lobster Two', value: "'Lobster Two', cursive", style: "font-family: 'Lobster Two', cursive" },
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
  ensureFontLoaded(fontFamily.value) // Fire and forget
  isBold.value = first.fontWeight === 'bold' || first.fontWeight === 700
  isItalic.value = first.fontStyle === 'italic'
  fill.value = (first.fill as string) ?? '#000000'
  textValue.value = first.text ?? ''
  warpSlider.value = first instanceof CircularTextbox ? radiusToSlider(first.textRadius) : 0
}

function applyToAll(updater: (tb: Textbox) => void) {
  if (!props.canvas || selectedTextboxes.value.length === 0) return
  for (const tb of selectedTextboxes.value) {
    updater(tb)
    tb.initDimensions()
    tb.setCoords()
  }
  props.canvas.requestRenderAll()
  canvasStore.notifyTextControlsChanged()
}

/**
 * Wait for the browser to load the font (both normal and bold) before telling Fabric to render.
 * Without this, Firefox/Safari may render in the fallback font on first switch.
 */
async function ensureFontLoaded(fontValue: string): Promise<void> {
  const name = fontValue.replace(/['"]*/g, '').split(',')[0].trim()
  try {
    await Promise.all([
      document.fonts.load(`400 16px "${name}"`),
      document.fonts.load(`700 16px "${name}"`),
    ])
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
  applyToAll(tb => tb.set('fontWeight', isBold.value ? 700 : 400))
}

function toggleItalic() {
  isItalic.value = !isItalic.value
  applyToAll(tb => tb.set('fontStyle', isItalic.value ? 'italic' : 'normal'))
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
      setTextboxTextRadius(tb, sliderToRadius(warpSlider.value))
    }
  })
}

// 7. Lifecycle hooks
onMounted(() => {
  // Eagerly load all fonts (normal and bold weights) so they are ready before the user interacts.
  // This prevents the Firefox/Safari "wrong font on first switch" issue and bold weight fallback.
  Promise.all(
    FONT_NAMES.flatMap(name => [
      document.fonts.load(`400 16px "${name}"`),
      document.fonts.load(`700 16px "${name}"`),
    ])
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
        <span class="text-sm font-medium text-gray-700">Böjning</span>
        <input
          v-model.number="warpSlider"
          type="range"
          min="-100"
          max="100"
          step="1"
          class="h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          @input="applyCircularRadius"
          @change="applyCircularRadius"
        >
        <span class="text-xs text-gray-600">
          {{ warpSlider === 0 ? 'Ingen böjning' : `${warpSlider}%` }}
        </span>
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

