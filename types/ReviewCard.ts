export interface IProps {
  /** Review text content */
  review: string
  /** Name of the reviewer */
  name: string
  /** Date of the review */
  date: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
}