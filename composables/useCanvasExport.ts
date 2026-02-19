// composables/useCanvasExport.ts
import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

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

  async function exportImageObjects(canvas: Canvas): Promise<string[]> {
    const imageObjects = canvas
      .getObjects()
      .filter(obj => obj instanceof FabricImage) as FabricImage[]

    return Promise.all(
      imageObjects.map(obj => {
        const objCanvas = obj.toCanvasElement()

        if (typeof objCanvas.toBlob === 'function') {
          return new Promise<string>((resolve, reject) => {
            objCanvas.toBlob((blob) => {
              if (!blob) return reject(new Error('toBlob returned null'))
              resolve(URL.createObjectURL(blob))
            }, 'image/png')
          })
        }

        return Promise.resolve(objCanvas.toDataURL('image/png'))
      })
    )
  }

  return {
    exportMergedImage,
    exportImageObjects,
  }
}
