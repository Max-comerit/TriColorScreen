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
      <h2 class="font-display text-white">{{ heading }}</h2>
      <p class="mx-auto max-w-xl leading-relaxed text-primary-100">
        {{ text }}
      </p>
      <div class="flex flex-wrap justify-center gap-4 pt-2">
        <NuxtLink to="/contact">
          <TextButton class="border">Kontakta oss</TextButton>
        </NuxtLink>
      </div>
    </div>
  </Section>
</template>
