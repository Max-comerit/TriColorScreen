<script setup lang="ts">
import type { Canvas, Textbox } from 'fabric'
import { ActiveSelection } from 'fabric'
import { ref, shallowRef, computed, watch, onUnmounted } from 'vue'

interface Props {
  canvas: Canvas | null
}

const props = defineProps<Props>()

// All currently selected textboxes (1 for single select, N for multi)
const selectedTextboxes = shallowRef<Textbox[]>([])

// Toolbar is visible when at least one textbox is selected
const hasSelection = computed(() => selectedTextboxes.value.length > 0)

// Local state — synced from the first selected textbox
const fontFamily = ref('sans-serif')
const isBold = ref(false)
const textAlign = ref<'left' | 'center' | 'right'>('left')
const fill = ref('#000000')

let attachedCanvas: Canvas | null = null

/* -----------------------------
   Selection Handling
------------------------------ */
function isTextbox(obj: unknown): obj is Textbox {
  return !!obj && typeof obj === 'object' && 'type' in obj && (obj as { type: string }).type === 'textbox'
}

function getTextboxesFromSelection(): Textbox[] {
  if (!props.canvas) return []
  const active = props.canvas.getActiveObject()
  if (!active) return []

  // Multi-selection: ActiveSelection contains objects
  if (active instanceof ActiveSelection) {
    return (active.getObjects() as unknown[]).filter(isTextbox) as Textbox[]
  }

  // Single textbox
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

watch(() => props.canvas, (newCanvas, oldCanvas) => {
  if (oldCanvas) detach(oldCanvas)
  if (newCanvas) {
    attach(newCanvas)
    attachedCanvas = newCanvas
  }
}, { immediate: true })

onUnmounted(() => {
  if (attachedCanvas) detach(attachedCanvas)
})

/* -----------------------------
   Sync State (from first textbox)
------------------------------ */
function syncFromFirst() {
  const first = selectedTextboxes.value[0]
  if (!first) return

  fontFamily.value = first.fontFamily ?? 'sans-serif'
  isBold.value = first.fontWeight === 'bold' || first.fontWeight === 700
  textAlign.value = (first.textAlign as 'left' | 'center' | 'right') ?? 'left'
  fill.value = (first.fill as string) ?? '#000000'
}

/* -----------------------------
   Update Helper (apply to all selected textboxes)
------------------------------ */
function applyToAll(updater: (tb: Textbox) => void) {
  if (!props.canvas || selectedTextboxes.value.length === 0) return
  for (const tb of selectedTextboxes.value) {
    updater(tb)
    tb.initDimensions()
    tb.setCoords()
  }
  props.canvas.requestRenderAll()
}

/* -----------------------------
   Controls
------------------------------ */
function updateFontFamily() {
  applyToAll(tb => tb.set('fontFamily', fontFamily.value))
}

function toggleBold() {
  isBold.value = !isBold.value
  applyToAll(tb => tb.set('fontWeight', isBold.value ? 'bold' : 'normal'))
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
</script>


<template>
  <div
    v-if="hasSelection"
    class="toolbar"
  >
    <!-- Font Family -->
    <select v-model="fontFamily" @change="updateFontFamily">
      <option>sans-serif</option>
      <option>serif</option>
      <option>monospace</option>
      <option>cursive</option>
      <option>fantasy</option>
    </select>

    <!-- Bold -->
    <button
      :class="{ active: isBold }"
      title="Bold"
      @click="toggleBold"
    >
      B
    </button>

    <!-- Alignment Cycle -->
    <button title="Text Alignment" @click="cycleAlignment">
      {{ textAlign === 'left' ? 'L' : textAlign === 'center' ? 'C' : 'R' }}
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

.toolbar button.active {
  background: #222;
  color: white;
  border-color: #222;
}

.toolbar button:hover {
  background: #eee;
}
</style>
