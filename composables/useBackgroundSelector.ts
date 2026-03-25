// composables/useBackgroundSelector.ts

// 1. Imports
import { useCanvasStore } from '@/stores/canvasStore'
import { CUSTOM_BACKGROUND_ID, CUSTOM_SIDES } from '~/composables/useCustomBackground'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'

const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories
const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_OBJ.productCategories

/**
 * Composable responsible for all product/category/side selection orchestration.
 * It owns the store writes that result from user selections in BackgroundSelector.
 * The actual canvas background rendering is driven reactively by the store watcher
 * in custom-design.vue — this composable never touches the canvas directly.
 */
export function useBackgroundSelector() {
  // 2. Composables & Stores
  const canvasStore = useCanvasStore()

  // 3. Methods

  /** Registers the product category tree in the store once on mount and syncs the default product. */
  function initProductCategories(): void {
    canvasStore.setProductCategoryTree(PRODUCT_CATEGORIES_OBJ)
    // Sync the default product's sides so sideCount matches what the side dropdown shows.
    // Without this, sideCount stays at 2 while sideOptions shows all 4 sides, causing
    // left/right canvases to never render on first load.
    if (!canvasStore.sides.some(s => s.backgroundSelection)) {
      const url = PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[canvasStore.activeProduct]?.sides[0]?.src
      if (url) syncProductSelection(url)
    }
  }

  /** Syncs store backgroundSelection for every side of the product that owns the given URL. */
  function syncProductSelection(url: string): void {
    for (const cat of PRODUCT_CATEGORIES) {
      for (const product of cat.products) {
        if (product.sides.some(s => s.src === url)) {
          canvasStore.setSideCount(product.sides.length)
          product.sides.forEach((side, i) => {
            canvasStore.setBackgroundSelection(i, side.src)
            canvasStore.setCustomBackgroundDataUrl(i, null)
          })
          return
        }
      }
    }
  }

  /**
   * Handles a category selection change: resets product/side state, clears saved
   * canvas content, and syncs the new product's side backgrounds to the store.
   */
  function onCategoryChange(index: number): void {
    canvasStore.setActiveCategory(index)
    canvasStore.setActiveProduct(0)
    canvasStore.setActiveSide(0)
    canvasStore.clear()
    const url = PRODUCT_CATEGORIES[index]?.products[0]?.sides[0]?.src
    if (url) syncProductSelection(url)
  }

  /**
   * Handles a product selection change: resets the active side, then either enters
   * custom-background mode or syncs the new product's side backgrounds to the store.
   */
  function onProductChange(index: number, dataKey: string | null): void {
    canvasStore.setActiveProduct(index)
    canvasStore.setActiveSide(0)
    if (dataKey === CUSTOM_BACKGROUND_ID) {
      canvasStore.setSideCount(CUSTOM_SIDES.length)
      CUSTOM_SIDES.forEach((_, i) => canvasStore.setBackgroundSelection(i, CUSTOM_BACKGROUND_ID))
    }
    else {
      canvasStore.clear()
      const url = PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[index]?.sides[0]?.src
      if (url) syncProductSelection(url)
    }
  }

  /** Handles a side selection change: updates the active side in the store. */
  function onSideChange(index: number): void {
    canvasStore.setActiveSide(index)
  }

  return {
    initProductCategories,
    onCategoryChange,
    onProductChange,
    onSideChange,
  }
}
