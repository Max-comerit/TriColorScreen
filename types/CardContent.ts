
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
  /** Maximum number of lines to display in description - default: 3 */
  maxLines?: number
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

/**
 * Image Card Content Interface
 */
export interface IImageCardContent {
  /** Image source URL for the image card */
  imageSrc: string
  /** Alt text for the image card */
  alt?: string
}

/**
 * Text Card Content Interface
 */
export interface ITextCardContent {
  /** Card heading */
  title: string
  /** Descriptive body text */
  description?: string
  /** Optional prefix displayed above the title – e.g. an emoji or a step number */
  prefix?: string
  /** Tailwind text-color class applied to the prefix */
  prefixColor?: string
  /** Text alignment for title and description */
  align?: 'left' | 'center'
  /** Tailwind background-color class */
  backgroundColor?: string
}

export type CardItem =
  | { type: 'service'; data: IServiceCardContent }
  | { type: 'review'; data: IReviewCardContent }
  | { type: 'image'; data: IImageCardContent }
  | { type: 'text'; data: ITextCardContent }

/**
 * Horizontal Card Content Interface
 */
export interface IHorizontalCardContent {
  /** Title text displayed on the horizontal card */
  title: string
  /** Image source URL for the horizontal card */
  imageSrc: string
  /** Description text on the horizontal card */
  description: string
  /** Maximum number of lines to display in description - default: 4 */
  maxLines?: number
  /** Alt text for the horizontal card image */
  alt?: string
  /** Navigation link for the horizontal card */
  link?: string
}