/**
 * CardGrid Component Examples
 *
 * @description Usage examples for the CardGrid component
 * demonstrating auto-responsive layout using CSS Grid auto-fill.
 * The grid automatically adjusts columns based on available space.
 */

/**
 * Example: Service cards with imported data
 */
export const ServiceCardGridExample = `
<CardGrid
  :data="serviceCategories"
  :type="CardType.Service"
  :min-item-width="280"
  :gap="24"
  aria-label="Tjänstekategorier"
  section-id="services"
/>
`

/**
 * Example: Review cards with imported data
 */
export const ReviewCardGridExample = `
<CardGrid
  :data="reviews"
  :type="CardType.Review"
  :min-item-width="320"
  :gap="32"
  aria-label="Kundrecensioner"
  section-id="reviews"
/>
`
