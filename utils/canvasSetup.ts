// utils/canvasSetup.ts

import { ActiveSelection, Control, controlsUtils } from 'fabric'
import {
  createRotateControlRender,
  createTrashControlRender,
  createResizeControlRender,
} from './canvasControlRenders'
import { getRotateImage, getTrashCanImage, getResizeImage } from './customImageIcons'

/**
 * Configures Fabric's ActiveSelection (box/multi-select) with custom controls:
 * a delete icon, a rotate icon, and a resize icon.
 * Call once before any canvas is initialized.
 */
export function configureActiveSelectionDefaults(): void {
  ActiveSelection.ownDefaults.controls = {
    deleteControl: new Control({
      x: 0.5,
      y: -0.5,
      offsetX: 12,
      offsetY: -12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createTrashControlRender(getTrashCanImage()),
      mouseUpHandler: (_eventData, transform) => {
        const target = transform?.target as ActiveSelection | undefined
        if (target) {
          const c = target.canvas
          if (c) {
            target.getObjects().forEach(obj => c.remove(obj))
            c.discardActiveObject()
            c.requestRenderAll()
          }
        }
      },
    }),
    rotateControl: new Control({
      x: 0,
      y: -0.5,
      offsetY: -50,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'pointer',
      render: createRotateControlRender(getRotateImage()),
      withConnection: true,
      actionHandler: controlsUtils.rotationWithSnapping,
    }),
    resizeIcon: new Control({
      x: 0.5,
      y: 0.5,
      offsetX: 12,
      offsetY: 12,
      sizeX: 36,
      sizeY: 36,
      cursorStyle: 'nwse-resize',
      render: createResizeControlRender(getResizeImage()),
      actionHandler: controlsUtils.scalingEqually,
    }),
  }
  ActiveSelection.ownDefaults.borderColor = 'blue'
  ActiveSelection.ownDefaults.borderScaleFactor = 1
  ActiveSelection.ownDefaults.borderDashArray = [5, 5]
}
