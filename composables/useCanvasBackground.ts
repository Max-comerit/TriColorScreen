// composables/useCanvasBackground.ts

// 1. Imports
import type { Canvas } from 'fabric'
import { useCanvasStore } from '@/stores/canvasStore'
import { FabricImage } from 'fabric'

/**
 * Composable for background image state and operations.
 */
export function useCanvasBackground() {
  // 2. Composables & Stores
  const canvasStore = useCanvasStore()

  // 3. Methods

  /**
   * Loads a background image onto a canvas by URL.
   * @param side - The side of the canvas (0, 1, or 2).
   * @param canvas - The Fabric.js canvas instance to update.
   * @param url - The URL of the background image to load.
   * @returns A promise that resolves when the background image is loaded and applied.
   */
  async function loadBackgroundOnCanvas(side: number, canvas: Canvas, url: string): Promise<void> {
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

      if (side === canvasStore.activeSide && bg.width > 0 && bg.height > 0) {
        canvasStore.setAspectRatio(`${bg.width} / ${bg.height}`)
      }
    }
    catch (error) {
      console.error('Failed to load background image:', error)
    }
  }

  return {
    loadBackgroundOnCanvas,
  }
}
