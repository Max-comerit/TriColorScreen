/**
 * IconButton Component Examples
 *
 * @description Usage examples for the IconButton component
 * demonstrating various props and slot configurations with actual project icons.
 * Copy the /assets folder to the /public folder before running the project 
 * to ensure that icons load correctly.
 */

/**
 * Example 1: Basic usage with iconSrc prop
 */
export const basicExample = `
<IconButton 
  icon-src="/favicon.ico"
  icon-alt="Favorite"
  aria-label="Add to favorites"
/>
`

/**
 * Example 2: Social media icons
 */
export const socialMediaExample = `
<!-- Facebook -->
<IconButton 
  icon-src="/assets/images/footer/facebook-icon.svg"
  icon-alt="Facebook"
  aria-label="Visit our Facebook page"
/>

<!-- Instagram -->
<IconButton 
  icon-src="/assets/images/footer/instagram-icon.svg"
  icon-alt="Instagram"
  aria-label="Visit our Instagram page"
/>

<!-- LinkedIn -->
<IconButton 
  icon-src="/assets/images/footer/linkedin-icon.svg"
  icon-alt="LinkedIn"
  aria-label="Visit our LinkedIn page"
/>
`

/**
 * Example 3: Contact action icons
 */
export const contactActionsExample = `
<!-- Email -->
<IconButton 
  icon-src="/assets/images/footer/email-icon.svg"
  icon-alt="Email"
  aria-label="Send us an email"
/>

<!-- Phone -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Phone"
  aria-label="Call us"
/>

<!-- Location -->
<IconButton 
  icon-src="/assets/images/footer/map-marker.svg"
  icon-alt="Location"
  aria-label="View our location on map"
/>
`

/**
 * Example 4: All variants with same icon
 */
export const variantsExample = `
<!-- Primary variant (default) -->
<IconButton 
  icon-src="/favicon.ico"
  icon-alt="Icon"
  aria-label="Primary action"
  variant="primary"
/>

<!-- Secondary variant -->
<IconButton 
  icon-src="/favicon.ico"
  icon-alt="Icon"
  aria-label="Secondary action"
  variant="secondary"
/>

<!-- Outline variant -->
<IconButton 
  icon-src="/favicon.ico"
  icon-alt="Icon"
  aria-label="Outline action"
  variant="outline"
/>

<!-- Text variant -->
<IconButton 
  icon-src="/favicon.ico"
  icon-alt="Icon"
  aria-label="Text action"
  variant="text"
/>
`

/**
 * Example 5: All sizes
 */
export const sizesExample = `
<!-- Small -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Phone"
  aria-label="Call us"
  size="sm"
/>

<!-- Medium (default) -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Phone"
  aria-label="Call us"
  size="md"
/>

<!-- Large -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Phone"
  aria-label="Call us"
  size="lg"
/>

<!-- Fit (wraps content with padding) -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Phone"
  aria-label="Call us"
  size="fit"
/>
`

/**
 * Example 6: Disabled state
 */
export const disabledExample = `
<IconButton 
  icon-src="/assets/images/footer/email-icon.svg"
  icon-alt="Email"
  aria-label="Send email"
  :disabled="true"
/>
`

/**
 * Example 7: Loading state
 */
export const loadingExample = `
<script setup lang="ts">
const isSending = ref(false)
</script>

<template>
  <IconButton 
    icon-src="/assets/images/footer/email-icon.svg"
    icon-alt="Email"
    aria-label="Send email"
    :busy="isSending"
  />
</template>
`

/**
 * Example 8: Custom background colors
 */
export const customColorsExample = `
<!-- Custom red background -->
<IconButton 
  icon-src="/assets/images/footer/phone-icon.svg"
  icon-alt="Emergency call"
  aria-label="Emergency call"
  background-color="#ef4444"
  background-color-hover="#dc2626"
/>

<!-- Custom green background -->
<IconButton 
  icon-src="/assets/images/footer/email-icon.svg"
  icon-alt="Email"
  aria-label="Send email"
  background-color="#10b981"
  background-color-hover="#059669"
/>

<!-- Custom purple background -->
<IconButton 
  icon-src="/assets/images/footer/map-marker.svg"
  icon-alt="Location"
  aria-label="View location"
  background-color="#8b5cf6"
  background-color-hover="#7c3aed"
/>
`

/**
 * Example 9: Custom icon color
 */
export const customIconColorExample = `
<IconButton 
  icon-src="/assets/images/footer/facebook-icon.svg"
  icon-alt="Facebook"
  aria-label="Visit Facebook"
  variant="outline"
  color="#1877f2"
/>
`

/**
 * Example 10: With click handler
 */
export const clickHandlerExample = `
<script setup lang="ts">
const handleEmailClick = () => {
  window.location.href = 'mailto:info@tricolorscreen.se'
}

const handlePhoneClick = () => {
  window.location.href = 'tel:+46123456789'
}

const handleMapClick = () => {
  window.open('https://maps.google.com/?q=Your+Address', '_blank')
}
</script>

<template>
  <IconButton 
    icon-src="/assets/images/footer/email-icon.svg"
    icon-alt="Email"
    aria-label="Send us an email"
    @click="handleEmailClick"
  />

  <IconButton 
    icon-src="/assets/images/footer/phone-icon.svg"
    icon-alt="Phone"
    aria-label="Call us"
    @click="handlePhoneClick"
  />

  <IconButton 
    icon-src="/assets/images/footer/map-marker.svg"
    icon-alt="Location"
    aria-label="View our location"
    @click="handleMapClick"
  />
</template>
`

/**
 * Example 11: Using icon slot with SVG component
 */
export const iconSlotExample = `
<script setup lang="ts">
// Import your SVG component
import FacebookIcon from '~/assets/images/footer/facebook-icon.svg?component'
</script>

<template>
  <IconButton aria-label="Visit our Facebook page">
    <template #icon>
      <FacebookIcon />
    </template>
  </IconButton>
</template>
`

/**
 * Example 12: Social media button group
 */
export const socialMediaGroupExample = `
<div class="flex gap-2">
  <IconButton 
    icon-src="/assets/images/footer/facebook-icon.svg"
    icon-alt="Facebook"
    aria-label="Visit our Facebook page"
    variant="outline"
    @click="() => window.open('https://facebook.com/yourpage', '_blank')"
  />

  <IconButton 
    icon-src="/assets/images/footer/instagram-icon.svg"
    icon-alt="Instagram"
    aria-label="Visit our Instagram page"
    variant="outline"
    @click="() => window.open('https://instagram.com/yourpage', '_blank')"
  />

  <IconButton 
    icon-src="/assets/images/footer/linkedin-icon.svg"
    icon-alt="LinkedIn"
    aria-label="Visit our LinkedIn page"
    variant="outline"
    @click="() => window.open('https://linkedin.com/company/yourpage', '_blank')"
  />
</div>
`

/**
 * Example 13: Contact methods group
 */
export const contactMethodsExample = `
<div class="flex flex-col gap-2">
  <div class="flex items-center gap-3">
    <IconButton 
      icon-src="/assets/images/footer/phone-icon.svg"
      icon-alt="Phone"
      aria-label="Call us at 123-456-789"
      size="sm"
      variant="secondary"
    />
    <span>123-456-789</span>
  </div>

  <div class="flex items-center gap-3">
    <IconButton 
      icon-src="/assets/images/footer/email-icon.svg"
      icon-alt="Email"
      aria-label="Email us at info@example.com"
      size="sm"
      variant="secondary"
    />
    <span>info@example.com</span>
  </div>

  <div class="flex items-center gap-3">
    <IconButton 
      icon-src="/assets/images/footer/map-marker.svg"
      icon-alt="Location"
      aria-label="View our address"
      size="sm"
      variant="secondary"
    />
    <span>123 Main Street, City</span>
  </div>
</div>
`

/**
 * Example 14: Different sizes for different contexts
 */
export const contextSizesExample = `
<!-- Small for compact UI -->
<nav class="flex gap-2">
  <IconButton 
    icon-src="/assets/images/footer/facebook-icon.svg"
    icon-alt="Facebook"
    aria-label="Facebook"
    size="sm"
    variant="text"
  />
  <IconButton 
    icon-src="/assets/images/footer/instagram-icon.svg"
    icon-alt="Instagram"
    aria-label="Instagram"
    size="sm"
    variant="text"
  />
</nav>

<!-- Medium for general use -->
<div class="flex gap-3">
  <IconButton 
    icon-src="/assets/images/footer/phone-icon.svg"
    icon-alt="Phone"
    aria-label="Call us"
    size="md"
  />
  <IconButton 
    icon-src="/assets/images/footer/email-icon.svg"
    icon-alt="Email"
    aria-label="Email us"
    size="md"
  />
</div>

<!-- Large for hero sections -->
<div class="flex gap-4">
  <IconButton 
    icon-src="/assets/images/footer/phone-icon.svg"
    icon-alt="Phone"
    aria-label="Call us now"
    size="lg"
    variant="primary"
  />
</div>
`

/**
 * Example 15: Responsive button group with all variants and sizes
 */
export const fullMatrixExample = `
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div>
    <h3 class="text-lg font-medium mb-3">Primary</h3>
    <div class="flex flex-col gap-2">
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Small primary"
        variant="primary"
        size="sm"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Medium primary"
        variant="primary"
        size="md"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Large primary"
        variant="primary"
        size="lg"
      />
    </div>
  </div>

  <div>
    <h3 class="text-lg font-medium mb-3">Secondary</h3>
    <div class="flex flex-col gap-2">
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Small secondary"
        variant="secondary"
        size="sm"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Medium secondary"
        variant="secondary"
        size="md"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Large secondary"
        variant="secondary"
        size="lg"
      />
    </div>
  </div>

  <div>
    <h3 class="text-lg font-medium mb-3">Outline</h3>
    <div class="flex flex-col gap-2">
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Small outline"
        variant="outline"
        size="sm"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Medium outline"
        variant="outline"
        size="md"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Large outline"
        variant="outline"
        size="lg"
      />
    </div>
  </div>

  <div>
    <h3 class="text-lg font-medium mb-3">Text</h3>
    <div class="flex flex-col gap-2">
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Small text"
        variant="text"
        size="sm"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Medium text"
        variant="text"
        size="md"
      />
      <IconButton 
        icon-src="/favicon.ico"
        icon-alt="Icon"
        aria-label="Large text"
        variant="text"
        size="lg"
      />
    </div>
  </div>
</div>
`

/**
 * Example 16: Async action with loading state
 */
export const asyncActionExample = `
<script setup lang="ts">
const isSending = ref(false)

const sendEmail = async () => {
  isSending.value = true
  try {
    await api.sendContactEmail()
    alert('Email sent successfully!')
  } catch (error) {
    alert('Failed to send email')
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <IconButton 
    icon-src="/assets/images/footer/email-icon.svg"
    icon-alt="Email"
    aria-label="Send contact email"
    :busy="isSending"
    @click="sendEmail"
  />
</template>
`

/**
 * Example 17: Footer with social media icons
 */
export const footerExample = `
<footer class="bg-neutral-900 text-white py-8">
  <div class="container mx-auto">
    <!-- Social Media Links -->
    <div class="flex justify-center gap-4 mb-6">
      <IconButton 
        icon-src="/assets/images/footer/facebook-icon.svg"
        icon-alt="Facebook"
        aria-label="Follow us on Facebook"
        variant="text"
        color="white"
        @click="() => window.open('https://facebook.com', '_blank')"
      />
      <IconButton 
        icon-src="/assets/images/footer/instagram-icon.svg"
        icon-alt="Instagram"
        aria-label="Follow us on Instagram"
        variant="text"
        color="white"
        @click="() => window.open('https://instagram.com', '_blank')"
      />
      <IconButton 
        icon-src="/assets/images/footer/linkedin-icon.svg"
        icon-alt="LinkedIn"
        aria-label="Connect with us on LinkedIn"
        variant="text"
        color="white"
        @click="() => window.open('https://linkedin.com', '_blank')"
      />
    </div>

    <!-- Contact Information -->
    <div class="flex flex-wrap justify-center gap-6">
      <IconButton 
        icon-src="/assets/images/footer/phone-icon.svg"
        icon-alt="Phone"
        aria-label="Call us"
        variant="text"
        color="white"
        @click="() => window.location.href = 'tel:+46123456789'"
      />
      <IconButton 
        icon-src="/assets/images/footer/email-icon.svg"
        icon-alt="Email"
        aria-label="Email us"
        variant="text"
        color="white"
        @click="() => window.location.href = 'mailto:info@example.com'"
      />
      <IconButton 
        icon-src="/assets/images/footer/map-marker.svg"
        icon-alt="Location"
        aria-label="View location"
        variant="text"
        color="white"
        @click="() => window.open('https://maps.google.com', '_blank')"
      />
    </div>
  </div>
</footer>
`
