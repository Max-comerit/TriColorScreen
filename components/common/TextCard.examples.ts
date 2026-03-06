/**
 * TextCard Component Examples
 *
 * @description Usage examples for the TextCard component
 * demonstrating various props and configurations.
 */

/**
 * Example 1: Basic usage – title and description only
 */
export const basicExample = `
<TextCard
  title="Kvalitet i varje detalj"
  description="Vi kompromissar aldrig med kvaliteten. Varje order behandlas med omsorg från första kontakt till leverans."
/>
`

/**
 * Example 2: Centred alignment (e.g. values grid)
 */
export const centeredExample = `
<TextCard
  title="Personlig service"
  description="Vi lyssnar på dina behov och ger rådgivning som passar just ditt projekt och din budget."
  align="center"
  background-color="bg-gray-100"
/>
`

/**
 * Example 3: Step card with numeric prefix (e.g. process steps)
 */
export const stepExample = `
<TextCard
  prefix="01"
  prefix-color="text-primary-300"
  title="Budskap först"
  description="Det första vi frågar är: vad vill ni förmedla? Rätt budskap är grunden för all grafisk produktion."
/>
`

/**
 * Example 4: Icon/emoji prefix card
 */
export const iconPrefixExample = `
<TextCard
  prefix="🎯"
  prefix-color="text-neutral-900"
  title="Snabba leveranser"
  description="Vi vet att deadlines är viktiga. Med effektiva processer levererar vi i tid – varje gång."
  align="center"
  background-color="bg-primary-50"
/>
`

/**
 * Example 5: Rendered in a grid using v-for
 */
export const gridExample = `
<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
  <li v-for="value in values" :key="value.title">
    <TextCard
      :title="value.title"
      :description="value.description"
      align="center"
      background-color="bg-gray-100"
    />
  </li>
</ul>
`

/**
 * Example 6: Process steps in a 3-column grid
 */
export const processStepsExample = `
<ol class="grid gap-6 sm:grid-cols-3" role="list">
  <li v-for="step in steps" :key="step.number">
    <TextCard
      :prefix="step.number"
      :title="step.title"
      :description="step.description"
      prefix-color="text-primary-300"
      background-color="bg-white"
    />
  </li>
</ol>
`
