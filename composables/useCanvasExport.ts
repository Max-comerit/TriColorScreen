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
 * When a rotation angle is provided the visual content is wrapped in a <g>
 * element with a rotate transform around the true centre of the viewBox
 * coordinate space. The viewBox is expanded symmetrically around that centre
 * so the rotated content is fully visible with no clipping.
 *
 * This ensures every exported SVG has a consistent, meaningful size instead of
 * reflecting the original file's arbitrary viewBox dimensions.
 */
function stampSvgExportSize(svgDataUrl: string, width: number, height: number, angle: number): string {
  const svgText = decodeURIComponent(
    svgDataUrl.replace('data:image/svg+xml;charset=utf-8,', '')
  )
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgEl = doc.documentElement

  const roundedWidth = Math.round(width)
  const roundedHeight = Math.round(height)

  // Read all four viewBox components — including minX/minY which may be
  // non-zero (e.g. Google Material icons use viewBox="0 -960 960 960").
  const viewBoxAttr = svgEl.getAttribute('viewBox')
  let minX: number, minY: number, vW: number, vH: number
  if (viewBoxAttr) {
    const parts = viewBoxAttr.trim().split(/[\s,]+/)
    minX = parseFloat(parts[0])
    minY = parseFloat(parts[1])
    vW   = parseFloat(parts[2])
    vH   = parseFloat(parts[3])
  } else {
    minX = 0; minY = 0; vW = roundedWidth; vH = roundedHeight
  }

  // Normalise to [0, 360) so the angle === 0 short-circuit is reliable.
  const normalisedAngle = ((angle % 360) + 360) % 360

  if (normalisedAngle === 0) {
    svgEl.setAttribute('width', String(roundedWidth))
    svgEl.setAttribute('height', String(roundedHeight))
    return new XMLSerializer().serializeToString(svgEl)
  }

  // True centre of the viewBox coordinate space.
  const cx = minX + vW / 2
  const cy = minY + vH / 2

  const θ = (angle * Math.PI) / 180
  const abscos = Math.abs(Math.cos(θ))
  const abssin = Math.abs(Math.sin(θ))

  // New bounding box in SVG user units after rotation around (cx, cy).
  const newVW = vW * abscos + vH * abssin
  const newVH = vW * abssin + vH * abscos

  // Physical pixel dimensions — maintain the same pixel-per-unit scale.
  const scale = roundedWidth / vW
  const newWidth  = Math.round(newVW * scale)
  const newHeight = Math.round(newVH * scale)

  // Wrap visual content in a pure rotation transform (no translate needed —
  // the viewBox update below absorbs the offset). Structural elements
  // (<defs>, <style>, etc.) stay at root so their references keep resolving.
  const KEEP_AT_ROOT = new Set(['defs', 'style', 'title', 'desc', 'metadata'])
  const g = doc.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`)

  const toMove = Array.from(svgEl.childNodes).filter(
    node => !(node.nodeType === 1 && KEEP_AT_ROOT.has((node as Element).tagName.toLowerCase()))
  )
  for (const child of toMove) {
    g.appendChild(child)
  }
  svgEl.appendChild(g)

  // Expand the viewBox symmetrically around the same centre so the rotated
  // content is fully visible without any extra translation.
  svgEl.setAttribute('viewBox', `${cx - newVW / 2} ${cy - newVH / 2} ${newVW} ${newVH}`)
  svgEl.setAttribute('width', String(newWidth))
  svgEl.setAttribute('height', String(newHeight))

  return new XMLSerializer().serializeToString(svgEl)
}

export function useCanvasExport() {
  async function exportMergedImage(canvas: Canvas): Promise<string> {
    // Render to an offscreen canvas so the live canvas is never repainted without
    // selection handles. toCanvasElement sets skipControlsDrawing=true internally,
    // so the export never includes selection borders — no need to discardActiveObject.
    const offscreenEl = canvas.toCanvasElement()

    const bg = canvas.backgroundImage as FabricImage | undefined

    // When all canvases share a single wrapper div, switching sides forces every
    // canvas to the active side's aspect ratio. The background is re-scaled with
    // scaleToHeight, so a portrait background on a wider canvas renders narrower
    // than the canvas width, producing black bars on the left and right.
    // Detect this case and crop the exported image to the background region only.
    if (bg && bg.width > 0 && bg.height > 0) {
      const canvasW = canvas.getWidth()
      const canvasH = canvas.getHeight()
      // Rendered background width when scaleToHeight wins: bg.width * (canvasH / bg.height)
      const renderedBgW = Math.round(bg.width * (canvasH / bg.height))
      if (renderedBgW < canvasW - 1) {
        const srcX = Math.round((canvasW - renderedBgW) / 2)
        const cropCanvas = document.createElement('canvas')
        cropCanvas.width = renderedBgW
        cropCanvas.height = canvasH
        const ctx = cropCanvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(offscreenEl, srcX, 0, renderedBgW, canvasH, 0, 0, renderedBgW, canvasH)
          return new Promise<string>((resolve, reject) => {
            cropCanvas.toBlob((blob) => {
              if (!blob) return reject(new Error('toBlob returned null'))
              resolve(URL.createObjectURL(blob))
            }, 'image/png')
          })
        }
      }
    }

    if (typeof offscreenEl.toBlob === 'function') {
      return new Promise((resolve, reject) => {
        offscreenEl.toBlob((blob) => {
          if (!blob) return reject(new Error('toBlob returned null'))
          resolve(URL.createObjectURL(blob))
        }, 'image/png')
      })
    }

    return offscreenEl.toDataURL()
  }

  async function exportImageObjects(canvas: Canvas): Promise<ExportedLayer[]> {
    const imageObjects = canvas
      .getObjects()
      .filter(obj => obj instanceof FabricImage) as FabricImage[]

    return Promise.all(
      imageObjects.map(async (obj): Promise<ExportedLayer> => {
        const svgDataUrl = (obj as FabricImage & { svgDataUrl?: string }).svgDataUrl

        if (svgDataUrl) {
          // Stamp the canvas-rendered dimensions and rotation onto the SVG so
          // the exported file reflects the actual size and orientation as placed in the design.
          const svgText = stampSvgExportSize(svgDataUrl, obj.getScaledWidth(), obj.getScaledHeight(), obj.angle)
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
