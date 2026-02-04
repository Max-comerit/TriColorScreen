/**
 * CardFlexbox Component Examples
 *
 * @description Usage examples for the CardFlexbox component
 * demonstrating responsive flexbox layout with wrap support.
 * The flexbox automatically adjusts rows based on available space.
 */

/**
 * Example: Service cards with imported data
 */
export const ServiceCardFlexboxExample = `
<CardFlexbox
  :card-content-arr="serviceCategories"
  :type="CardType.Service"
  :gap="24"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with imported data
 */
export const ReviewCardFlexboxExample = `
<CardFlexbox
  :card-content-arr="reviews"
  :type="CardType.Review"
  :gap="24"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards with custom max width
 */
export const ServiceCardFlexboxCustomWidthExample = `
<CardFlexbox
  :card-content-arr="serviceCategories"
  :type="CardType.Service"
  :gap="24"
  :max-item-width="400"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with vertical layout
 */
export const ReviewCardFlexboxVerticalExample = `
<CardFlexbox
  :card-content-arr="reviews"
  :type="CardType.Review"
  direction="column"
  :gap="24"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards centered on row
 */
export const ServiceCardFlexboxCenteredExample = `
<CardFlexbox
  :card-content-arr="serviceCategories"
  :type="CardType.Service"
  :gap="24"
  justify-content="center"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`

/**
 * Example: Review cards with space between layout
 */
export const ReviewCardFlexboxSpaceBetweenExample = `
<CardFlexbox
  :card-content-arr="reviews"
  :type="CardType.Review"
  :gap="24"
  justify-content="space-between"
  aria-label="Kundrecensioner"
  section-id="reviews"
  class="py-4"
/>
`

/**
 * Example: Service cards with space around layout
 */
export const ServiceCardFlexboxSpaceAroundExample = `
<CardFlexbox
  :card-content-arr="serviceCategories"
  :type="CardType.Service"
  :gap="24"
  justify-content="space-around"
  aria-label="Tjänstekategorier"
  section-id="services"
  class="py-4"
/>
`
