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
 * canvasStore.save(canvas, canvasSize)
 * // ... later or on page reload ...
 * canvasStore.restore(canvas, currentCanvasSize)
 */

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    json: null as string | null,
    size: 0,
    backgroundSelection: null as string | null,
    customBackgroundDataUrl: null as string | null,
  }),
  actions: {
    save(canvas: Canvas, size: number) {
      this.json = JSON.stringify(canvas.toJSON())
      this.size = size
    },
    async restore(canvas: Canvas, currentSize: number) {
      if (!this.json) return

      // Re-apply custom controls via reviver so each object is fixed immediately
      // as it is added during loadFromJSON — before any mouse events can fire.
      const { makeControlsReviver } = useCanvasControls()
      await canvas.loadFromJSON(this.json, makeControlsReviver())

      // Rescale objects and background if the canvas size changed since last save
      if (this.size > 0 && this.size !== currentSize) {
        const ratio = currentSize / this.size
        const { rescaleBackground, rescaleObjects } = useCanvasRescale()
        rescaleBackground(canvas, ratio)
        rescaleObjects(canvas, ratio)
      }

      canvas.requestRenderAll()
    },
    setBackgroundSelection(selection: string | null) {
      this.backgroundSelection = selection
    },
    setCustomBackgroundDataUrl(dataUrl: string | null) {
      this.customBackgroundDataUrl = dataUrl
    },
    clear() {
      this.json = null
      this.size = 0
      this.backgroundSelection = null
      this.customBackgroundDataUrl = null
    }
  }
})