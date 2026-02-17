// composables/useCustomImage.ts

import type { Canvas } from 'fabric'
import { FabricImage, Control, util, controlsUtils } from 'fabric'

// Preload the trash can icon once
let trashCanImage: HTMLImageElement | null = null
let resizeImage: HTMLImageElement | null = null
let zoomImage: HTMLImageElement | null = null
let rotateImage: HTMLImageElement | null = null

function getTrashCanImage(): HTMLImageElement {
  if (!trashCanImage) {
    trashCanImage = new Image()
    trashCanImage.src = '/images/custom-design/trash-can.svg'
  }
  return trashCanImage
}

function getResizeImage(): HTMLImageElement {
  if (!resizeImage) {
    resizeImage = new Image()
    resizeImage.src = '/images/custom-design/resize.svg'
  }
  return resizeImage
}

function getRotateImage(): HTMLImageElement {
  if (!rotateImage) {
    rotateImage = new Image()
    rotateImage.src = '/images/custom-design/rotate.svg'
  }
  return rotateImage
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

      // Add custom control for delete
      image.controls.deleteControl = new Control({
        x: 0.5,
        y: -0.5,
        offsetX: 0,
        offsetY: 0,
        cursorStyle: 'pointer',
        render: (ctx, left, top, _styleOverride, fabricObject) => {          
          const size = 24
          const img = getTrashCanImage()
          ctx.save()
          ctx.translate(left, top)
          ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
          ctx.fillStyle = 'red'
          ctx.beginPath()
          ctx.arc(0, 0, 3*size / 4, 0, Math.PI * 2)
          ctx.fill()
          if (img.complete) {
            ctx.drawImage(img, -size / 2, -size / 2, size, size)
          }
          ctx.restore()
        },
        mouseUpHandler: (_eventData: unknown, transform: any): boolean => {
          const target = transform?.target
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
        y: -0.75,
        offsetX: 0,
        offsetY: 0,
        cursorStyle: 'grab',
        render: (ctx, left, top, _styleOverride, fabricObject) => {
          const size = 24
          const img = getRotateImage()
          ctx.save()
          ctx.translate(left, top)
          ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(0, 0, 3*size / 4, 0, Math.PI * 2)
          ctx.fill()
          if (img.complete) {
            ctx.drawImage(img, -size / 2, -size / 2, size, size)
          }
          ctx.restore()
        },
        actionHandler: controlsUtils.rotationWithSnapping,
      })

      // Add custom control for resize
      image.controls.resizeControl = new Control({
        x: 0.5,
        y: 0.5,
        offsetX: 0,
        offsetY: 0,
        cursorStyle: 'nwse-resize',
        render: (ctx, left, top, _styleOverride, fabricObject) => {
          const size = 24
          const img = getResizeImage()
          ctx.save()
          ctx.translate(left, top)
          ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(0, 0, 3*size / 4, 0, Math.PI * 2)
          ctx.fill()
          if (img.complete) {
            ctx.rotate(util.degreesToRadians(45))
            ctx.drawImage(img, -size / 2, -size / 2, size, size)
          }
          ctx.restore()
        },
        withConnection: true,
        actionHandler: controlsUtils.scalingEqually,
      })

      // Configure the image
      image.selectable = true
      image.hasControls = true
      image.hasBorders = false
      image.scaleToWidth(200) // Default size, can be adjusted

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


