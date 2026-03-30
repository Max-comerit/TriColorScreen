<script setup lang="ts">

// ===== IMPORTS =====
import { computed, nextTick, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { Canvas } from 'fabric'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { useCustomBackground, loadBackgroundOnCanvas, CUSTOM_BACKGROUND_ID } from '~/composables/useCustomBackground'
import { configureActiveSelectionDefaults } from '@/utils/canvasSetup'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'
import {
  clearCanvasObjects,
  clearCanvas,
  rescaleCanvas,
} from '~/utils/canvasUtils'

// ===== TYPES =====
interface Props {
  image?: File
  textCnt: number
}

// ===== PROPS =====
const props = withDefaults(defineProps<Props>(), {
  image: undefined
})

// ===== EMITS =====
const emit = defineEmits<{
  (e: 'changed:canvasMap', canvasMap: (Canvas | undefined)[]): void
  (e: 'changed:activeCanvas', activeCanvas: Canvas | null): void
}>()

// ===== COMPOSABLES =====
const canvasStore = useCanvasStore()
const { activeSide } = storeToRefs(canvasStore)
const { applyCustomBackground } = useCustomBackground()
const { addImageToCanvas } = useCustomImage()
const { addTextToCanvas } = useCustomText()

// ===== STATE =====
/** Reactive array of initialized Fabric Canvas instances, indexed by side number */
const canvasMap = shallowRef<(Canvas | undefined)[]>([])
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
/** Plain (non-reactive) array of raw canvas elements, indexed by side number */
const canvasElMap: (HTMLCanvasElement | undefined)[] = []
let resizeObserver: ResizeObserver | null = null
let currentCanvasWidth = 0
let currentCanvasHeight = 0

// ===== COMPUTED =====
const activeCanvas = computed(() => canvasMap.value[activeSide.value] ?? null)

// ===== METHODS =====
async function initializeCanvas(side: number, el: HTMLCanvasElement, width: number, height: number): Promise<void> {
  const canvasInstance = new Canvas(el, { selection: true })
  if (!canvasInstance) {
    console.error('Failed to initialize Fabric canvas')
    return
  }

  const newMap = [...canvasMap.value]
  newMap[side] = canvasInstance
  canvasMap.value = newMap

  canvasInstance.setDimensions({ width, height })
  canvasInstance.enablePointerEvents = true

  await canvasStore.restore(side, canvasInstance, width)

  canvasInstance.on('object:added', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:modified', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))
  canvasInstance.on('object:removed', () => canvasStore.save(side, canvasInstance, currentCanvasWidth))

  // Set initialized state in store if all canvases are initialized
  const allInitialized = canvasStore.sideKeys.every(key => canvasMap.value[key])
  if (allInitialized) {
    canvasStore.setInitialized(true)
  }
}

/** Assign or remove a canvas element ref from the template v-for */
function assignCanvasEl(key: number, el: HTMLCanvasElement | null): void {
  canvasElMap[key] = el ?? undefined
}

function syncAspectRatioFromBackground(side: number, width: number, height: number): void {
  if (side === canvasStore.activeSide && width > 0 && height > 0) {
    canvasStore.setAspectRatio(`${width} / ${height}`)
  }
}

async function applyBackgroundSelection(
  side: number,
  canvas: Canvas,
  selection: string | null | undefined,
  clearObjects = true,
): Promise<void> {
  if (clearObjects) {
    clearCanvasObjects(canvas)
  }

  if (!selection) {
    canvas.backgroundImage = undefined
    canvas.requestRenderAll()
    return
  }

  if (selection === CUSTOM_BACKGROUND_ID) {
    const customDataUrl = canvasStore.sides[side]?.customBackgroundDataUrl
    if (!customDataUrl) {
      canvas.backgroundImage = undefined
      canvas.requestRenderAll()
      return
    }

    const bg = await loadBackgroundOnCanvas(canvas, customDataUrl)
    syncAspectRatioFromBackground(side, bg.width, bg.height)
    return
  }

  const bg = await loadBackgroundOnCanvas(canvas, selection)
  syncAspectRatioFromBackground(side, bg.width, bg.height)
}

// ===== LIFECYCLE HOOKS =====
onMounted(async () => {
  await nextTick()
  const wrapper = canvasWrapperRef.value

  if (!wrapper) {
    console.error('Canvas wrapper not found')
    return
  }

  // Configure ActiveSelection controls (box-select / multi-select)
  configureActiveSelectionDefaults()

  // Observe the wrapper div — CSS controls its size, we sync Fabric to it
  resizeObserver = new ResizeObserver((entries) => {
    const width = Math.ceil(entries[0].contentRect.width)
    const height = Math.ceil(entries[0].contentRect.height)
    if (width <= 0 || height <= 0) return

    const previousWidth = currentCanvasWidth
    if (previousWidth > 0 && (width !== previousWidth || height !== currentCanvasHeight)) {
      const ratio = width / previousWidth
      for (const canvas of canvasMap.value) {
        if (canvas) void rescaleCanvas(canvas, ratio, width, height)
      }
    }

    currentCanvasWidth = width
    currentCanvasHeight = height

    for (const key of canvasStore.sideKeys) {
      const el = canvasElMap[key]
      if (el && !canvasMap.value[key]) {
        void initializeCanvas(key, el, width, height)
      }
    }
  })
  resizeObserver.observe(wrapper)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  for (const [key, canvas] of canvasMap.value.entries()) {
    if (canvas) {
      canvasStore.save(key, canvas, currentCanvasWidth)
      canvas.dispose()
    }
  }
})

// ===== WATCHERS =====

watch(() => canvasStore.sides[activeSide.value]?.customBackgroundDataUrl, async (newBackgroundUrl) => {
  if (newBackgroundUrl) {
    const canvas = activeCanvas.value
    if (canvas) {
      await applyCustomBackground(canvas, newBackgroundUrl)
    }
  }
})

watch(() => props.image, async (newImage) => {
  if (newImage && activeCanvas.value) {
    try {
      await addImageToCanvas(activeCanvas.value, newImage)
    } catch (error) {
      alert('Failed to add image. Please try again.')
      console.error('Error adding image:', error)
    }
  }
})

watch(() => props.textCnt, (newTextCnt) => {
  if (newTextCnt && activeCanvas.value) {
    try {
      addTextToCanvas(activeCanvas.value)
    } catch (error) {
      alert('Failed to add text. Please try again.')
      console.error('Error adding text:', error)
    }
  }
})

// Single watcher for all side backgroundSelections — only reacts to actual changes
watch(
  () => canvasStore.sides.map(v => v.backgroundSelection),
  async (newSelections, oldSelections) => {
    for (let key = 0; key < newSelections.length; key++) {
      const selection = newSelections[key]
      if (selection === oldSelections?.[key]) continue
      const canvas = canvasMap.value[key]
      if (!canvas) continue

      if (!selection) {
        // Selection was explicitly cleared — wipe objects and background from the live canvas
        clearCanvas(canvas, true)
        continue
      }

      await applyBackgroundSelection(key, canvas, selection)
    }
  },
  { deep: true },
)

// Remove user-added objects from all live canvases when the store is cleared
watch(
  () => canvasStore.clearSeq,
  () => {
    for (const canvas of canvasMap.value) {
      if (canvas) {
        clearCanvas(canvas, true)
      }
    }
  },
)

// Initialize new canvases and dispose removed ones when the product's side count changes
watch(
  () => canvasStore.sideCount,
  async (newCount, oldCount) => {
    await nextTick()
    const newKeys = Array.from({ length: newCount }, (_, i) => i)
    for (const key of newKeys) {
      const el = canvasElMap[key]
      if (el && !canvasMap.value[key] && currentCanvasWidth > 0) {
        initializeCanvas(key, el, currentCanvasWidth, currentCanvasHeight).catch(console.error)
      }
    }
    const oldKeys = Array.from({ length: oldCount ?? 0 }, (_, i) => i)
    const removedKeys = oldKeys.filter(k => !newKeys.includes(k))
    for (const key of removedKeys) {
      const canvas = canvasMap.value[key]
      if (canvas) {
        canvas.dispose()
        const newMap = [...canvasMap.value]
        newMap[key] = undefined
        canvasMap.value = newMap
      }
      canvasElMap[key] = undefined
    }
  },
)

watch(
  () => canvasMap.value,
  (newCanvasMap) => {
    emit('changed:canvasMap', newCanvasMap)
  },
)

watch(
  () => activeCanvas.value,
  (newActiveCanvas) => {
    emit('changed:activeCanvas', newActiveCanvas)
  },
)

</script>

<template>
  <ClientOnly>
    <div ref="canvasWrapperRef" class="relative w-full max-h-[1000px]" :style="{ aspectRatio: canvasStore.aspectRatio }">
      <div
        v-for="key in canvasStore.sideKeys"
        v-show="activeSide === key"
        :key="key"
        class="absolute inset-0"
        :aria-hidden="activeSide !== key"
      >
        <canvas
          :ref="(el) => assignCanvasEl(key, el as HTMLCanvasElement | null)"
          class="block w-full h-full border border-black rounded-card overflow-hidden"
        />
      </div>
    </div>
  </ClientOnly>
</template>
