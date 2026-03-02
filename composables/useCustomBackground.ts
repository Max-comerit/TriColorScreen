// composables/useCustomBackground.ts

// 1. Imports
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { useCanvasStore } from '@/stores/canvasStore'
import rawBackgroundOptions from '~/assets/json/custom-design/products.json'
import type { ProductCategories } from '~/types/BackgroundSelector'

const PRODUCT_CATEGORIES_OBJ = rawBackgroundOptions as ProductCategories
const PRODUCT_CATEGORIES = PRODUCT_CATEGORIES_OBJ.productCategories

export const CUSTOM_BACKGROUND_ID = 'custom'

export const CUSTOM_SIDES: { label: string }[] = [
  { label: 'Fram' },
  { label: 'Bak' },
  { label: 'Vänster'},
  { label: 'Höger'},
  { label: 'Över'},
  { label: 'Under'},
]

/**
 * Loads a background image onto a specific canvas instance by URL.
 * Exported for use during canvas initialisation in custom-design.vue where the
 * canvas instance may not yet be the active one tracked by the composable.
 */
export async function loadBackgroundOnCanvas(canvasInstance: Canvas, url: string): Promise<void> {
  const bg = await FabricImage.fromURL(url)
  const w = canvasInstance.getWidth()
  const h = canvasInstance.getHeight()
  bg.scaleToWidth(w)
  bg.scaleToHeight(h)
  bg.selectable = false
  bg.evented = false
  bg.set({ originX: 'center', originY: 'center', left: w / 2, top: h / 2 })
  canvasInstance.backgroundImage = bg
  canvasInstance.requestRenderAll()
}

/**
 * Composable that owns all background-selection business logic:
 * loading images onto the active canvas, syncing product/category state to the
 * store, and tracking the current aspect ratio.
 *
 * @param canvas – reactive ref to the currently active Fabric Canvas instance.
 */
export function useCustomBackground(canvas: Ref<Canvas | null>) {
  // 2. Composables & Stores
  const canvasStore = useCanvasStore()

  // 3. State
  const aspectRatio = ref('1 / 1')

  // 4. Methods

  function clearBackground(): void {
    const c = canvas.value
    if (!c) return
    c.backgroundImage = undefined
    c.requestRenderAll()
  }

  async function loadBackground(url: string): Promise<void> {
    const c = canvas.value
    if (!c) return
    try {
      await loadBackgroundOnCanvas(c, url)
      const bg = c.backgroundImage as FabricImage | undefined
      if (bg && bg.width > 0 && bg.height > 0) {
        aspectRatio.value = `${bg.width} / ${bg.height}`
      }
    }
    catch (error) {
      console.error('Failed to load background image:', error)
      clearBackground()
    }
  }

  function updateBackground(url: string | null | undefined): void {
    if (url) loadBackground(url)
    else clearBackground()
  }

  async function applyCustomBackground(dataUrl: string): Promise<void> {
    const c = canvas.value
    if (!c) return
    try {
      const bg = await FabricImage.fromURL(dataUrl)
      const w = c.getWidth()
      const h = c.getHeight()
      bg.scaleToWidth(w)
      bg.scaleToHeight(h)
      bg.selectable = false
      bg.evented = false
      bg.set({ originX: 'center', originY: 'center', left: w / 2, top: h / 2 })
      c.backgroundImage = bg
      c.requestRenderAll()
      canvasStore.setBackgroundSelection(canvasStore.activeSide, CUSTOM_BACKGROUND_ID)
      canvasStore.setCustomBackgroundDataUrl(canvasStore.activeSide, dataUrl)
      if (bg.width > 0 && bg.height > 0) {
        aspectRatio.value = `${bg.width} / ${bg.height}`
      }
    }
    catch (error) {
      console.error('Failed to load custom background image:', error)
    }
  }

  /** Updates store backgroundSelection for every side of the matching product. */
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

  function selectCustomBackground(): void {
    canvasStore.setSideCount(CUSTOM_SIDES.length)
    CUSTOM_SIDES.forEach((_, i) => canvasStore.setBackgroundSelection(i, CUSTOM_BACKGROUND_ID))
    const storedDataUrl = canvasStore.sides[canvasStore.activeSide]?.customBackgroundDataUrl ?? null
    if (storedDataUrl) {
      applyCustomBackground(storedDataUrl)
      return
    }
    clearBackground()
  }

  /** Call once on mount to register the product tree in the store. */
  function initProductCategories(): void {
    canvasStore.setProductCategoryTree(PRODUCT_CATEGORIES_OBJ)
  }

  function onCategoryChange(index: number): void {
    canvasStore.setActiveCategory(index)
    canvasStore.setActiveProduct(0)
    canvasStore.setActiveSide(0)
    canvasStore.clear()
    const url = PRODUCT_CATEGORIES[index]?.products[0]?.sides[0]?.src
    if (url) syncProductSelection(url)
    updateBackground(url)
  }

  function onProductChange(index: number, dataKey: string | null): void {
    canvasStore.setActiveProduct(index)
    canvasStore.setActiveSide(0)
    if (dataKey === CUSTOM_BACKGROUND_ID) {
      selectCustomBackground()
    }
    else {
      canvasStore.clear()
      const url = PRODUCT_CATEGORIES[canvasStore.activeCategory]?.products[index]?.sides[0]?.src
      if (url) syncProductSelection(url)
      updateBackground(url)
    }
  }

  function onSideChange(index: number): void {
    canvasStore.setActiveSide(index)
    // Each side canvas already carries its background from initialisation.
    // Only reload when the side has a product background (not custom), because
    // canvas.clear() may have wiped it when the product changed.
    const selection = canvasStore.sides[index]?.backgroundSelection
    if (selection && selection !== CUSTOM_BACKGROUND_ID) {
      loadBackground(selection)
    }
  }

  return {
    aspectRatio,
    applyCustomBackground,
    loadBackgroundOnCanvas,
    initProductCategories,
    onCategoryChange,
    onProductChange,
    onSideChange,
  }
}
