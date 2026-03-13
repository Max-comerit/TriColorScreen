// components/features/CtaSection.vue

<script setup lang="ts">
// ===== IMPORTS =====
import Section from '~/components/common/Section.vue'
<<<<<<< HEAD
import TextButton from '~/components/common/TextButton.vue'
import { TAP_ANIMATION_TIME } from '~/constants/ui'
=======
import LinkButton from '~/components/common/LinkButton.vue'
>>>>>>> b8e8702 (Created LinkButton in order to not nest a button in an <a> element. Increased contrast on some color combinations. Added aria attributes on some hidden inputs)

// ===== TYPES =====
interface Props {
  /** Heading text displayed in the CTA block */
  heading: string
  /** Body text displayed below the heading */
  text: string
}

// ===== PROPS & EMITS =====
defineProps<Props>()

// ===== COMPOSABLES =====
const router = useRouter()

// ===== METHODS =====
/**
 * Handle CTA button click with 100ms delay to show active state
 */
async function handleCtaClick(): Promise<void> {
  // Delay navigation TAP_ANIMATION_TIME ms to allow button :active state to complete
  await new Promise(resolve => setTimeout(resolve, TAP_ANIMATION_TIME))
  await router.push('/contact')
}
</script>

<template>
  <Section
    id="contact-cta"
    aria-label="Kontakta oss"
    background-color="bg-primary-700"
    text-color="text-white"
    align="center"
    class="px-4 md:px-8 lg:px-16 rounded-card"
  >
    <div class="space-y-4 text-center">
      <h2 class="font-display text-white">
        {{ heading }}
      </h2>
      <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
        {{ text }}
      </p>
      <div class="flex flex-wrap justify-center gap-4 pt-2">
        <TextButton class="border outline-visible-spaced-button focus-visible:outline-neutral-950" @click="handleCtaClick">Kontakta Oss</TextButton>
      </div>
    </div>
  </Section>
</template>
