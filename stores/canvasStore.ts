// stores/canvasStore.ts

import { defineStore } from 'pinia'
import type { Canvas } from 'fabric'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasControls } from '~/composables/useCanvasControls'

/** 
 * Canvas Store
 * @description Manages the state of the canvas, allowing saving and restoring
 * the canvas state as JSON. This is useful for features like undo/redo or
 * persisting the canvas state across sessions.
 * 
 * @example
 * const canvasStore = useCanvasStore()
 * canvasStore.save('front', canvas, canvasSize)
 * // ... later or on page reload ...
 * canvasStore.restore('front', canvas, currentCanvasSize)
 */

export type CanvasSide = 'front' | 'back'

interface CanvasSideState {
  json: string | null
  size: number
  backgroundSelection: string | null
  customBackgroundDataUrl: string | null
}

const createSideState = (): CanvasSideState => ({
  json: null,
  size: 0,
  backgroundSelection: null,
  customBackgroundDataUrl: null,
})

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    front: createSideState(),
    back: createSideState(),
  }),
  actions: {
    save(side: CanvasSide, canvas: Canvas, size: number) {
      const sideState = this[side] as CanvasSideState
      sideState.json = JSON.stringify(canvas.toJSON())
      sideState.size = size
    },
    async restore(side: CanvasSide, canvas: Canvas, currentSize: number) {
      const sideState = this[side] as CanvasSideState
      if (!sideState.json) return

      // Re-apply custom controls via reviver so each object is fixed immediately
      // as it is added during loadFromJSON — before any mouse events can fire.
      const { makeControlsReviver } = useCanvasControls()
      await canvas.loadFromJSON(sideState.json, makeControlsReviver())

      // Rescale objects and background if the canvas size changed since last save
      if (sideState.size > 0 && sideState.size !== currentSize) {
        const ratio = currentSize / sideState.size
        const { rescaleBackground, rescaleObjects } = useCanvasRescale()
        rescaleBackground(canvas, ratio)
        rescaleObjects(canvas, ratio)
      }

      canvas.requestRenderAll()
    },
    setBackgroundSelection(side: CanvasSide, selection: string | null) {
      const sideState = this[side] as CanvasSideState
      sideState.backgroundSelection = selection
    },
    setCustomBackgroundDataUrl(side: CanvasSide, dataUrl: string | null) {
      const sideState = this[side] as CanvasSideState
      sideState.customBackgroundDataUrl = dataUrl
    },
    clear() {
      this.front = createSideState()
      this.back = createSideState()
    }
  }
})