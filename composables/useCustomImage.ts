// composables/useCustomImage.ts

import type { Canvas } from 'fabric'
import { FabricImage, Control, controlsUtils } from 'fabric'
import {
  createResizeControlRender,
  createRotateControlRender,
  createTrashControlRender,
  createBringToFrontControlRender,
} from '@/utils/customControlRenders'
import { getResizeImage, getRotateImage, getTrashCanImage, getBringToFrontImage } from '@/utils/customImageIcons'
import { toggleObjectZOrder } from '~/utils/canvasUtils'

interface Transform {
  target?: unknown
}

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
 * Reads an SVG file as text, normalises its dimensions, and resolves with
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



export function useCustomImage() {
  /**
   * Apply custom controls and appearance to a FabricImage.
   * Called both when first adding and when restoring from JSON.
   */
  function applyImageControls(image: FabricImage): void {
    // Clear default controls
    image.controls = {}
    // Configure the image
    image.selectable = true
    image.hasControls = true
    image.hasBorders = true

    // Add a blue dashed border for better visibility when selected
    image.borderColor = 'blue'
    image.borderScaleFactor = 1
    image.borderDashArray = [5, 5]

    // Disable caching to ensure controls are always rendered
    image.objectCaching = false

    // Add custom control for bring to front
    image.controls.bringToFrontControl = new Control({
      x: -0.5,
      y: -0.5,
      offsetX: -12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createBringToFrontControlRender(getBringToFrontImage()),
      mouseUpHandler: (_eventData: unknown, transform: Transform): boolean => {
        const target = transform?.target as FabricImage | undefined
        if (target && target.canvas) {
          toggleObjectZOrder(target, target.canvas)
        }
        return true
      },
    })

    // Add custom control for delete
    image.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetX: 12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createTrashControlRender(getTrashCanImage()),
      mouseUpHandler: (_eventData: unknown, transform: Transform): boolean => {
        const target = transform?.target as FabricImage | undefined
        if (target) {
          const canvas = target.canvas
          canvas?.remove(target)
          canvas?.requestRenderAll()
        }
        return true
      },
    })
    // Add custom control for rotation
    image.controls.rotateControl = new Control({
      x: 0,
      y: -0.5,
      offsetX: 0,
      offsetY: -50,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'grab',
      render: createRotateControlRender(getRotateImage()),
      actionHandler: controlsUtils.rotationWithSnapping,
      withConnection: true,
    })

    // Add custom control for resize
    image.controls.resizeControl = new Control({
      x: 0.5,
      y: 0.5,
      offsetX: 12,
      offsetY: 12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'nwse-resize',
      render: createResizeControlRender(getResizeImage()),
      withConnection: false,
      actionHandler: controlsUtils.scalingEqually,
    })
  }

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
      // SVGs without explicit width/height must be normalised first so Fabric.js
      // can determine natural dimensions and centre the object correctly.
      const isSvg = file.type === 'image/svg+xml'
      const dataUrl = isSvg
        ? await readSvgAsDataUrl(file)
        : await readFileAsDataUrl(file)

      // Load the image using Fabric.js
      const image = await FabricImage.fromURL(dataUrl)

      // For SVGs, attach the source data URL so the export pipeline can
      // return the original vector instead of a rasterised PNG.
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
    applyImageControls,
    addImageToCanvas,
  }
}


