/**
 * CardGrid Component Examples
 *
 * @description Usage examples for the CardGrid component
 * demonstrating auto-responsive layout using CSS Grid auto-fill.
 * The grid automatically adjusts columns based on available space.
 */

/**
 * Example: Service cards with plain HTML
 */
export const ServiceCardGridExample = `
<CardGrid
  src="/data/index/service-categories.json"
  type="service"
  :min-item-width="280"
  :gap="24"
  aria-label="Tjänstekategorier"
  section-id="services"
/>
`

/**
 * Example: Review cards with plain HTML
 */
export const ReviewCardGridExample = `
<CardGrid
  src="/data/index/reviews.json"
  type="review"
  :min-item-width="320"
  :gap="32"
  aria-label="Kundrecensioner"
  section-id="reviews"
/>
`
