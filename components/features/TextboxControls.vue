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
    class="toolbar w-fit mx-auto mt-4"
  >
    <label class="text-input">
      <span class="text-label">Text</span>
      <input
        v-model="textValue"
        type="text"
        autocomplete="off"
        @input="updateText"
      >
    </label>

    <!-- Font Family -->
    <select v-model="fontFamily" class="p-1" @change="updateFontFamily">
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
      :class="{ active: isBold }"
      title="Bold"
      @click="toggleBold"
    >
      B
    </button>

    <!-- Italic -->
    <button
      :class="{ active: isItalic }"
      title="Italic"
      class="italic-btn"
      @click="toggleItalic"
    >
      I
    </button>

    <!-- Alignment Cycle -->
    <button title="Text Alignment" class="align-btn" @click="cycleAlignment">
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
      title="Text Color"
      @input="updateColor"
    >
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.text-input {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-label {
  font-size: 12px;
  color: #444;
}

.text-input input {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 180px;
}

.toolbar select,
.toolbar button,
.toolbar input[type="color"] {
  height: 32px;
}

.toolbar button {
  padding: 0 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

.italic-btn {
  font-style: italic;
}

.align-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.toolbar button.active {
  background: #222;
  color: white;
  border-color: #222;
}

/* Font preview in select options */
.toolbar select option[value*="Inter"] {
  font-family: 'Inter', sans-serif;
}

.toolbar select option[value*="Open Sans"] {
  font-family: 'Open Sans', sans-serif;
}

.toolbar select option[value*="Roboto"] {
  font-family: 'Roboto', sans-serif;
}

.toolbar select option[value*="Merriweather"] {
  font-family: 'Merriweather', serif;
}

.toolbar select option[value*="Playfair Display"] {
  font-family: 'Playfair Display', serif;
}

.toolbar select option[value*="PT Serif"] {
  font-family: 'PT Serif', serif;
}

.toolbar select option[value*="Dancing Script"] {
  font-family: 'Dancing Script', cursive;
}

.toolbar select option[value*="Pacifico"] {
  font-family: 'Pacifico', cursive;
}

.toolbar select option[value*="Bebas Neue"] {
  font-family: 'Bebas Neue', sans-serif;
}

.toolbar select option[value*="Oswald"] {
  font-family: 'Oswald', sans-serif;
}
</style>
