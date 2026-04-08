// utils/canvasSetup.ts

import { ActiveSelection } from 'fabric'
import { useCanvasControls } from '~/composables/useCanvasControls'

const { createDeleteControl, createRotateControl, createResizeControl } = useCanvasControls()

/**
 * Configures Fabric's ActiveSelection (box/multi-select) with custom controls:
 * a delete icon, a rotate icon, and a resize icon.
 * Call once before any canvas is initialized.
 */
export function configureActiveSelectionDefaults(): void {
  const deleteActiveSelectionHandler = (_eventData: unknown, transform: Transform): boolean => {
    const target = transform.target as ActiveSelection | undefined
    if (target) {
      const c = target.canvas
      if (c) {
        target.getObjects().forEach(obj => c.remove(obj))
        c.discardActiveObject()
        c.requestRenderAll()
      }
    }
    return true
  }

  ActiveSelection.ownDefaults.controls = {
    deleteControl: createDeleteControl(deleteActiveSelectionHandler),
    rotateControl: createRotateControl(),
    resizeControl: createResizeControl()
  }
  ActiveSelection.ownDefaults.borderColor = 'blue'
  ActiveSelection.ownDefaults.borderScaleFactor = 1
  ActiveSelection.ownDefaults.borderDashArray = [5, 5]
}
