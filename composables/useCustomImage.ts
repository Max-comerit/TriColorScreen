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

interface Transform {
  target?: unknown
}



export function useCustomImage() {
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

      // Clear default controls
      image.controls = {}

      // Configure the image
      image.selectable = true
      image.hasControls = true
      image.hasBorders = true
      image.scaleToWidth(100) // Default size, can be adjusted

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
            const canvas = target.canvas
            const objects = canvas.getObjects()
            const currentIndex = objects.indexOf(target)
            const topIndex = objects.length - 1
            
            // Toggle: if already at front, send to back; otherwise bring to front
            if (currentIndex === topIndex) {
              canvas.sendObjectToBack(target)
            } else {
              canvas.bringObjectToFront(target)
            }
            canvas.requestRenderAll()
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


