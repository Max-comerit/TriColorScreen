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

/**
 * Toggles the z-order of multiple Fabric objects.
 * If all objects are at the top, sends them all to the back. Otherwise, brings them all to the front.
 * 
 * @param targets - Array of Fabric objects to toggle
 * @param canvas - The Fabric canvas instance
 */
export function toggleMultipleObjectsZOrder(targets: FabricObject[], canvas: Canvas): void {
  const objects = canvas.getObjects()
  const topIndex = objects.length - 1
  
  // Check if all selected objects are at the top
  const allAtTop = targets.every(obj => {
    const currentIndex = objects.indexOf(obj)
    return currentIndex >= topIndex - targets.length + 1
  })
  
  // Toggle: if all at top, send to back; otherwise bring to front
  targets.forEach(obj => {
    if (allAtTop) {
      canvas.sendObjectToBack(obj)
    } else {
      canvas.bringObjectToFront(obj)
    }
  })
  canvas.requestRenderAll()
}
