/**
 * Card Interfaces
 *
 * Interfaces for card components used throughout the application.
 */

/** ServiceCard component props interface */
export interface IServiceCard {
  /** Image source URL for the service card */
  imageSrc: string
  /** Title text displayed on the card */
  title: string
  /** Description text displayed below the title */
  description: string
  /** Width of the card (CSS value or pixel number) */
  width?: string | number
  /** Height of the card (CSS value or pixel number) */
  height?: string | number
  /** Tailwind background color class */
  backgroundColor?: string
  /** Text color for title and description */
  textColor?: string
  /** Navigation link for the card */
  link?: string
  /** Alt text for the card image */
  alt?: string
}
