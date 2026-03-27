// composables/useCanvasExport.ts
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

export interface ExportedLayer {
  url: string
  mimeType: 'image/png' | 'image/svg+xml'
}

export function useCanvasExport() {
  async function exportMergedImage(canvas: Canvas): Promise<string> {
    const htmlCanvas = canvas.getElement() as HTMLCanvasElement
    
    canvas.discardActiveObject()
    canvas.renderAll() // Ensure canvas is fully rendered before export

    if (typeof htmlCanvas.toBlob === 'function') {
      return new Promise((resolve, reject) => {
        htmlCanvas.toBlob((blob) => {
          if (!blob) return reject(new Error('toBlob returned null'))
          resolve(URL.createObjectURL(blob))
        }, 'image/png')
      })
    }

    return canvas.toDataURL({ format: 'png', multiplier: 1 })
  }

  async function exportImageObjects(canvas: Canvas): Promise<ExportedLayer[]> {
    const imageObjects = canvas
      .getObjects()
      .filter(obj => obj instanceof FabricImage) as FabricImage[]

    return Promise.all(
      imageObjects.map(async (obj): Promise<ExportedLayer> => {
        const svgDataUrl = (obj as FabricImage & { svgDataUrl?: string }).svgDataUrl

        if (svgDataUrl) {
          // Return the original vector SVG instead of rasterising it.
          // Decode the percent-encoded data URL back to SVG text and wrap
          // in a blob so the QuoteForm pipeline handles it uniformly.
          const svgText = decodeURIComponent(
            svgDataUrl.replace('data:image/svg+xml;charset=utf-8,', '')
          )
          const blob = new Blob([svgText], { type: 'image/svg+xml' })
          return { url: URL.createObjectURL(blob), mimeType: 'image/svg+xml' }
        }

        // Raster images: render to an offscreen canvas and export as PNG.
        const objCanvas = obj.toCanvasElement()
        if (typeof objCanvas.toBlob === 'function') {
          const url = await new Promise<string>((resolve, reject) => {
            objCanvas.toBlob((blob) => {
              if (!blob) return reject(new Error('toBlob returned null'))
              resolve(URL.createObjectURL(blob))
            }, 'image/png')
          })
          return { url, mimeType: 'image/png' }
        }

        return { url: objCanvas.toDataURL('image/png'), mimeType: 'image/png' }
      })
    )
  }

  return {
    exportMergedImage,
    exportImageObjects,
  }
}
