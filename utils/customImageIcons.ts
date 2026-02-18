import resizeIcon from '@/assets/images/custom-design/resize.svg?url'
import rotateIcon from '@/assets/images/custom-design/rotate.svg?url'
import trashCanIcon from '@/assets/images/custom-design/trash-can.svg?url'

// Create images on client side only to avoid SSR issues
const trashCanImage = typeof window !== 'undefined' ? new Image() : null
const resizeImage = typeof window !== 'undefined' ? new Image() : null
const rotateImage = typeof window !== 'undefined' ? new Image() : null

// Set image sources immediately on client
if (trashCanImage) trashCanImage.src = trashCanIcon
if (resizeImage) resizeImage.src = resizeIcon
if (rotateImage) rotateImage.src = rotateIcon

export function getTrashCanImage(): HTMLImageElement {
  return trashCanImage!
}

export function getResizeImage(): HTMLImageElement {
  return resizeImage!
}

export function getRotateImage(): HTMLImageElement {
  return rotateImage!
}