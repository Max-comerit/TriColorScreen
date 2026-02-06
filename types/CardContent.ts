/**
 * Card Types
 *
 * @description Enumeration of card types supported by the CardGrid component.
 */

export enum CardType {
  Service = 'service',
  Review = 'review',
}

/**
 * Service Card Content Interface
 */
export interface IServiceCardContent {
  /** Image source URL for the service card */
  imageSrc: string
  /** Title text displayed on the service card */
  title: string
  /** Description text displayed below the title */
  description: string
  /** Alt text for the service card image */
  alt?: string
  /** Navigation link for the service card */
  link?: string
}

/**
 * Review Card Content Interface
 */
export interface IReviewCardContent {
  /** Review text content */
  review: string
  /** Name of the reviewer */
  name: string
  /** Date of the review */
  date: string
}

export type CardItem =
  | { type: 'service'; data: IServiceCardContent }
  | { type: 'review'; data: IReviewCardContent }