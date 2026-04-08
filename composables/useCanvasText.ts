// composables/useCanvasText.ts

import type { Textbox } from 'fabric'

import { setTextboxTextRadius } from '~/utils/canvasUtils'
import { CircularTextbox } from '~/utils/canvasCircularTextbox'
import { useCanvasControls } from '~/composables/useCanvasControls'

interface FabricCanvasLike {
  add: (object: CircularTextbox) => void
  centerObject: (object: CircularTextbox) => void
  setActiveObject: (object: CircularTextbox) => void
  requestRenderAll: () => void
  getWidth: () => number
}

export interface AddTextOptions {
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: number | string
  fill?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textRadius?: number
  width?: number
}

const DEFAULT_TEXT = 'Min text'
const DEFAULT_FONT_SIZE = 36
const DEFAULT_FONT_FAMILY = "'Inter', sans-serif"
const DEFAULT_FONT_WEIGHT = 400
const DEFAULT_FILL = '#111111'
const DEFAULT_TEXT_ALIGN: AddTextOptions['textAlign'] = 'center'
const DEFAULT_TEXT_RADIUS = 0
const DEFAULT_TEXT_WIDTH = 360

export function useCanvasText() {
  const { applyTextboxControls } = useCanvasControls()

  /**
   * Adds a textbox to a Fabric canvas (accepts a Vue Ref<Canvas | null>).
   */
  function addTextToCanvas(canvas: FabricCanvasLike | null, options: AddTextOptions = {}): CircularTextbox | null {
    if (!canvas) return null

    const text = options.text ?? DEFAULT_TEXT
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE
    const fontFamily = options.fontFamily ?? DEFAULT_FONT_FAMILY
    const fontWeight = options.fontWeight ?? DEFAULT_FONT_WEIGHT
    const fill = options.fill ?? DEFAULT_FILL
    const textAlign = options.textAlign ?? DEFAULT_TEXT_ALIGN
    const textRadius = options.textRadius ?? DEFAULT_TEXT_RADIUS;
    const width = options.width ?? Math.min(DEFAULT_TEXT_WIDTH, canvas.getWidth() * 0.8)

    const textbox = new CircularTextbox(text, {
      width,
      fontSize,
      fontFamily,
      fontWeight,
      fill,
      textAlign,
      borderColor: 'blue',
      borderScaleFactor: 1,
      borderDashArray: [5, 5],
    })

    // Cast to Textbox: CircularTextbox.toObject uses @ts-expect-error for Fabric's generic
    // constraint — at runtime CircularTextbox is always a valid Textbox.
    applyTextboxControls(textbox as unknown as Textbox)
    setTextboxTextRadius(textbox, textRadius)

    canvas.add(textbox)
    canvas.centerObject(textbox)
    canvas.setActiveObject(textbox)
    canvas.requestRenderAll()

    return textbox
  }

  return {
    addTextToCanvas,
  }
}
