// composables/useCustomText.ts
import { Textbox, Control, controlsUtils, util } from 'fabric'
import {
  createResizeControlRender,
  createRotateControlRender,
  createTrashControlRender,
  createBringToFrontControlRender,
} from '@/utils/customControlRenders'
import { getResizeImage, getRotateImage, getTrashCanImage, getBringToFrontImage } from '@/utils/customImageIcons'
import { toggleObjectZOrder } from '@/utils/fabricZOrder'

interface FabricCanvasLike {
  add: (object: Textbox) => void
  centerObject: (object: Textbox) => void
  setActiveObject: (object: Textbox) => void
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
  width?: number
}

const DEFAULT_TEXT = 'Min text'
const DEFAULT_FONT_SIZE = 36
const DEFAULT_FONT_FAMILY = "'Inter', sans-serif"
const DEFAULT_FONT_WEIGHT = 600
const DEFAULT_FILL = '#111111'
const DEFAULT_TEXT_ALIGN: AddTextOptions['textAlign'] = 'center'
const DEFAULT_TEXT_WIDTH = 360

export function useCustomText() {
  /**
   * Adds a textbox to a Fabric canvas (accepts a Vue Ref<Canvas | null>).
   */
    function addTextToCanvas(canvas: FabricCanvasLike | null, options: AddTextOptions = {}): Textbox | null {
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
      borderColor: 'blue',
      borderScaleFactor: 1,
      borderDashArray: [5, 5],
      editable: true,
      controls: {
        bringToFrontIcon: new Control({
          x: -0.5,
          y: -0.5,
          offsetX: -12,
          offsetY: -12,
          sizeX: 36,
          sizeY: 36,
          cursorStyle: 'pointer',
          render: createBringToFrontControlRender(getBringToFrontImage()),
          mouseUpHandler: (eventData, transform) => {
            const target = transform?.target
            if (target && target.canvas) {
              toggleObjectZOrder(target, target.canvas)
            }
          }
        }),
        scaleIcon: new Control({
          x: 0.5,
          y: 0.5,
          offsetX: 12,
          offsetY: 12,
          sizeX: 36,
          sizeY: 36,
          render: createResizeControlRender(getResizeImage()),
          cursorStyle: 'nwse-resize',
          actionHandler: controlsUtils.scalingEqually,
        }),
        deleteIcon: new Control({
          x: 0.5,
          y: -0.5,
          offsetX: 12,
          offsetY: -12,
          sizeX: 36,
          sizeY: 36,
          cursorStyle: 'pointer',
          render: createTrashControlRender(getTrashCanImage()),
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
          cursorStyle: 'grab',
          render: createRotateControlRender(getRotateImage()),
          withConnection: true,
          actionHandler: controlsUtils.rotationWithSnapping,
        }),
        resize: new Control({
          x: -0.5,
          y: 0.5,
          cursorStyle: 'ew-resize',
          offsetX: -12,
          offsetY: 12,
          sizeX: 36,
          sizeY: 36,
          render: (ctx, left, top, _styleOverride, fabricObject) => {
            const size = 24
            const img = getResizeImage()
            ctx.save()
                ctx.translate(left, top)
                ctx.fillStyle = 'white'
                ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
                ctx.beginPath()
                ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
                ctx.fill()

                if (img.complete) {
                  ctx.drawImage(img, -size / 2, -size / 2, size, size)
                }

            ctx.restore()

          },
          withConnection: true,
          actionHandler: controlsUtils.changeObjectWidth,
        }),
        
    }})

    

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
