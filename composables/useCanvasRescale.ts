import type { Canvas, FabricImage } from 'fabric'

/**
 * Rescale Canvas Objects Composable
 * @description Proportionally rescales canvas objects and background image by a given ratio.
 * Used when the canvas viewport size changes to keep object positions and sizes
 * proportional to the new canvas dimensions.
 */

export function useCanvasRescale() {
  function rescaleBackground(canvas: Canvas, ratio: number): void {
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

  function rescaleObjects(canvas: Canvas, ratio: number): void {
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

  return { rescaleBackground, rescaleObjects }
}
