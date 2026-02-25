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
import { toggleObjectZOrder } from '@/utils/customDesign'

interface Transform {
  target?: unknown
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
      // Read the file as a data URL
      const reader = new FileReader()

      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            resolve(result)
          } else {
            reject(new Error('Failed to read file as data URL'))
          }
        }
        reader.onerror = () => reject(new Error('File reading error'))
        reader.readAsDataURL(file)
      })

      // Load the image using Fabric.js
      const image = await FabricImage.fromURL(dataUrl)

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


