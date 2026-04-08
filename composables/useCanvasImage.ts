// composables/useCanvasImage.ts

import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'
import { useCanvasControls } from '~/composables/useCanvasControls'

/** FabricImage extended with an optional persisted SVG source URL. */
type FabricImageWithSvg = FabricImage & { svgDataUrl?: string }

/**
 * Attach the original SVG data URL to a FabricImage so it can be recovered
 * at export time and survives canvas save / restore round-trips.
 *
 * Overrides `toObject` on the specific instance so that `canvas.toJSON()`
 * includes `svgDataUrl` in the serialized output without needing to touch
 * `canvas.toJSON(['svgDataUrl'])` at the call site.
 */
export function attachSvgDataUrl(image: FabricImage, svgDataUrl: string): void {
  const imgWithSvg = image as FabricImageWithSvg
  imgWithSvg.svgDataUrl = svgDataUrl

  // Cast through unknown to avoid Fabric v6's overly complex generic signature on toObject.
  const originalToObject = (image.toObject as (props?: string[]) => Record<string, unknown>).bind(image)
  ;(image as { toObject: (props?: string[]) => Record<string, unknown> }).toObject = (propertiesToInclude?: string[]) => ({
    ...originalToObject(propertiesToInclude),
    svgDataUrl,
  })
}

/**
 * SVGs without explicit width/height attributes (only viewBox) render at 0×0
 * in Fabric.js, causing mispositioned or invisible objects. This normalizes
 * the SVG by injecting dimensions derived from the viewBox before loading.
 */
function normalizeSvgDimensions(svgText: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgEl = doc.documentElement

  if (!svgEl.hasAttribute('width') || !svgEl.hasAttribute('height')) {
    const viewBox = svgEl.getAttribute('viewBox')
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/)
      if (parts.length === 4) {
        const w = parseFloat(parts[2])
        const h = parseFloat(parts[3])
        if (!isNaN(w) && !isNaN(h)) {
          if (!svgEl.hasAttribute('width')) svgEl.setAttribute('width', String(w))
          if (!svgEl.hasAttribute('height')) svgEl.setAttribute('height', String(h))
        }
      }
    }
  }

  const serializer = new XMLSerializer()
  const fixedSvg = serializer.serializeToString(svgEl)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fixedSvg)}`
}

/**
 * Reads a file and resolves with a base64-encoded data URL.
 * Used for raster image formats (PNG, JPEG, WebP, GIF).
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') resolve(result)
      else reject(new Error('Failed to read file as data URL'))
    }
    reader.onerror = () => reject(new Error('File reading error'))
    reader.readAsDataURL(file)
  })
}

/**
 * Reads an SVG file as text, normalizes its dimensions, and resolves with
 * a percent-encoded `data:image/svg+xml` URL ready for Fabric.js.
 * Reading as text (instead of a base64 data URL) is required so the SVG
 * markup can be parsed and patched by normalizeSvgDimensions.
 */
function readSvgAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read SVG file'))
        return
      }
      resolve(normalizeSvgDimensions(result))
    }
    reader.onerror = () => reject(new Error('File reading error'))
    reader.readAsText(file)
  })
}


export function useCanvasImage() {
  const { applyImageControls } = useCanvasControls()

  /**
   * Add a custom image to the canvas from a File object
   * Images are selectable, draggable, and have a delete button
   * @param canvas - The Fabric.js canvas instance
   * @param file - The image file to add
   */
  async function addImageToCanvas(canvas: Canvas | null, file: File): Promise<FabricImage | null> {
    if (!canvas) {
      console.error('Canvas is not initialized')
      return null
    }

    try {
      // SVGs without explicit width/height must be normalized first so Fabric.js
      // can determine natural dimensions and centre the object correctly.
      const isSvg = file.type === 'image/svg+xml'
      const dataUrl = isSvg
        ? await readSvgAsDataUrl(file)
        : await readFileAsDataUrl(file)

      // Load the image using Fabric.js
      const image = await FabricImage.fromURL(dataUrl)

      // For SVGs, attach the source data URL so the export pipeline can
      // return the original vector instead of a rasterized PNG.
      if (isSvg) {
        attachSvgDataUrl(image, dataUrl)
      }

      // Apply custom controls and styling
      applyImageControls(image)

      // Default size for new images
      image.scaleToWidth(100)

      // Center the image on the canvas
      canvas.centerObject(image)

      // Add to canvas (on top of existing layers)
      canvas.add(image)

      // Set as active object so user can immediately manipulate it
      canvas.setActiveObject(image)

      // Render the canvas
      canvas.renderAll()

      return image
    } catch (error) {
      console.error('Failed to add image to canvas:', error)
      throw error
    }
  }

  return {
    addImageToCanvas,
  }
}
