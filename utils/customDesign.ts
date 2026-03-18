/**
 * Custom design utilities for Fabric.js objects, including z-order toggling and circular text path creation.
 * 
 * This module provides functions to manipulate the z-order of Fabric objects and to set a circular text path for Textbox objects based on a specified radius. The circular path is created using SVG path syntax and is centered at the origin. The module also includes a function to check if the radius value is within a valid range for creating a circular path.
 */
import type { FabricObject, Canvas, FabricImage } from 'fabric'
import type { CircularTextbox } from './circularTextbox'
import { Path } from 'fabric'
import { CUSTOM_BACKGROUND_ID } from '~/composables/useCustomBackground'

// Valid range for text radius to create a circular path
export const MIN_TEXT_RADIUS = 25
export const MAX_TEXT_RADIUS = 100

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
 * The valid range is defined by MIN_TEXT_RADIUS and MAX_TEXT_RADIUS constants.
 *
 * @param radius - The radius value to check
 * @return boolean - True if the radius is valid, false otherwise
 * @see MIN_TEXT_RADIUS
 * @see MAX_TEXT_RADIUS
 */
function hasPath(radius: number): boolean {
  return (Math.abs(radius) >= MIN_TEXT_RADIUS && Math.abs(radius) <= MAX_TEXT_RADIUS);
}

/**
 * Creates a circular path for text to follow, based on the specified radius.
 * The path is centered at the origin (0, 0) and rotated 90 degrees to align with typical text orientation.
 * The path is defined using SVG path syntax, creating a full circle with the specified radius.
 * 
 * @param radius - The radius of the circular path
 */
function createCircularTextPath(radius: number) : Path {
  const absRadius = Math.abs(radius)
  if(hasPath(radius)) {
    // Create a circle path centered at origin (0, 0), rotated 90 degrees
    return new Path(
        `M 0 ${radius} 
        A ${absRadius} ${absRadius} 0 1 1 0  ${-radius} 
        A ${absRadius} ${absRadius} 0 1 1 0  ${radius} 
        Z`,
        { offset: { x: 0, y: radius }, fill: '', stroke: 'blue', strokeWidth: 1, strokeDashArray: [5, 5], visible: false }
      );
  } else {
    return undefined as unknown as Path; // Return undefined if radius is out of bounds, but cast to Path to satisfy return type
  }
}

/**
 * Sets the text radius for a CircularTextbox, which determines whether the text follows a circular path.
 * If the radius is within the valid range, the box's width is updated to match the circumference of the
 * circle and a circular path is created.
 * If the radius is out of bounds, the textbox reverts to normal text layout without a path.
 * The visibility of the resize control is also toggled based on whether the text is following a path,
 * as resizing doesn't make sense in that context.
 *
 * @param textbox - The CircularTextbox object to update
 * @param radius - The desired text radius, which determines the circular path
 */
export function setTextboxTextRadius(textbox: CircularTextbox, radius: number): void {
  const circumference = 2 * Math.PI * Math.abs(radius)
  textbox.set({
    width: hasPath(radius) ? circumference : textbox.width, // Update width based on whether text is on a path
    textRadius: radius,
    path: createCircularTextPath(radius),
    pathSide: radius >= 0 ? 'left' : 'right',
    pathStartOffset: 0,
  })
  textbox.controls.resize.visible = !hasPath(radius)
  textbox.setCoords()
}

/**
 * Returns the initial background URL for a given canvas side.
 * Uses the stored selection if present, otherwise falls back to hardcoded defaults
 * for the first two sides.
 */
export function getInitialBackgroundUrl(
  sides: Array<{ backgroundSelection: string | null } | undefined>,
  sideKey: number,
): string {
  const state = sides[sideKey]
  if (state?.backgroundSelection && state.backgroundSelection !== CUSTOM_BACKGROUND_ID) {
    return state.backgroundSelection
  }
  const defaults: string[] = [
    '/images/custom-design/t-shirt-front.png',
    '/images/custom-design/t-shirt-back.png',
  ]
  return defaults[sideKey] ?? ''
}

export function clearCanvasObjects(canvas: Canvas): void {
  canvas.remove(...canvas.getObjects())
}

export function clearLiveCanvas(canvas: Canvas, clearBackground = false): void {
  clearCanvasObjects(canvas)
  if (clearBackground) {
    canvas.backgroundImage = undefined
  }
  canvas.requestRenderAll()
}

/**
 * Resizes a Fabric canvas to new dimensions and rescales the background image to fill.
 * Lazy-loads useCanvasRescale so it stays out of the synchronous bundle (Lighthouse optimization).
 */
export async function rescaleCanvas(
  canvasInstance: Canvas,
  ratio: number,
  newWidth: number,
  newHeight: number,
): Promise<void> {
  canvasInstance.setDimensions({ width: newWidth, height: newHeight })
  const bg = canvasInstance.backgroundImage as FabricImage | undefined
  if (bg) {
    bg.scaleToWidth(newWidth)
    bg.scaleToHeight(newHeight)
    bg.set({ left: newWidth / 2, top: newHeight / 2 })
  }
  const { useCanvasRescale } = await import('~/composables/useCanvasRescale')
  const { rescaleObjects } = useCanvasRescale()
  rescaleObjects(canvasInstance, ratio)
  canvasInstance.requestRenderAll()
}