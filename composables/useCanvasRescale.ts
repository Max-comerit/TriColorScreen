// composables/useCanvasRescale.ts

import type { Canvas, FabricImage } from 'fabric'

/**
 * Rescale Canvas Objects Composable
 * @description Proportionally rescales canvas objects and background image by a given ratio.
 * Used when the canvas viewport size changes to keep object positions and sizes
 * proportional to the new canvas dimensions.
 */

export function useCanvasRescale() {

  /**
   * Resizes a Fabric canvas to new dimensions and rescales the background image & canvas objects accordingly.
   * @param canvasInstance - The Fabric canvas instance to rescale
   * @param newWidth - The new width of the canvas
   * @param newHeight - The new height of the canvas
   * @param ratio - The scaling ratio to apply to the background image and the canvas objects
   */
  async function rescaleCanvas(
    canvasInstance: Canvas,
    newWidth: number,
    newHeight: number,
    ratio: number,
  ): Promise<void> {
    canvasInstance.setDimensions({ width: newWidth, height: newHeight })
    rescaleBackground(canvasInstance, ratio)
    rescaleObjects(canvasInstance, ratio)
    canvasInstance.requestRenderAll()
  }

  /**
   * Rescales the background image of a Fabric canvas by a given ratio.
   * If no background image is set, the function does nothing.
   * @param canvas - The Fabric canvas instance to rescale the background on
   * @param ratio - The scaling ratio to apply to the background image
   */
  function rescaleBackground( 
    canvas: Canvas, 
    ratio: number
  ): void {
    const bg = canvas.backgroundImage as FabricImage | undefined
    if (!bg) return
    bg.set({
      scaleX: (bg.scaleX ?? 1) * ratio,
      scaleY: (bg.scaleY ?? 1) * ratio,
      left: (bg.left ?? 0) * ratio,
      top: (bg.top ?? 0) * ratio,
    })
    bg.setCoords()
  }

  /**
   * Rescales all objects on the canvas by a given ratio.
   * @param canvas - The Fabric canvas instance to rescale objects on
   * @param ratio - The scaling ratio to apply to the objects
   */

  function rescaleObjects( 
    canvas: Canvas, 
    ratio: number
  ): void {
    canvas.getObjects().forEach((obj) => {
      obj.set({
        left: (obj.left ?? 0) * ratio,
        top: (obj.top ?? 0) * ratio,
        scaleX: (obj.scaleX ?? 1) * ratio,
        scaleY: (obj.scaleY ?? 1) * ratio,
      })
      obj.setCoords()
    })
  }

  return { rescaleCanvas, rescaleBackground, rescaleObjects }
}
