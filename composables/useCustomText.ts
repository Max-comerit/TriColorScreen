// composables/useCustomText.ts
import { Textbox, Control, controlsUtils } from 'fabric'
import type { Canvas } from 'fabric'

export interface AddTextOptions {
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: number | string
  fill?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  width?: number
}

const DEFAULT_TEXT = 'Min text'
const DEFAULT_FONT_SIZE = 36
const DEFAULT_FONT_FAMILY = 'sans-serif'
const DEFAULT_FONT_WEIGHT = 600
const DEFAULT_FILL = '#111111'
const DEFAULT_TEXT_ALIGN: AddTextOptions['textAlign'] = 'center'
const DEFAULT_TEXT_WIDTH = 360

export function useCustomText() {
  /**
   * Adds a textbox to a Fabric canvas (accepts a Vue Ref<Canvas | null>).
   */
    function addTextToCanvas(canvas: Canvas | null, options: AddTextOptions = {}): Textbox | null {
    if (!canvas) return null

    const text = options.text ?? DEFAULT_TEXT
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE
    const fontFamily = options.fontFamily ?? DEFAULT_FONT_FAMILY
    const fontWeight = options.fontWeight ?? DEFAULT_FONT_WEIGHT
    const fill = options.fill ?? DEFAULT_FILL
    const textAlign = options.textAlign ?? DEFAULT_TEXT_ALIGN
    const width = options.width ?? Math.min(DEFAULT_TEXT_WIDTH, canvas.getWidth() * 0.8)

    const textbox = new Textbox(text, {
      width,
      fontSize,
      fontFamily,
      fontWeight,
      fill,
      textAlign,
      editable: true,
      controls: {
        scaleIcon: new Control({
          x: 0.5,
          y: 0.5,
          render: (ctx, left, top) => {
          const size = 24
          const img = new Image()
          img.src = '/images/custom-design/zoom.svg'
          ctx.drawImage(img, left - size / 2, top - size / 2, size, size)
          },
          cursorStyle: 'nwse-resize',
          actionHandler: controlsUtils.scalingEqually,
        }),
        deleteIcon: new Control({
          x: 0.5,
          y: -0.5,
          cursorStyle: 'pointer',
          render: (ctx, left, top) => {
            const size = 24
            const img = new Image()
            img.src = '/images/custom-design/trash-can.svg'
            ctx.drawImage(img, left - size / 2, top - size / 2, size, size)
          },
          mouseUpHandler: (eventData, transform) => {          
            const target = transform?.target
            if (target) {
              const canvas = target.canvas
              canvas?.remove(target)
              canvas?.requestRenderAll()
            }
          }
        }),
        rotateIcon: new Control({
          x: 0,
          y: -0.5,
          offsetY: -50,
          cursorStyle: 'pointer',
          render: (ctx, left, top) => {
            const size = 24
            const img = new Image()
            img.src = '/images/custom-design/rotate.svg'
            ctx.drawImage(img, left - size / 2, top - size / 2, size, size)
          },
          withConnection: true,
          actionHandler: controlsUtils.rotationWithSnapping,
        }),
    }})

    canvas.add(textbox)
    canvas.centerObject(textbox)
    canvas.setActiveObject(textbox)
    canvas.requestRenderAll()

    setTimeout(() => {
      if (textbox.enterEditing) {
        textbox.enterEditing()
        textbox.selectAll()
        canvas.requestRenderAll()
      }
    }, 0)

    return textbox
  }

  return {
    addTextToCanvas,
  }
}
