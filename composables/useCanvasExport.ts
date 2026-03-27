// composables/useCanvasExport.ts
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

export interface ExportedLayer {
  url: string
  mimeType: 'image/png' | 'image/svg+xml'
}

/**
 * Stamps the exported SVG's width/height to match the object's actual rendered
 * size on the canvas. The viewBox is preserved so the vector scales correctly;
 * only the outer dimensions (which control the file's intrinsic size) are updated.
 *
 * This ensures every exported SVG has a consistent, meaningful size instead of
 * reflecting the original file's arbitrary viewBox dimensions.
 */
function stampSvgExportSize(svgDataUrl: string, width: number, height: number): string {
  const svgText = decodeURIComponent(
    svgDataUrl.replace('data:image/svg+xml;charset=utf-8,', '')
  )
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgEl = doc.documentElement
  svgEl.setAttribute('width', String(Math.round(width)))
  svgEl.setAttribute('height', String(Math.round(height)))
  return new XMLSerializer().serializeToString(svgEl)
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
          // Stamp the canvas-rendered dimensions onto the SVG so the exported
          // file reflects the actual size as placed in the design.
          const svgText = stampSvgExportSize(svgDataUrl, obj.getScaledWidth(), obj.getScaledHeight())
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
