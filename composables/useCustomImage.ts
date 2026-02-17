// composables/useCustomImage.ts

import type { Canvas } from 'fabric'
import { FabricImage } from 'fabric'

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
      const img = await FabricImage.fromURL(dataUrl)

      // Configure the image
      img.selectable = true
      img.scaleToWidth(200) // Default size, can be adjusted

      // Center the image on the canvas
      canvas.centerObject(img)

      // Add to canvas (on top of existing layers)
      canvas.add(img)

      // Set as active object so user can immediately manipulate it
      canvas.setActiveObject(img)

      // Render the canvas
      canvas.renderAll()

      return img
    } catch (error) {
      console.error('Failed to add image to canvas:', error)
      throw error
    }
  }

  return {
    addImageToCanvas,
  }
}


