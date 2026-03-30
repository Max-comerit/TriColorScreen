/**
 * Custom design utilities for Fabric.js objects, including z-order toggling and circular text path creation.
 * 
 * This module provides functions to manipulate the z-order of Fabric objects and to set a circular text path for Textbox objects based on a specified radius. The circular path is created using SVG path syntax and is centered at the origin. The module also includes a function to check if the radius value is within a valid range for creating a circular path.
 */
import type { FabricObject, Canvas, FabricImage } from 'fabric'
import type { CircularTextbox } from './circularTextbox'
import { Path, Point } from 'fabric'

// Valid range for text radius to create a circular path
export const MIN_TEXT_RADIUS = 25
export const MAX_TEXT_RADIUS = 3000

const BASELINE_PATH_OFFSET_Y = -10
const ASCENDER_PATH_OFFSET_Y = 18

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
function getCircularTextPathAlign(radius: number): 'baseline' | 'center' | 'ascender' | 'descender' {
  // Upward warps need the path to sit above the glyphs instead of below them,
  // otherwise the letters collapse into the inside of the arc too quickly.
  return radius < 0 ? 'ascender' : 'baseline'
}

function getCircularTextPathOffset(radius: number, pathAlign: 'baseline' | 'center' | 'ascender' | 'descender'): Point {
  const offsetY = pathAlign === 'ascender'
    ? -radius + ASCENDER_PATH_OFFSET_Y
    : -radius + BASELINE_PATH_OFFSET_Y

  return new Point(0, offsetY)
}

function createCircularTextPath(radius: number, pathAlign: 'baseline' | 'center' | 'ascender' | 'descender') : Path {
  const absRadius = Math.abs(radius)
  if(hasPath(radius)) {
    // Create a circle path centered at origin (0, 0), rotated 90 degrees
    const path = new Path(
        `M 0 ${radius} 
        A ${absRadius} ${absRadius} 0 1 1 0  ${-radius} 
        A ${absRadius} ${absRadius} 0 1 1 0  ${radius} 
        Z`,
        { fill: '', stroke: 'blue', strokeWidth: 1, strokeDashArray: [5, 5], visible: false }
      );
    // Anchor the text path to the tangent point instead of the circle center.
    // This keeps the curved text closer to the original text position.
    path.pathOffset = getCircularTextPathOffset(radius, pathAlign)
    return path
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
  const center = textbox.getCenterPoint()
  const nextHasPath = hasPath(radius)
  const currentHasPath = hasPath(textbox.textRadius)
  const pathAlign = getCircularTextPathAlign(radius)

  if (!textbox.baseWidth || textbox.baseWidth <= 0) {
    textbox.baseWidth = textbox.width
  }

  if (!currentHasPath) {
    textbox.baseWidth = textbox.width
  }

  textbox.set({
    width: textbox.baseWidth,
    textRadius: radius,
    path: nextHasPath ? createCircularTextPath(radius, pathAlign) : undefined,
    pathSide: radius >= 0 ? 'left' : 'right',
    pathAlign,
    pathStartOffset: 0,
    objectCaching: !nextHasPath,
  })

  if (!nextHasPath) {
    textbox.set('width', textbox.baseWidth)
  }

  textbox.initDimensions()
  textbox.controls.resize.visible = !nextHasPath
  textbox.setPositionByOrigin(center, 'center', 'center')
  textbox.setCoords()
}

export function clearCanvasObjects(canvas: Canvas): void {
  canvas.remove(...canvas.getObjects())
}

export function clearCanvas(canvas: Canvas, clearBackground = false): void {
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