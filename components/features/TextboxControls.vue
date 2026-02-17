<script setup lang="ts">
import type { Canvas, Textbox } from 'fabric'
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  canvas: Canvas | null
}

const props = defineProps<Props>()

const activeTextbox = ref<Textbox | null>(null)

// Local state
const fontFamily = ref('sans-serif')
const isBold = ref(false)
const textAlign = ref<'left' | 'center' | 'right'>('left')
const fill = ref('#000000')

let attachedCanvas: Canvas | null = null

/* -----------------------------
   Selection Handling
------------------------------ */
function updateFromSelection(e: { selected?: unknown[] }) {
  const obj = e.selected?.[0]
  if (obj && typeof obj === 'object' && 'type' in obj && obj.type === 'textbox') {
    activeTextbox.value = obj as Textbox
    syncFromTextbox()
  } else {
    activeTextbox.value = null
  }
}

function clearSelection() {
  activeTextbox.value = null
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

onMounted(() => {
  if (props.canvas) {
    attach(props.canvas)
    attachedCanvas = props.canvas
  }
})

onUnmounted(() => {
  if (attachedCanvas) detach(attachedCanvas)
})

/* -----------------------------
   Sync State
------------------------------ */
function syncFromTextbox() {
  if (!activeTextbox.value) return

  fontFamily.value = activeTextbox.value.fontFamily ?? 'sans-serif'
  isBold.value = activeTextbox.value.fontWeight === 'bold' || activeTextbox.value.fontWeight === 700
  textAlign.value = (activeTextbox.value.textAlign as 'left' | 'center' | 'right') ?? 'left'
  fill.value = (activeTextbox.value.fill as string) ?? '#000000'
}

/* -----------------------------
   Update Helper
------------------------------ */
function applyUpdate() {
  if (!props.canvas || !activeTextbox.value) return
  activeTextbox.value.initDimensions()
  activeTextbox.value.setCoords()
  props.canvas.requestRenderAll()
}

/* -----------------------------
   Controls
------------------------------ */
function updateFontFamily() {
  if (!activeTextbox.value) return
  activeTextbox.value.set('fontFamily', fontFamily.value)
  applyUpdate()
}

function toggleBold() {
  if (!activeTextbox.value) return
  isBold.value = !isBold.value
  activeTextbox.value.set('fontWeight', isBold.value ? 'bold' : 'normal')
  applyUpdate()
}

function cycleAlignment() {
  if (!activeTextbox.value) return
  const order: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right']
  const next = order[(order.indexOf(textAlign.value) + 1) % order.length]
  textAlign.value = next
  activeTextbox.value.set('textAlign', next)
  applyUpdate()
}

function updateColor() {
  if (!activeTextbox.value) return
  activeTextbox.value.set('fill', fill.value)
  applyUpdate()
}
</script>


<template>
  <div
    v-if="activeTextbox"
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
