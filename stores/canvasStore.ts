// stores/canvasStore.ts

import { defineStore } from 'pinia'
import type { Canvas } from 'fabric'
import type { ProductCategories } from '~/types/BackgroundSelector'

const DEFAULT_SIDE_COUNT = 4

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
  isCustomBackground: boolean
  bgUrl: string | null
}

const createSideState = (): CanvasSideState => ({
  json: null,
  size: 0,
  isCustomBackground: false,
  bgUrl: null,
})

/**
 * Helper to create an array of CanvasSideState for the given count.
 * Used for initializing and resetting the sides state.
 */
function createSides(count: number): CanvasSideState[] {
  return Array.from({ length: count }, () => createSideState())
}

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    /** True when all canvases are initialized */
    initialized: false as boolean,
    /** Array of canvas instances indexed by side number */
    canvasMap: [] as (Canvas | undefined)[],
    /** The currently active product category name */
    productCategoryTree:  undefined as ProductCategories | undefined,
    /** The currently active product category name */
    activeCategory: 0 as number,
    /** The currently active product name */
    activeProduct: 0 as number,
    /** The currently active side index */
    activeSide: 0 as number ,
    /** State indexed by side number (0, 1, 2, …) */
    sides: createSides(DEFAULT_SIDE_COUNT) as CanvasSideState[],
    /** Number of active sides for the selected product */
    sideCount: DEFAULT_SIDE_COUNT as number,
    /** CSS aspect-ratio string for the active product's background image */
    aspectRatio: '1 / 1' as string,
    /** Incremented each time clear() is called; watchers use this to fully clear live canvases including background */
    clearSeq: 0 as number,
    /** Incremented each time clearObjects() is called; watchers use this to remove only user-added live canvas objects */
    clearObjectsSeq: 0 as number,
  }),
  getters: {
    /** Ordered list of active side indices derived from sideCount */
    sideKeys: (state): number[] => Array.from({ length: state.sideCount }, (_, i) => i),
  },
  actions: {
    /** Helper to initialize sides, sideCount and background url for all sides */
    initSides() {
      const sidesArr = this.productCategoryTree?.productCategories[this.activeCategory]?.products[this.activeProduct]?.sides || [];
      const isCustomBackground = this.productCategoryTree?.productCategories[this.activeCategory]?.products[this.activeProduct]?.label === 'Egen Produkt';
      this.sideCount = sidesArr.length || DEFAULT_SIDE_COUNT;
      this.sides = createSides(this.sideCount);
      this.sides.forEach((side, i) => {
        side.bgUrl = sidesArr[i]?.src || null; // Sync background url from product data or set to null
        side.isCustomBackground = isCustomBackground;
      });
    },
    setInitialized(val: boolean) {
      this.initialized = val
    },
    save(side: number, canvas: Canvas, size: number) {
      const sideState = this.sides[side]!
      sideState.json = JSON.stringify(canvas.toJSON())
      sideState.size = size
    },
    async restore(side: number, canvas: Canvas, currentSize: number) {
      const sideState = this.sides[side]
      if (!sideState?.json) return

      // Dynamically import canvas composables so fabric.js is not pulled into
      // the bundle of pages that don't use the canvas (Lighthouse: unused JS).
      const { useCanvasControls } = await import('~/composables/useCanvasControls')

      // Re-apply custom controls via reviver so each object is fixed immediately
      // as it is added during loadFromJSON — before any mouse events can fire.
      const { makeControlsReviver } = useCanvasControls()
      await canvas.loadFromJSON(sideState.json, makeControlsReviver())

      // Rescale objects and background if the canvas size changed since last save
      if (sideState.size > 0 && sideState.size !== currentSize) {
        const ratio = currentSize / sideState.size
        const { useCanvasRescale } = await import('~/composables/useCanvasRescale')
        const { rescaleBackground, rescaleObjects } = useCanvasRescale()
        rescaleBackground(canvas, ratio)
        rescaleObjects(canvas, ratio)
      }

      canvas.requestRenderAll()
    },
    setCanvasMap(map: (Canvas | undefined)[]) {
      this.canvasMap = map
    },
    setBgUrl(side: number, url: string | null) {
      this.sides[side]!.bgUrl = url
    },
    setProductCategoryTree(categories: ProductCategories | undefined) {
      this.productCategoryTree = categories
    },
    setActiveCategory(category: number) {
      this.activeCategory = category
      this.initSides()
    },
    setActiveProduct(product: number) {
      this.activeProduct = product
      this.initSides()
    },
    setActiveSide(side: number) {
      this.activeSide = side
    },
    /** Clear user-added objects from all sides and backgrounds */
    clear() {
      for (const side of this.sides) {
        side.json = null
      }
      this.clearSeq++
    },
    /** Clear only user-added objects from all sides, preserving background selections */
    clearObjects() {
      for (const side of this.sides) {
        side.json = null
      }
      this.clearObjectsSeq++
    },
    setAspectRatio(ratio: string) {
      this.aspectRatio = ratio
    },
  },
})