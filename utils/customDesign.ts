/**
 * Custom design utilities for Fabric.js objects, including z-order toggling and circular text path creation.
 * 
 * This module provides functions to manipulate the z-order of Fabric objects and to set a circular text path for Textbox objects based on a specified radius. The circular path is created using SVG path syntax and is centered at the origin. The module also includes a function to check if the radius value is within a valid range for creating a circular path.
 */
import type { FabricObject, Canvas, Textbox } from 'fabric'
import { Path } from 'fabric'

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
 * Checks if the given radius value is within the valid range for creating a circular path.
 * The valid range is defined by MIN_RADIUS and MAX_RADIUS constants.
 *
 * @param radius - The radius value to check
 * @return boolean - True if the radius is valid, false otherwise
 * @see MIN_RADIUS
 * @see MAX_RADIUS
 */
const MIN_RADIUS = 25
const MAX_RADIUS = 150
function hasPath(radius: number): boolean {
  return (radius >= MIN_RADIUS && radius <= MAX_RADIUS);
}

/**
 * Creates a circular path for text to follow, based on the specified radius.
 * The path is centered at the origin (0, 0) and rotated 90 degrees to align with typical text orientation.
 * The path is defined using SVG path syntax, creating a full circle with the specified radius.
 * 
 * @param radius - The radius of the circular path
 */
function createCircularTextPath(radius: number) : Path {
  if(hasPath(radius)) {
    // Create a circle path centered at origin (0, 0), rotated 90 degrees
    return new Path(
        `M 0 ${radius} 
        A ${radius} ${radius} 0 1 1 0 -${radius} 
        A ${radius} ${radius} 0 1 1 0 ${radius} 
        Z`,
        { offset: { x: 0, y: radius }, fill: '', stroke: 'blue', strokeWidth: 1, strokeDashArray: [5, 5], visible: false }
      );
  } else {
    return undefined as unknown as Path; // Return undefined if radius is out of bounds, but cast to Path to satisfy return type
  }
}

/**
 * Sets the text radius for a Textbox object, which determines whether the text follows a circular path.
 * If the radius is within the valid range, the Textbox's width is updated to match the circumference of the circle, and a circular path is created. 
 * If the radius is out of bounds, the Textbox reverts to normal text layout without a path.
 * The visibility of the resize control is also toggled based on whether the text is following a path, as resizing doesn't make sense in that context.
 * 
 * @param textbox - The Textbox object to update
 * @param radius - The desired text radius, which determines the circular path
 */
export function setTextboxTextRadius(textbox: Textbox, radius: number): void {
  textbox.set({
    width: hasPath(radius) ? 2 * Math.PI * radius : textbox.width, // Update width based on whether text is on a path
    textRadius: radius,
    path: createCircularTextPath(radius),
    pathSide: 'left',
    pathStartOffset: 0,
  })
  textbox.controls.resize.visible = !hasPath(radius) // Hide resize control if text is on a path, since resizing doesn't make sense in that context
  textbox.setCoords() // Update the bounding box after changing width
}