import type { FabricObject } from 'fabric'
import { util } from 'fabric'

type ControlRender = (
	ctx: CanvasRenderingContext2D,
	left: number,
	top: number,
	_styleOverride: unknown,
	fabricObject: FabricObject
) => void

export function createTrashControlRender(icon: HTMLImageElement): ControlRender {
	return (ctx, left, top, _styleOverride, fabricObject) => {
		const size = 24

		ctx.save()
		ctx.translate(left, top)
		ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
		ctx.fillStyle = 'red'
		ctx.beginPath()
		ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
		ctx.fill()

		if (icon.complete) {
			ctx.drawImage(icon, -size / 2, -size / 2, size, size)
		}

		ctx.restore()
	}
}

export function createRotateControlRender(icon: HTMLImageElement): ControlRender {
	return (ctx, left, top, _styleOverride, fabricObject) => {
		const size = 24

		ctx.save()
		ctx.translate(left, top)
		ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
		ctx.fill()

		if (icon.complete) {
			ctx.drawImage(icon, -size / 2, -size / 2, size, size)
		}

		ctx.restore()
	}
}

export function createResizeControlRender(icon: HTMLImageElement): ControlRender {
	return (ctx, left, top, _styleOverride, fabricObject) => {
		const size = 24

		ctx.save()
		ctx.translate(left, top)
		ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
		ctx.fill()

		if (icon.complete) {
			ctx.rotate(util.degreesToRadians(45))
			ctx.drawImage(icon, -size / 2, -size / 2, size, size)
		}

		ctx.restore()
	}
}

export function createBringToFrontControlRender(icon: HTMLImageElement): ControlRender {
	return (ctx, left, top, _styleOverride, fabricObject) => {
		const size = 24

		ctx.save()
		ctx.translate(left, top)
		ctx.rotate(util.degreesToRadians(fabricObject.angle || 0))
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.arc(0, 0, (3 * size) / 4, 0, Math.PI * 2)
		ctx.fill()

		if (icon.complete) {
			ctx.drawImage(icon, -size / 2, -size / 2, size, size)
		}

		ctx.restore()
	}
}
