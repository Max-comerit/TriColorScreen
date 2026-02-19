<script setup lang="ts">
// 1. Imports
import type { Canvas, Textbox } from 'fabric'
import { ActiveSelection } from 'fabric'
import { ref, shallowRef, computed, watch, onUnmounted } from 'vue'

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
const textValue = ref('')

let attachedCanvas: Canvas | null = null

// 5. Computed
const hasSelection = computed(() => selectedTextboxes.value.length > 0)

// 6. Methods
function isTextbox(obj: unknown): obj is Textbox {
  return !!obj && typeof obj === 'object' && 'type' in obj && (obj as { type: string }).type === 'textbox'
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

function attach(canvas: Canvas) {
  canvas.on('selection:created', updateFromSelection)
  canvas.on('selection:updated', updateFromSelection)
  canvas.on('selection:cleared', clearSelection)
}

function detach(canvas: Canvas) {
  canvas.off('selection:created', updateFromSelection)
  canvas.off('selection:updated', updateFromSelection)
  canvas.off('selection:cleared', clearSelection)
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

function updateFontFamily() {
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

// 7. Lifecycle hooks
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
    <!-- Mobile: Vertical Stack, Tablet+: Horizontal Flex -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 p-3 sm:p-2 bg-white border border-gray-300 rounded-lg shadow-md">
      <!-- Text Input - Full width on mobile, flexible on larger screens -->
      <label class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xs text-gray-600 hidden sm:inline whitespace-nowrap">Text</span>
        <input
          v-model="textValue"
          type="text"
          autocomplete="off"
          placeholder="Enter text"
          class="flex-1 min-w-0 h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="updateText"
        >
      </label>

      <!-- Controls Container - Wraps on small screens -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Font Family -->
        <select
          v-model="fontFamily"
          class="h-11 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] sm:min-w-[140px]"
          @change="updateFontFamily"
        >
          <optgroup label="Sans-Serif">
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Roboto', sans-serif">Roboto</option>
          </optgroup>
          <optgroup label="Serif">
            <option value="'Merriweather', serif">Merriweather</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'PT Serif', serif">PT Serif</option>
          </optgroup>
          <optgroup label="Script">
            <option value="'Dancing Script', cursive">Dancing Script</option>
            <option value="'Pacifico', cursive">Pacifico</option>
          </optgroup>
          <optgroup label="Display">
            <option value="'Bebas Neue', sans-serif">Bebas Neue</option>
            <option value="'Oswald', sans-serif">Oswald</option>
          </optgroup>
        </select>

        <!-- Bold -->
        <button
          type="button"
          :class="{ 'bg-gray-800 text-white border-gray-800': isBold, 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100': !isBold }"
          class="min-w-[44px] min-h-[44px] px-3 py-2 border rounded-md font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Bold"
          aria-label="Toggle bold"
          @click="toggleBold"
        >
          B
        </button>

        <!-- Italic -->
        <button
          type="button"
          :class="{ 'bg-gray-800 text-white border-gray-800': isItalic, 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100': !isItalic }"
          class="min-w-[44px] min-h-[44px] px-3 py-2 border rounded-md italic cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Italic"
          aria-label="Toggle italic"
          @click="toggleItalic"
        >
          I
        </button>

        <!-- Alignment Cycle -->
        <button
          type="button"
          class="min-w-[44px] min-h-[44px] flex items-center justify-center px-3 py-2 border border-gray-300 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          class="min-w-[44px] min-h-[44px] h-11 w-11 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Text Color"
          aria-label="Choose text color"
          @input="updateColor"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Font preview in select options */
select option[value*="Inter"] {
  font-family: 'Inter', sans-serif;
}

select option[value*="Open Sans"] {
  font-family: 'Open Sans', sans-serif;
}

select option[value*="Roboto"] {
  font-family: 'Roboto', sans-serif;
}

select option[value*="Merriweather"] {
  font-family: 'Merriweather', serif;
}

select option[value*="Playfair Display"] {
  font-family: 'Playfair Display', serif;
}

select option[value*="PT Serif"] {
  font-family: 'PT Serif', serif;
}

select option[value*="Dancing Script"] {
  font-family: 'Dancing Script', cursive;
}

select option[value*="Pacifico"] {
  font-family: 'Pacifico', cursive;
}

select option[value*="Bebas Neue"] {
  font-family: 'Bebas Neue', sans-serif;
}

select option[value*="Oswald"] {
  font-family: 'Oswald', sans-serif;
}
</style>
