// components/features/CtaSection.vue

<script setup lang="ts">
// ===== IMPORTS =====
import Section from '~/components/common/Section.vue'
import TextButton from '~/components/common/TextButton.vue'

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
  // Delay navigation 100ms to allow button :active state to complete
  await new Promise(resolve => setTimeout(resolve, 100))
  await router.push('/contact')
}
</script>

<template>
  <Section
    id="contact-cta"
    aria-label="Kontakta oss"
    background-color="bg-primary-600"
    text-color="text-white"
    align="center"
    class="px-4 md:px-8 lg:px-16 rounded-card"
  >
    <div class="space-y-4 text-center">
      <h2 class="font-display text-white" style="user-select: none; -webkit-user-drag: none;">
        {{ heading }}
      </h2>
      <p class="mx-auto max-w-xl leading-relaxed text-primary-100" style="user-select: none; -webkit-user-drag: none;">
        {{ text }}
      </p>
      <div class="flex flex-wrap justify-center gap-4 pt-2">
        <TextButton class="border" @click="handleCtaClick">Kontakta Oss</TextButton>
      </div>
    </div>
  </Section>
</template>
