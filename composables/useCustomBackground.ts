// composables/useCustomBackground.ts

// 1. Imports
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { useCanvasStore } from '@/stores/canvasStore'

export const CUSTOM_BACKGROUND_ID = 'custom'

/**
 * Loads a background image onto a canvas instance by URL.
 * Returns the loaded FabricImage so callers can read its dimensions (e.g. to update aspect ratio).
 */
export async function loadBackgroundOnCanvas(canvasInstance: Canvas, url: string): Promise<FabricImage> {
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
  return bg
}

/**
 * Composable for background image state and operations.
 */
export function useCustomBackground() {
  // 2. Composables & Stores
  const canvasStore = useCanvasStore()

  // 3. Methods

  /**
   * Applies a user-uploaded image as the background for the active canvas side.
   * Updates the store with the custom selection and persists the data URL.
   */
  async function applyCustomBackground(canvas: Canvas, dataUrl: string): Promise<void> {
    try {
      const bg = await FabricImage.fromURL(dataUrl)
      const w = canvas.getWidth()
      const h = canvas.getHeight()
      bg.scaleToWidth(w)
      bg.scaleToHeight(h)
      bg.selectable = false
      bg.evented = false
      bg.set({ originX: 'center', originY: 'center', left: w / 2, top: h / 2 })
      canvas.backgroundImage = bg
      canvas.requestRenderAll()
      canvasStore.setBackgroundSelection(canvasStore.activeSide, CUSTOM_BACKGROUND_ID)
      canvasStore.setCustomBackgroundDataUrl(canvasStore.activeSide, dataUrl)
      if (bg.width > 0 && bg.height > 0) {
        canvasStore.setAspectRatio(`${bg.width} / ${bg.height}`)
      }
    }
    catch (error) {
      console.error('Failed to load custom background image:', error)
    }
  }

  return {
    applyCustomBackground,
  }
}
