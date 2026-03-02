// composables/useCanvasControls.ts

import { FabricImage, Textbox } from 'fabric'
import type { Canvas, FabricObject } from 'fabric'
import { CircularTextbox } from '~/utils/circularTextbox'
import { setTextboxTextRadius } from '~/utils/customDesign'
import { useCustomImage } from '~/composables/useCustomImage'
import { useCustomText } from '~/composables/useCustomText'

/**
 * Canvas Controls Composable
 * @description Re-applies custom Fabric.js controls to canvas objects.
 * Custom controls (renderers, event handlers) are functions and cannot be serialized
 * to JSON, so they must be re-applied after restoring canvas state from JSON.
 *
 * Use `makeControlsReviver` as the reviver argument to `loadFromJSON` to fix
 * controls immediately per-object as they are added, preventing mouse-event
 * errors on partially-loaded canvases.
 */

export function useCanvasControls() {
  const { applyImageControls } = useCustomImage()
  const { applyTextboxControls } = useCustomText()

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
    return (_data: Record<string, unknown>, obj: unknown): void => {
      if (obj instanceof FabricImage || obj instanceof Textbox) {
        reapplyControlsToObject(obj)
      }
    }
  }

  return { reapplyControls, reapplyControlsToObject, makeControlsReviver }
}
