/**
 * HeroImage component props definition
 * 
 * This file defines the TypeScript types for the props used in the HeroImage component.  
 */

/**
 * Type definition for video sources used in the HeroImage component. Each video source includes a `src` for the video file and a `type` indicating the MIME type of the video (e.g., 'video/webm' or 'video/mp4').
 * This allows the HeroImage component to support multiple video formats for better browser compatibility, with WebM as the primary format and MP4 as a fallback.
 * Example usage:
 * <HeroImage 
 *   src="/images/hero.jpg"
 *   :video-sources="[ 
 *    { src: '/videos/hero.webm', type: 'video/webm' },
 *    { src: '/videos/hero.mp4', type: 'video/mp4' }
 *   ]"
 *   title="Hero Title"
 *   description="Hero description text."
 * />
 */

export type VideoSource = {
  src: string
  type: string
}