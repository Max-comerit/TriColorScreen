// stores/canvasStore.ts

import { defineStore } from 'pinia'
import type { Canvas } from 'fabric'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasControls } from '~/composables/useCanvasControls'

/**
 * Canvas Store
 * @description Manages the state of N canvas sides dynamically. Sides are
 * identified by a string key (e.g. '0', '1', '2') so the number of sides
 * can grow beyond the original front/back pair as new product types are added.
 *
 * @example
 * const canvasStore = useCanvasStore()
 * canvasStore.save('0', canvas, canvasSize)
 * // ... later or on page reload ...
 * canvasStore.restore('0', canvas, currentCanvasSize)
 */

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

/** Creates initial sides state for the default two sides */
function createInitialSides(): Record<string, CanvasSideState> {
  return { '0': createSideState(), '1': createSideState() }
}

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    /** State keyed by side index string ('0', '1', '2', …) */
    sides: createInitialSides(),
    /** The currently active side key */
    activeSide: '0',
    /** Ordered list of active side keys matching the selected product's sides */
    sideKeys: ['0', '1'] as string[],
    /** The currently selected product category name */
    selectedCategory: null as string | null,
    /** The currently selected product name */
    selectedProduct: null as string | null,
  }),
  actions: {
    /** Lazily initialize state for a side key if it doesn't exist yet */
    ensureSide(side: string) {
      if (!this.sides[side]) {
        this.sides[side] = createSideState()
      }
    },
    save(side: string, canvas: Canvas, size: number) {
      this.ensureSide(side)
      const sideState = this.sides[side]!
      sideState.json = JSON.stringify(canvas.toJSON())
      sideState.size = size
    },
    async restore(side: string, canvas: Canvas, currentSize: number) {
      const sideState = this.sides[side]
      if (!sideState?.json) return

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
    setBackgroundSelection(side: string, selection: string | null) {
      this.ensureSide(side)
      this.sides[side]!.backgroundSelection = selection
    },
    setCustomBackgroundDataUrl(side: string, dataUrl: string | null) {
      this.ensureSide(side)
      this.sides[side]!.customBackgroundDataUrl = dataUrl
    },
    setActiveSide(side: string) {
      this.activeSide = side
    },
    /**
     * Update the ordered list of side keys for the active product.
     * Ensures state objects exist for all incoming keys.
     */
    setSideKeys(keys: string[]) {
      this.sideKeys = keys
      keys.forEach(key => this.ensureSide(key))
    },
    /** Clear all canvas content while preserving side structure */
    clear() {
      this.sides = createInitialSides()
      this.sideKeys.forEach(key => this.ensureSide(key))
    },
    setSelectedCategory(category: string | null) {
      this.selectedCategory = category
    },
    setSelectedProduct(product: string | null) {
      this.selectedProduct = product
    },
  },
})