// composables/useBackgroundSelector.ts

// 1. Imports
import { useCanvasStore } from '@/stores/canvasStore'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'

const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories

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
  function initBackgroundSelector(): void {
    canvasStore.setProductCategoryTree(PRODUCT_CATEGORIES_OBJ)
    canvasStore.setActiveCategory(0)
    canvasStore.setActiveProduct(0)
    canvasStore.setActiveSide(0)
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
  }

  /**
   * Handles a product selection change: resets the active side, then either enters
   * custom-background mode or syncs the new product's side backgrounds to the store.
   */
  function onProductChange(index: number): void {
    canvasStore.setActiveProduct(index)
    canvasStore.setActiveSide(0)
    canvasStore.clear()
  }

  /** Handles a side selection change: updates the active side in the store. */
  function onSideChange(index: number): void {
    canvasStore.setActiveSide(index)
  }

  return {
    initBackgroundSelector,
    onCategoryChange,
    onProductChange,
    onSideChange,
  }
}
