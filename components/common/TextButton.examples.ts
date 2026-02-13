/**
 * TextButton Component Examples
 *
 * @description Usage examples for the TextButton component
 * demonstrating various props and slot configurations
 */

/**
 * Example 1: Basic usage with label prop
 */
export const basicExample = `
<TextButton label="Click Me" />
`

/**
 * Example 2: Using default slot instead of label prop
 */
export const slotExample = `
<TextButton>
  Click Me
</TextButton>
`

/**
 * Example 3: Rich content with slot (bold text)
 */
export const richContentExample = `
<TextButton>
  <strong>Important</strong> Action
</TextButton>
`

/**
 * Example 4: Icon with text using slot
 */
export const iconExample = `
<TextButton>
  <Icon name="check" class="mr-2" />
  Save Changes
</TextButton>
`

/**
 * Example 5: All variants
 */
export const variantsExample = `
<!-- Primary variant (default) -->
<TextButton label="Primary Button" variant="primary" />

<!-- Secondary variant -->
<TextButton label="Secondary Button" variant="secondary" />

<!-- Outline variant -->
<TextButton label="Outline Button" variant="outline" />

<!-- Text variant -->
<TextButton label="Text Button" variant="text" />
`

/**
 * Example 6: All sizes
 */
export const sizesExample = `
<!-- Small -->
<TextButton label="Small Button" size="sm" />

<!-- Medium (default) -->
<TextButton label="Medium Button" size="md" />

<!-- Large -->
<TextButton label="Large Button" size="lg" />
`

/**
 * Example 7: Disabled state
 */
export const disabledExample = `
<TextButton label="Disabled Button" :disabled="true" />
`

/**
 * Example 8: Busy state
 */
export const busyExample = `
<TextButton label="Save" :busy="isLoading" />
`

/**
 * Example 9: Custom background colors
 */
export const customColorsExample = `
<!-- Custom solid color -->
<TextButton 
  label="Custom Color"
  background-color="#ff6b6b"
  background-color-hover="#ee5a5a"
/>

<!-- Using CSS variables -->
<TextButton 
  label="Theme Color"
  background-color="var(--color-success)"
  background-color-hover="var(--color-success-dark)"
/>
`

/**
 * Example 10: Custom text color
 */
export const customTextColorExample = `
<TextButton 
  label="Custom Text Color"
  variant="outline"
  color="#ff6b6b"
/>
`

/**
 * Example 11: With click handler
 */
export const clickHandlerExample = `
<script setup lang="ts">
const handleClick = (event: MouseEvent) => {
  console.log('Button clicked!', event)
}
</script>

<template>
  <TextButton label="Click Me" @click="handleClick" />
</template>
`

/**
 * Example 12: Dynamic content in slot
 */
export const dynamicContentExample = `
<script setup lang="ts">
const itemCount = ref(5)
</script>

<template>
  <TextButton>
    Add to Cart ({{ itemCount }})
  </TextButton>
</template>
`

/**
 * Example 13: Multi-line content with slot
 */
export const multilineExample = `
<TextButton size="lg">
  <div class="flex flex-col items-center">
    <span class="text-xs">Save up to</span>
    <span class="text-lg font-bold">50%</span>
  </div>
</TextButton>
`

/**
 * Example 14: Combination of props
 */
export const combinationExample = `
<TextButton 
  variant="secondary"
  size="lg"
  background-color="#2563eb"
  background-color-hover="#1d4ed8"
  color="white"
  @click="handleSubmit"
>
  Submit Form
</TextButton>
`

/**
 * Example 15: Button group
 */
export const buttonGroupExample = `
<div class="flex gap-4">
  <TextButton label="Cancel" variant="outline" />
  <TextButton label="Save" variant="primary" />
</div>
`

/**
 * Example 16: Conditional busy state
 */
export const conditionalBusyExample = `
<script setup lang="ts">
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await submitForm()
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <TextButton 
    label="Submit"
    :busy="isSubmitting"
    @click="handleSubmit"
  />
</template>
`

/**
 * Example 17: Accessible button with ARIA attributes
 */
export const accessibleExample = `
<TextButton 
  label="Delete Account"
  variant="outline"
  aria-label="Delete your account permanently"
  aria-describedby="delete-warning"
  @click="confirmDelete"
/>
<p id="delete-warning" class="sr-only">
  This action cannot be undone
</p>
`

/**
 * Full component usage in a form
 */
export const formExample = `
<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
})

const isSubmitting = ref(false)
const isValid = computed(() => form.name && form.email)

const handleSubmit = async () => {
  if (!isValid.value) return
  
  isSubmitting.value = true
  try {
    await api.submitForm(form)
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  form.name = ''
  form.email = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Name" />
    <input v-model="form.email" placeholder="Email" />
    
    <div class="flex gap-4 mt-4">
      <TextButton 
        label="Reset"
        variant="outline"
        type="reset"
        @click="handleReset"
      />
      <TextButton 
        label="Submit"
        variant="primary"
        :disabled="!isValid"
        :busy="isSubmitting"
        type="submit"
      />
    </div>
  </form>
</template>
`
