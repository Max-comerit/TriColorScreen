import type { FabricObject, Canvas } from 'fabric'

/**
 * Toggles the z-order of a single Fabric object.
 * If the object is at the front, sends it to the back. Otherwise, brings it to the front.
 * 
 * @param target - The Fabric object to toggle
 * @param canvas - The Fabric canvas instance
 */
export function toggleObjectZOrder(target: FabricObject, canvas: Canvas): void {
  const objects = canvas.getObjects()
  const currentIndex = objects.indexOf(target)
  const topIndex = objects.length - 1
  
  if (currentIndex === topIndex) {
    canvas.sendObjectToBack(target)
  } else {
    canvas.bringObjectToFront(target)
  }
  canvas.requestRenderAll()
}