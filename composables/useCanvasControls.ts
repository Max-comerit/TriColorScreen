// composables/useCanvasControls.ts

import { FabricImage, Textbox, Control, controlsUtils, util } from 'fabric'
import type { Canvas, FabricObject } from 'fabric'
import { CircularTextbox } from '~/utils/canvasCircularTextbox'
import { setTextboxTextRadius, toggleObjectZOrder } from '~/utils/canvasUtils'
import { attachSvgDataUrl } from '~/composables/useCanvasImage'
import {
  createResizeControlRender,
  createRotateControlRender,
  createTrashControlRender,
  createBringToFrontControlRender,
} from '~/utils/canvasControlRenders'
import { getResizeImage, getRotateImage, getTrashCanImage, getBringToFrontImage } from '@/utils/customImageIcons'


interface Transform {
  target?: unknown
}

/**
 * Canvas Controls Composable
 * @description Re-applies custom Fabric.js controls to canvas objects.
 * Custom controls (renderers, event handlers) are functions and cannot be serialized
 * to JSON, so they must be re-applied after restoring canvas state from JSON.
 *
 * Use `makeControlsReviver` as the reviver argument to `loadFromJSON` to fix
 * controls immediately per-object as they are added, preventing mouse-event
 * errors on partially-loaded canvases.
 * 
 * @returns {Object} Composable with the following functions:
 *   - applyImageControls: Applies standard controls to FabricImage objects
 *   - applyTextboxControls: Applies specialized controls to Textbox objects with width-resize
 *   - reapplyControls: Re-applies controls to all objects on a canvas
 *   - reapplyControlsToObject: Re-applies controls to a single object
 *   - makeControlsReviver: Returns a reviver function to pass to loadFromJSON for per-object fixes
 */

export function useCanvasControls() {
  /**
   * Factory functions for creating reusable control definitions
   */

  function createBringToFrontControl(): Control {
    return new Control({
      x: -0.5,
      y: -0.5,
      offsetX: -12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createBringToFrontControlRender(getBringToFrontImage()),
      mouseUpHandler: (_eventData: unknown, transform: Transform): boolean => {
        const target = transform?.target as FabricObject | undefined
        if (target && target.canvas) {
          toggleObjectZOrder(target, target.canvas)
        }
        return true
      },
    })
  }

  function createDeleteControl(): Control {
    return new Control({
      x: 0.5,
      y: -0.5,
      offsetX: 12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createTrashControlRender(getTrashCanImage()),
      mouseUpHandler: (_eventData: unknown, transform: Transform): boolean => {
        const target = transform?.target as FabricObject | undefined
        if (target) {
          const canvas = target.canvas
          canvas?.remove(target)
          canvas?.requestRenderAll()
        }
        return true
      },
    })
  }

  function createRotateControl(): Control {
    return new Control({
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
  }

  function createResizeControl(): Control {
    return new Control({
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

  function createWidthResizeControl(): Control {
    return new Control({
      x: -0.5,
      y: 0.5,
      offsetX: -12,
      offsetY: 12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'ew-resize',
      render: (ctx, left, top, _styleOverride, fabricObject) => {
        const size = 24
        const img = getResizeImage()
        ctx.save()
        ctx.translate(left, top)
        ctx.fillStyle = 'white'
        ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
        ctx.beginPath()
        ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
        ctx.fill()

        if (img.complete) {
          ctx.drawImage(img, -size / 2, -size / 2, size, size)
        }

        ctx.restore()
      },
      withConnection: true,
      actionHandler: controlsUtils.changeObjectWidth,
    })
  }


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

    // Add custom controls using factory functions
    image.controls = {
      bringToFrontControl: createBringToFrontControl(),
      deleteControl: createDeleteControl(),
      rotateControl: createRotateControl(),
      resizeControl: createResizeControl(),
    }
  }

  /**
   * Apply custom controls to an existing Textbox.
   * Called both when first adding and when restoring from JSON.
   */
  function applyTextboxControls(textbox: Textbox): void {
    textbox.controls = {
      bringToFrontIcon: createBringToFrontControl(),
      deleteIcon: createDeleteControl(),
      rotateIcon: createRotateControl(),
      scaleIcon: createResizeControl(),
      resize: createWidthResizeControl(),
    }
  }

  function reapplyControlsToObject(obj: FabricObject): void {
    if (obj instanceof FabricImage) {
      applyImageControls(obj)
    } else if (obj instanceof CircularTextbox) {
      // CircularTextbox must be checked before Textbox since it extends it.
      // Cast to Textbox because CircularTextbox.toObject uses @ts-expect-error to work
      // around Fabric's complex generic constraint — the runtime behaviour is correct.
      applyTextboxControls(obj as unknown as Textbox)
      // Re-apply textRadius after applyTextboxControls resets all controls,
      // to restore correct path and resize control visibility
      setTextboxTextRadius(obj, obj.textRadius)
    } else if (obj instanceof Textbox) {
      applyTextboxControls(obj)
    }
  }

  function reapplyControls(canvas: Canvas): void {
    canvas.getObjects().forEach(reapplyControlsToObject)
  }

  /**
   * Returns a reviver function to pass to `canvas.loadFromJSON(json, reviver)`.
   * Fixes controls on each object as it is added, before any mouse events can fire.
   */
  function makeControlsReviver() {
    return (data: Record<string, unknown>, obj: unknown): void => {
      if (obj instanceof FabricImage) {
        reapplyControlsToObject(obj)
        // Re-attach the SVG source URL (and toObject override) so it survives
        // future save/restore cycles after a canvas side switch.
        if (typeof data.svgDataUrl === 'string') {
          attachSvgDataUrl(obj, data.svgDataUrl)
        }
      } else if (obj instanceof Textbox) {
        reapplyControlsToObject(obj)
      }
    }
  }

  return { applyImageControls, applyTextboxControls, reapplyControls, reapplyControlsToObject, makeControlsReviver }
}
