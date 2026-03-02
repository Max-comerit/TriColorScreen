// stores/canvasStore.ts

import { defineStore } from 'pinia'
import type { Canvas } from 'fabric'
import { useCanvasRescale } from '~/composables/useCanvasRescale'
import { useCanvasControls } from '~/composables/useCanvasControls'
import type { ProductCategories } from '~/types/BackgroundSelector'

/**
 * Canvas Store
 * @description Manages the state of N canvas sides dynamically. Sides are
 * identified by a numeric index so the number of sides can grow beyond the
 * original front/back pair as new product types are added.
 *
 * @example
 * const canvasStore = useCanvasStore()
 * canvasStore.save(0, canvas, canvasSize)
 * // ... later or on page reload ...
 * canvasStore.restore(0, canvas, currentCanvasSize)
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
function createInitialSides(): CanvasSideState[] {
  return [createSideState(), createSideState()]
}

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    /** The currently active product category name */
    productCategoryTree:  undefined as ProductCategories | undefined,
    /** The currently active product category name */
    activeCategory: 0 as number,
    /** The currently active product name */
    activeProduct: 0 as number,
    /** The currently active side index */
    activeSide: 0 as number ,
    /** State indexed by side number (0, 1, 2, …) */
    sides: createInitialSides(),
    /** Number of active sides for the selected product */
    sideCount: 2 as number,
  }),
  getters: {
    /** Ordered list of active side indices derived from sideCount */
    sideKeys: (state): number[] => Array.from({ length: state.sideCount }, (_, i) => i),
  },
  actions: {
    /** Lazily initialize state for a side index if it doesn't exist yet */
    ensureSide(side: number) {
      while (this.sides.length <= side) {
        this.sides.push(createSideState())
      }
    },
    save(side: number, canvas: Canvas, size: number) {
      this.ensureSide(side)
      const sideState = this.sides[side]!
      sideState.json = JSON.stringify(canvas.toJSON())
      sideState.size = size
    },
    async restore(side: number, canvas: Canvas, currentSize: number) {
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
    setBackgroundSelection(side: number, selection: string | null) {
      this.ensureSide(side)
      this.sides[side]!.backgroundSelection = selection
    },
    setCustomBackgroundDataUrl(side: number, dataUrl: string | null) {
      this.ensureSide(side)
      this.sides[side]!.customBackgroundDataUrl = dataUrl
    },
    setProductCategoryTree(categories: ProductCategories | undefined) {
      this.productCategoryTree = categories
    },
    setActiveCategory(category: number) {
      this.activeCategory = category
    },
    setActiveProduct(product: number) {
      this.activeProduct = product
    },
    setActiveSide(side: number) {
      this.activeSide = side
    },
    /**
     * Set the number of active sides for the selected product.
     * Ensures state objects exist for all indices.
     */
    setSideCount(count: number) {
      this.sideCount = count
      for (let i = 0; i < count; i++) {
        this.ensureSide(i)
      }
    },
    /** Clear all canvas content while preserving side structure */
    clear() {
      this.sides = createInitialSides()
      this.sideKeys.forEach(key => this.ensureSide(key))
    }
  },
})