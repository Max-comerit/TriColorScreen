// composables/useCustomBackground.ts

// 1. Imports
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

/**
 * Composable for background image state and operations.
 */
export function useCustomBackground() {
  // 2. Composables & Stores

  // 3. Methods

  /**
   * Loads a background image onto a canvas by URL.
   * Returns the loaded FabricImage so callers can read its dimensions (e.g. to update aspect ratio).
   */
  async function loadBackgroundOnCanvas(canvas: Canvas, url: string): Promise<FabricImage | null> {
    try {
      const bg = await FabricImage.fromURL(url)
      const w = canvas.getWidth()
      const h = canvas.getHeight()
      bg.scaleToWidth(w)
      bg.scaleToHeight(h)
      bg.selectable = false
      bg.evented = false
      bg.set({ originX: 'center', originY: 'center', left: w / 2, top: h / 2 })
      canvas.backgroundImage = bg
      canvas.requestRenderAll()
      return bg
    }
    catch (error) {
      console.error('Failed to load background image:', error)
      return null
    }
  }

  return {
    loadBackgroundOnCanvas,
  }
}
