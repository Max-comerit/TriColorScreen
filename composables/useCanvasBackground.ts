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
      const scale = w / bg.width

      bg.set({
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
      })
      bg.selectable = false
      bg.evented = false
      canvas.backgroundImage = bg
      canvas.requestRenderAll()

      if (side === canvasStore.activeSide && bg.getScaledWidth() > 0 && bg.getScaledHeight() > 0) {
        canvasStore.setAspectRatio(`${bg.getScaledWidth()} / ${bg.getScaledHeight()}`)
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
