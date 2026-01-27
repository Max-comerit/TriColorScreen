/**
 * HeroImage Component Examples
 *
 * @description Usage examples for the HeroImage component
 * demonstrating various props and configurations for page headers.
 */

/**
 * Example 1: Basic usage with required props
 */
export const basicExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Welcome to TriColor Screen"
  description="Professional screen printing services in Stockholm"
  alt="Team working on screen printing project in our studio"
/>
`

/**
 * Example 2: With custom dimensions (3:2 aspect ratio)
 */
export const customDimensionsExample = `
<!-- High resolution -->
<HeroImage 
  src="/images/index/hero.png"
  title="High Resolution Hero"
  description="Optimized for large screens"
  :width="1280"
  :height="854"
  alt="High resolution banner image"
/>

<!-- Medium resolution -->
<HeroImage 
  src="/images/index/hero.png"
  title="Standard Resolution"
  description="Balanced quality and performance"
  :width="1200"
  :height="800"
  alt="Standard resolution banner image"
/>

<!-- Compact resolution -->
<HeroImage 
  src="/images/index/hero.png"
  title="Compact Hero"
  description="Optimized for faster loading"
  :width="960"
  :height="640"
  alt="Compact banner image"
/>
`

/**
 * Example 3: Different text content lengths
 */
export const contentVariationsExample = `
<!-- Short content -->
<HeroImage 
  src="/images/index/hero.png"
  title="Short Title"
  description="Brief description"
  alt="Hero banner with short text"
/>

<!-- Long content -->
<HeroImage 
  src="/images/index/hero.png"
  title="Professional Screen Printing Services in Stockholm"
  description="We provide high-quality screen printing solutions for businesses and individuals throughout Sweden"
  alt="Hero banner with longer descriptive text"
/>

<!-- Very detailed content -->
<HeroImage 
  src="/images/index/hero.png"
  title="Custom Design & Premium Quality"
  description="From concept to completion, we handle every step of your screen printing project with care and expertise"
  alt="Hero banner showcasing custom design services"
/>
`

/**
 * Example 4: Home page hero
 */
export const homePageExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="TriColor Screen"
  description="Stockholms ledande företag för screentryck och design"
  :width="1280"
  :height="854"
  alt="TriColor Screen studio showing screen printing equipment and workspace"
/>
`

/**
 * Example 5: Services page hero
 */
export const servicesPageExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Våra Tjänster"
  description="Professionellt screentryck för alla behov - från t-shirts till textilier"
  :width="1280"
  :height="854"
  alt="Various screen printed products including t-shirts and textiles"
/>
`

/**
 * Example 6: Custom design page hero
 */
export const customDesignPageExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Custom Design"
  description="Vi hjälper dig att skapa unika design för dina produkter"
  :width="1280"
  :height="854"
  alt="Designer working on custom screen printing artwork"
/>
`

/**
 * Example 7: About page hero
 */
export const aboutPageExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Om TriColor Screen"
  description="Sedan 1995 har vi levererat kvalitet och service i Stockholm"
  :width="1280"
  :height="854"
  alt="TriColor Screen team photo with founders and staff"
/>
`

/**
 * Example 8: Contact page hero
 */
export const contactPageExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Kontakta Oss"
  description="Vi finns här för att svara på dina frågor och ge dig råd"
  :width="1280"
  :height="854"
  alt="TriColor Screen studio entrance and contact information"
/>
`

/**
 * Example 9: Accessibility best practices
 */
export const accessibilityExample = `
<!-- Descriptive alt text for screen readers -->
<HeroImage 
  src="/images/index/hero.png"
  title="Screen Printing Excellence"
  description="Quality craftsmanship since 1995"
  alt="Close-up of screen printing process showing ink being pressed through mesh screen onto white t-shirt"
/>

<!-- Alt text describing the visual content -->
<HeroImage 
  src="/images/index/hero.png"
  title="Full-Service Printing"
  description="From design to delivery"
  alt="Gallery of finished screen printed products including t-shirts, hoodies, and tote bags in various colors"
/>

<!-- Alt text including people descriptions -->
<HeroImage 
  src="/images/index/hero.png"
  title="Meet Our Team"
  description="Experienced professionals dedicated to your project"
  alt="TriColor Screen team of five people standing in the workshop, smiling, wearing company branded aprons"
/>
`

/**
 * Example 10: Using in a page component
 */
export const pageComponentExample = `
<script setup lang="ts">
const pageTitle = 'Our Services'
const pageDescription = 'Professional screen printing for all your needs'
const heroImage = '/images/index/hero.png'
</script>

<template>
  <div>
    <HeroImage 
      :src="heroImage"
      :title="pageTitle"
      :description="pageDescription"
      :width="1280"
      :height="854"
      alt="Various screen printed products displayed"
    />
    
    <!-- Page content -->
    <main class="container mx-auto py-12">
      <!-- Your content here -->
    </main>
  </div>
</template>
`

/**
 * Example 11: Dynamic content from CMS or API
 */
export const dynamicContentExample = `
<script setup lang="ts">
const { data: pageData } = await useFetch('/api/page/home')
</script>

<template>
  <HeroImage 
    :src="pageData.heroImage"
    :title="pageData.title"
    :description="pageData.subtitle"
    :width="1280"
    :height="854"
    :alt="pageData.heroImageAlt"
  />
</template>
`

/**
 * Example 12: With loading state
 */
export const loadingStateExample = `
<script setup lang="ts">
const { data, pending } = await useFetch('/api/page/about')
</script>

<template>
  <div v-if="!pending">
    <HeroImage 
      :src="data.heroImage"
      :title="data.title"
      :description="data.description"
      :alt="data.heroAlt"
    />
  </div>
  <div v-else class="h-[60vh] md:h-[70vh] lg:h-[80vh] bg-neutral-200 animate-pulse">
    <!-- Loading skeleton -->
  </div>
</template>
`

/**
 * Example 13: Multiple heroes on same page (if needed)
 */
export const multipleHerosExample = `
<template>
  <div>
    <!-- Main hero -->
    <HeroImage 
      src="/images/index/hero.png"
      title="Welcome to TriColor Screen"
      description="Professional screen printing services"
      alt="Main hero banner"
    />
    
    <!-- Content section -->
    <section class="py-12">
      <!-- Your content -->
    </section>
    
    <!-- Secondary hero for another section -->
    <HeroImage 
      src="/images/index/hero.png"
      title="Our Services"
      description="Explore what we offer"
      alt="Services showcase"
    />
  </div>
</template>
`

/**
 * Example 14: Custom formatted description using slot
 */
export const customFormattedDescriptionExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="TriColor Screen"
  alt="TriColor Screen studio workspace"
>
  <template #description>
    <p>
      Professional screen printing services in 
      <span class="text-primary-400 font-bold">Stockholm</span>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 15: Multi-line description with different styling
 */
export const multiLineDescriptionExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Welcome to TriColor Screen"
  alt="TriColor Screen workspace"
>
  <template #description>
    <p class="mb-2">
      <span class="font-bold text-accent-300">Professional</span> screen printing services
    </p>
    <p class="text-sm md:text-base">
      Serving Stockholm since <span class="font-semibold">1995</span>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 16: Description with highlighted keywords
 */
export const highlightedKeywordsExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Custom Design & Premium Quality"
  alt="Custom screen printing designs"
>
  <template #description>
    <p>
      From <span class="text-secondary-400 font-semibold">concept</span> to 
      <span class="text-secondary-400 font-semibold">completion</span>, 
      we handle every step with 
      <span class="text-accent-300 font-bold">care</span> and 
      <span class="text-accent-300 font-bold">expertise</span>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 17: Description with link
 */
export const descriptionWithLinkExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Våra Tjänster"
  alt="Screen printing services"
>
  <template #description>
    <p>
      Professionellt screentryck för alla behov - från t-shirts till textilier.
      <NuxtLink 
        to="/contact" 
        class="text-primary-400 hover:text-primary-300 underline underline-offset-4 font-semibold transition-colors ml-2"
      >
        Kontakta oss idag
      </NuxtLink>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 18: Description with icon
 */
export const descriptionWithIconExample = `
<script setup lang="ts">
import CheckIcon from '~/assets/icons/check.svg?component'
</script>

<template>
  <HeroImage 
    src="/images/index/hero.png"
    title="Premium Quality Guaranteed"
    alt="Quality screen printing"
  >
    <template #description>
      <div class="flex items-center gap-2">
        <CheckIcon class="w-5 h-5 text-success-light" aria-hidden="true" />
        <p>
          Over <span class="font-bold text-accent-300">20 years</span> of excellence in screen printing
        </p>
      </div>
    </template>
  </HeroImage>
</template>
`

/**
 * Example 19: Description with gradient text
 */
export const gradientTextDescriptionExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="TriColor Screen"
  alt="TriColor Screen studio"
>
  <template #description>
    <p>
      <span class="bg-gradient-to-r from-primary-400 via-accent-300 to-secondary-400 bg-clip-text text-transparent font-bold">
        Stockholm's leading
      </span>
      <span class="ml-1">company for screen printing and design</span>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 20: Description with list
 */
export const descriptionWithListExample = `
<HeroImage 
  src="/images/index/hero.png"
  title="Why Choose Us"
  alt="TriColor Screen benefits"
>
  <template #description>
    <ul class="space-y-1">
      <li class="flex items-center gap-2">
        <span class="text-accent-300">✓</span>
        <span>Premium quality printing</span>
      </li>
      <li class="flex items-center gap-2">
        <span class="text-accent-300">✓</span>
        <span>Fast turnaround</span>
      </li>
      <li class="flex items-center gap-2">
        <span class="text-accent-300">✓</span>
        <span>Competitive pricing</span>
      </li>
    </ul>
  </template>
</HeroImage>
`

/**
 * Example 21: Dynamic content in description slot
 */
export const dynamicSlotContentExample = `
<script setup lang="ts">
const stats = ref({
  years: 29,
  projects: 5000,
  clients: 1200
})
</script>

<template>
  <HeroImage 
    src="/images/index/hero.png"
    title="Trusted by Thousands"
    alt="TriColor Screen achievements"
  >
    <template #description>
      <div class="flex flex-wrap gap-4 md:gap-6">
        <div>
          <span class="text-2xl md:text-3xl font-bold text-accent-300">{{ stats.years }}+</span>
          <span class="ml-1">years</span>
        </div>
        <div>
          <span class="text-2xl md:text-3xl font-bold text-primary-400">{{ stats.projects }}+</span>
          <span class="ml-1">projects</span>
        </div>
        <div>
          <span class="text-2xl md:text-3xl font-bold text-secondary-400">{{ stats.clients }}+</span>
          <span class="ml-1">happy clients</span>
        </div>
      </div>
    </template>
  </HeroImage>
</template>
`

/**
 * Example 22: Custom formatted title using slot
 */
export const customFormattedTitleExample = `
<HeroImage 
  src="/images/index/hero.png"
  description="Professional screen printing services in Stockholm"
  alt="TriColor Screen studio"
>
  <template #title>
    <span class="text-primary-400">Tri</span><span class="text-accent-300">Color</span> <span class="text-secondary-400">Screen</span>
  </template>
</HeroImage>
`

/**
 * Example 23: Title with gradient and icon
 */
export const titleWithGradientExample = `
<script setup lang="ts">
import StarIcon from '~/assets/icons/star.svg?component'
</script>

<template>
  <HeroImage 
    src="/images/index/hero.png"
    description="Stockholm's premier screen printing company"
    alt="TriColor Screen studio"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <StarIcon class="w-8 h-8 md:w-12 md:h-12 text-accent-300" aria-hidden="true" />
        <span class="bg-gradient-to-r from-primary-400 via-accent-300 to-secondary-400 bg-clip-text text-transparent">
          Premium Quality Printing
        </span>
      </div>
    </template>
  </HeroImage>
</template>
`

/**
 * Example 24: Both title and description slots with custom formatting
 */
export const bothSlotsExample = `
<HeroImage 
  src="/images/index/hero.png"
  alt="TriColor Screen workspace"
>
  <template #title>
    <div>
      <span class="text-accent-300 font-extrabold">TriColor</span>
      <span class="text-white font-light">Screen</span>
    </div>
  </template>
  <template #description>
    <p class="mb-2">
      <span class="text-primary-400 font-bold">Professional</span> screen printing in 
      <span class="text-secondary-400 font-semibold">Stockholm</span>
    </p>
    <p class="text-sm">
      Serving clients since <span class="font-bold text-accent-300">1995</span>
    </p>
  </template>
</HeroImage>
`

/**
 * Example 25: Title with subtitle styling
 */
export const titleWithSubtitleExample = `
<HeroImage 
  src="/images/index/hero.png"
  description="Professional screen printing and custom design services"
  alt="TriColor Screen services"
>
  <template #title>
    <div>
      <div class="text-4xl md:text-5xl lg:text-6xl mb-2">
        Welcome to <span class="text-primary-400">TriColor Screen</span>
      </div>
      <div class="text-xl md:text-2xl lg:text-3xl font-normal text-white/80">
        Your printing partner since 1995
      </div>
    </div>
  </template>
</HeroImage>
`

/**
 * Example 26: Animated title (with Tailwind classes)
 */
export const animatedTitleExample = `
<HeroImage 
  src="/images/index/hero.png"
  description="Experience excellence in every print"
  alt="TriColor Screen printing"
>
  <template #title>
    <div class="space-y-2">
      <div class="animate-fade-in">
        Premium <span class="text-accent-300">Screen Printing</span>
      </div>
      <div class="animate-fade-in animation-delay-200">
        <span class="text-primary-400">&</span> Custom <span class="text-secondary-400">Design</span>
      </div>
    </div>
  </template>
</HeroImage>
`

/**
 * Recommended Image Sizes
 * 
 * All sizes use 3:2 aspect ratio for consistency
 */
export const recommendedImageSizes = `
Standard: 1920x1280 (3:2 aspect ratio)
Large:    1800x1200 (3:2 large)
Medium:   1200x800  (3:2 medium)
Compact:  960x640   (3:2 compact)
`

/**
 * Props Interface
 */
export const propsInterface = `
interface HeroImageProps {
  src: string          // Image source path (required)
  title?: string       // Page title displayed on hero (optional if using slot)
  description?: string // Brief description text (optional if using slot)
  width?: number       // Image width for optimization (default: 1920)
  height?: number      // Image height for optimization (default: 1280)
  alt?: string         // Descriptive alt text (default: 'Hero banner image')
}

Slots:
  #title       - Custom formatted title content (overrides title prop)
  #description - Custom formatted description content (overrides description prop)
`

/**
 * WCAG 2.1 AA Compliance Notes
 */
export const accessibilityNotes = `
Alt Text Guidelines:
  ✅ Good: "Team of five screen printers working on custom t-shirt designs in modern studio"
  ❌ Bad: "Hero image" or "Banner"
  ❌ Bad: Empty alt text for content images

Text Contrast:
  - Text overlay uses white text on dark semi-transparent background
  - Contrast ratio: 21:1 (exceeds WCAG AAA standard)
  - Implementation: bg-neutral-900/70 with backdrop-blur

Semantic HTML:
  - <section role="banner"> for the hero section
  - <h1> for page title
  - <p> for description

Responsive Behavior:
  - Component automatically adjusts height based on viewport
  - 60vh on mobile, 70vh on tablet, 80vh on desktop
  - Text scales appropriately across breakpoints

Performance:
  - Uses eager loading and high priority for LCP optimization
  - WebP format automatically handled by NuxtImg
  - Images optimized and served in appropriate sizes
`
