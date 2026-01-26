<script setup lang="ts">
/**
 * ServiceCard Component
 *
 * A reusable card for displaying a service with image, title and description.
 */

interface Props {
  imageSrc: string
  title: string
  description: string
  width?: string | number
  height?: string | number
  backgroundColor?: string
  textColor?: string
  link?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 'auto',
  backgroundColor: 'bg-primary-50',
  textColor: 'black',
  link: '#',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const cardStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const textColorClass = computed(() => `text-${props.textColor}`)
</script>

<template>
  <NuxtLink :to="link">
  <article
    class="group flex flex-col overflow-hidden rounded-lg shadow-drop transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1 cursor-pointer"
    :class="backgroundColor"
    :style="cardStyle"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter.prevent="emit('click')"
    @keydown.space.prevent="emit('click')"
  >
    <!-- Image -->
    <div class="w-5/6 aspect-[4/3] overflow-hidden align-middle mx-auto mt-4 rounded-md bg-gray-200">
      <img
        :src="imageSrc"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col gap-2 p-5">
      <h3 :class="['text-lg font-semibold', textColorClass]">
        {{ title }}
      </h3>
      <p :class="['text-sm leading-relaxed', textColorClass]">
        {{ description }}
      </p>
    </div>
  </article>
  </NuxtLink>
</template>
