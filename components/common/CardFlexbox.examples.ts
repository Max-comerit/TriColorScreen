/**
 * CardFlexbox Component Examples
 *
 * @description Usage examples for the CardFlexbox component
 * demonstrating responsive row and column layouts with customizable
 * alignment, widths, and gaps.
 */

/**
 * Example: Service cards with default layout
 * @note Basic horizontal layout with cards wrapping on mobile
 */
export const ServiceCardFlexboxExample = `
<CardFlexbox
  :card-content-arr="serviceCards"
  :gap="24"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with default layout
 * @note Basic horizontal layout with cards wrapping on mobile
 */
export const ReviewCardFlexboxExample = `
<CardFlexbox
  :card-content-arr="reviewCards"
  :gap="24"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards with custom max width
 * @note Demonstrates :max-item-width prop for wider cards on desktop
 */
export const ServiceCardFlexboxCustomWidthExample = `
<CardFlexbox
  :card-content-arr="serviceCards"
  :gap="24"
  :max-item-width="400"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with vertical layout
 * @note Demonstrates direction="column" for full-width vertical stacking
 */
export const ReviewCardFlexboxVerticalExample = `
<CardFlexbox
  :card-content-arr="reviewCards"
  direction="column"
  :gap="24"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards centered on row
 * @note Demonstrates justify-content="center" for center alignment
 */
export const ServiceCardFlexboxCenteredExample = `
<CardFlexbox
  :card-content-arr="serviceCards"
  :gap="24"
  justify-content="center"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with space between layout
 * @note Demonstrates justify-content="space-between" for distributed alignment
 */
export const ReviewCardFlexboxSpaceBetweenExample = `
<CardFlexbox
  :card-content-arr="reviewCards"
  :gap="24"
  justify-content="space-between"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards with space around layout
 * @note Demonstrates justify-content="space-around" for distributed alignment with edges
 */
export const ServiceCardFlexboxSpaceAroundExample = `
<CardFlexbox
  :card-content-arr="serviceCards"
  :gap="24"
  justify-content="space-around"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`
