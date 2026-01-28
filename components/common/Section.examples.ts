/**
 * Section Component Examples
 *
 * @description Usage examples for the Section component
 * demonstrating various props and configurations for page sections.
 */

/**
 * Example 1: Basic usage with title only
 */
export const basicExample = `
<Section title="Our Services">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
</Section>
`

/**
 * Example 2: With title and description
 */
export const withDescriptionExample = `
<Section 
  title="About Us" 
  description="Learn more about our company and what we do"
>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Your content here -->
  </div>
</Section>
`

/**
 * Example 3: Different padding sizes
 */
export const paddingSizesExample = `
<!-- No padding -->
<Section title="No Padding Section" padding-y="none">
  <p>This section has no vertical padding</p>
</Section>

<!-- Small padding -->
<Section title="Small Padding" padding-y="small">
  <p>Compact spacing for tight layouts</p>
</Section>

<!-- Medium padding (default) -->
<Section title="Medium Padding" padding-y="medium">
  <p>Balanced spacing for most content</p>
</Section>

<!-- Large padding -->
<Section title="Large Padding" padding-y="large">
  <p>Generous spacing for emphasis and breathing room</p>
</Section>
`

/**
 * Example 4: Different text alignments
 */
export const textAlignmentExample = `
<!-- Left aligned (default) -->
<Section title="Left Aligned" align="left">
  <p>Content starts from the left side</p>
</Section>

<!-- Center aligned -->
<Section title="Centered Content" align="center">
  <p>Great for hero sections and featured content</p>
</Section>

<!-- Right aligned -->
<Section title="Right Aligned" align="right">
  <p>Text and heading aligned to the right</p>
</Section>
`

/**
 * Example 5: With custom background colors
 */
export const backgroundColorsExample = `
<!-- White background -->
<Section title="White Section" background-color="bg-white">
  <p>Clean and minimal look</p>
</Section>

<!-- Light gray background -->
<Section title="Light Background" background-color="bg-neutral-50">
  <p>Subtle contrast for visual separation</p>
</Section>

<!-- Primary color background -->
<Section title="Branded Section" background-color="bg-primary" text-color="text-white">
  <p>Stand out with brand colors</p>
</Section>

<!-- Dark background -->
<Section title="Dark Section" background-color="bg-neutral-900" text-color="text-white">
  <p>Bold and dramatic appearance</p>
</Section>
`

/**
 * Example 6: With and without container
 */
export const containerExample = `
<!-- With container (default) -->
<Section title="Contained Content" :contained="true">
  <p>Content is constrained to a maximum width</p>
</Section>

<!-- Without container (full width) -->
<Section title="Full Width Section" :contained="false">
  <div class="w-full bg-primary h-64">
    <p>Content spans the entire viewport width</p>
  </div>
</Section>
`

/**
 * Example 7: With ID for navigation
 */
export const withIdExample = `
<Section 
  id="services" 
  title="Our Services"
  aria-label="Company services and solutions"
>
  <p>This section can be linked to with #services</p>
</Section>

<!-- Link to this section -->
<a href="#services">Jump to Services</a>
`

/**
 * Example 8: Services grid layout
 */
export const servicesGridExample = `
<Section 
  id="services"
  title="What We Offer" 
  description="Professional screen printing services for all your needs"
  align="center"
  padding-y="large"
  aria-label="Our services and offerings"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ServiceCard 
      title="Screen Printing"
      description="High-quality screen printing on various materials"
      image-src="/images/services/screen-printing.jpg"
    />
    <ServiceCard 
      title="Custom Design"
      description="Professional design services for your projects"
      image-src="/images/services/design.jpg"
    />
    <ServiceCard 
      title="Embroidery"
      description="Precise embroidery for a premium finish"
      image-src="/images/services/embroidery.jpg"
    />
  </div>
</Section>
`

/**
 * Example 9: Testimonials section
 */
export const testimonialsExample = `
<Section 
  id="testimonials"
  title="What Our Clients Say" 
  description="Real feedback from satisfied customers"
  align="center"
  background-color="bg-neutral-50"
  aria-label="Customer testimonials and reviews"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- Testimonial cards -->
  </div>
</Section>
`

/**
 * Example 10: Contact section
 */
export const contactSectionExample = `
<Section 
  id="contact"
  title="Get In Touch" 
  description="We'd love to hear from you and discuss your project"
  align="center"
  padding-y="large"
  aria-label="Contact information and form"
>
  <div class="max-w-2xl mx-auto">
    <ContactForm />
  </div>
</Section>
`

/**
 * Example 11: FAQ section
 */
export const faqSectionExample = `
<Section 
  id="faq"
  title="Frequently Asked Questions" 
  description="Find answers to common questions about our services"
  aria-label="Frequently asked questions"
>
  <div class="max-w-3xl mx-auto space-y-4">
    <Accordion title="What is screen printing?">
      <p>Screen printing is a printing technique...</p>
    </Accordion>
    <Accordion title="How long does it take?">
      <p>Typical turnaround time is...</p>
    </Accordion>
  </div>
</Section>
`

/**
 * Example 12: Features section with icons
 */
export const featuresSectionExample = `
<Section 
  id="features"
  title="Why Choose Us" 
  description="What sets us apart from the competition"
  align="center"
  background-color="bg-white"
  aria-label="Company features and benefits"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <FeatureCard 
      icon="check-circle"
      title="Quality Guaranteed"
      description="Premium materials and craftsmanship"
    />
    <FeatureCard 
      icon="clock"
      title="Fast Turnaround"
      description="Quick delivery without compromising quality"
    />
    <FeatureCard 
      icon="dollar"
      title="Competitive Pricing"
      description="Best value for your investment"
    />
    <FeatureCard 
      icon="support"
      title="Expert Support"
      description="Dedicated team to help you succeed"
    />
  </div>
</Section>
`

/**
 * Example 13: Team section
 */
export const teamSectionExample = `
<Section 
  id="team"
  title="Meet Our Team" 
  description="The talented people behind our success"
  align="center"
  padding-y="large"
  aria-label="Our team members"
>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <TeamMemberCard 
      name="John Doe"
      role="Founder & CEO"
      image="/images/team/john.jpg"
    />
    <!-- More team members -->
  </div>
</Section>
`

/**
 * Example 14: Stats section
 */
export const statsSectionExample = `
<Section 
  id="stats"
  background-color="bg-primary" 
  text-color="text-white"
  padding-y="large"
  align="center"
  aria-label="Company statistics and achievements"
>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
    <div>
      <div class="text-4xl md:text-5xl font-bold">29+</div>
      <div class="text-lg mt-2">Years Experience</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold">5000+</div>
      <div class="text-lg mt-2">Projects Completed</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold">1200+</div>
      <div class="text-lg mt-2">Happy Clients</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold">100%</div>
      <div class="text-lg mt-2">Satisfaction</div>
    </div>
  </div>
</Section>
`

/**
 * Example 15: Gallery section
 */
export const gallerySectionExample = `
<Section 
  id="gallery"
  title="Our Work" 
  description="Browse our portfolio of completed projects"
  align="center"
  :contained="false"
  aria-label="Project gallery and portfolio"
>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <!-- Gallery images -->
  </div>
</Section>
`

/**
 * Example 16: CTA (Call to Action) section
 */
export const ctaSectionExample = `
<Section 
  id="cta"
  background-color="bg-secondary" 
  text-color="text-white"
  padding-y="large"
  align="center"
  aria-label="Get started call to action"
>
  <h2 class="font-display text-4xl md:text-5xl font-bold mb-6">
    Ready to Start Your Project?
  </h2>
  <p class="text-xl mb-8 max-w-2xl mx-auto">
    Contact us today for a free consultation and quote
  </p>
  <NuxtLink 
    to="/contact" 
    class="inline-block px-8 py-4 bg-white text-secondary font-semibold rounded-button hover:bg-neutral-100 transition-colors"
  >
    Get Started
  </NuxtLink>
</Section>
`

/**
 * Example 17: Blog/News section
 */
export const blogSectionExample = `
<Section 
  id="blog"
  title="Latest News" 
  description="Stay updated with our latest articles and announcements"
  aria-label="Blog posts and news articles"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <BlogPostCard 
      title="New Equipment Arrives"
      excerpt="We've invested in state-of-the-art printing technology..."
      date="2026-01-15"
      image="/images/blog/equipment.jpg"
    />
    <!-- More blog posts -->
  </div>
</Section>
`

/**
 * Example 18: Process/Steps section
 */
export const processSectionExample = `
<Section 
  id="process"
  title="How It Works" 
  description="Our simple and efficient process from start to finish"
  align="center"
  background-color="bg-neutral-50"
  aria-label="Our work process and steps"
>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
    <ProcessStep number="1" title="Consultation" description="Discuss your project needs" />
    <ProcessStep number="2" title="Design" description="Create custom artwork" />
    <ProcessStep number="3" title="Production" description="Print with precision" />
    <ProcessStep number="4" title="Delivery" description="Receive your order" />
  </div>
</Section>
`

/**
 * Example 19: Partners/Clients section
 */
export const partnersSectionExample = `
<Section 
  id="partners"
  title="Trusted By" 
  description="Proud to work with leading brands and organizations"
  align="center"
  padding-y="medium"
  aria-label="Partner companies and clients"
>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70">
    <img src="/images/logos/client1.png" alt="Client 1 logo" class="h-12 object-contain" />
    <img src="/images/logos/client2.png" alt="Client 2 logo" class="h-12 object-contain" />
    <!-- More client logos -->
  </div>
</Section>
`

/**
 * Example 20: Newsletter section
 */
export const newsletterSectionExample = `
<Section 
  id="newsletter"
  background-color="bg-primary" 
  text-color="text-white"
  padding-y="medium"
  align="center"
  aria-label="Newsletter signup"
>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
    Stay Informed
  </h2>
  <p class="text-lg mb-6">
    Subscribe to our newsletter for tips, updates, and special offers
  </p>
  <NewsletterForm />
</Section>
`

/**
 * Example 21: Nested sections with different backgrounds
 */
export const nestedSectionsExample = `
<div>
  <Section 
    title="Services Overview" 
    background-color="bg-white"
    padding-y="large"
  >
    <p class="mb-8">Explore our comprehensive range of services</p>
  </Section>
  
  <Section 
    title="Featured Work" 
    background-color="bg-neutral-50"
    padding-y="large"
  >
    <p>Take a look at our recent projects</p>
  </Section>
  
  <Section 
    title="Get Started" 
    background-color="bg-primary"
    text-color="text-white"
    padding-y="large"
  >
    <p>Ready to begin? Contact us today!</p>
  </Section>
</div>
`

/**
 * Example 22: Dynamic content from API
 */
export const dynamicContentExample = `
<script setup lang="ts">
const { data: services } = await useFetch('/api/services')
</script>

<template>
  <Section 
    id="services"
    title="Our Services" 
    description="Professional solutions for your needs"
    align="center"
    aria-label="Available services"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ServiceCard 
        v-for="service in services" 
        :key="service.id"
        :title="service.name"
        :description="service.description"
        :image-src="service.image"
      />
    </div>
  </Section>
</template>
`

/**
 * Example 23: Section with tabs
 */
export const sectionWithTabsExample = `
<Section 
  id="products"
  title="Our Products" 
  description="Browse our full range of printing solutions"
  aria-label="Product categories"
>
  <Tabs>
    <Tab title="T-Shirts">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- T-shirt products -->
      </div>
    </Tab>
    <Tab title="Hoodies">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Hoodie products -->
      </div>
    </Tab>
    <Tab title="Accessories">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Accessory products -->
      </div>
    </Tab>
  </Tabs>
</Section>
`

/**
 * Example 24: Section with loading state
 */
export const loadingStateExample = `
<script setup lang="ts">
const { data, pending } = await useFetch('/api/content')
</script>

<template>
  <Section 
    :title="pending ? 'Loading...' : data.title" 
    :description="pending ? '' : data.description"
  >
    <div v-if="!pending">
      <!-- Actual content -->
    </div>
    <div v-else class="animate-pulse space-y-4">
      <div class="h-32 bg-neutral-200 rounded-card"></div>
      <div class="h-32 bg-neutral-200 rounded-card"></div>
    </div>
  </Section>
</template>
`

/**
 * Example 25: Minimal section (content only)
 */
export const minimalSectionExample = `
<Section padding-y="medium">
  <div class="prose max-w-none">
    <p>This section has no title or description, just content.</p>
    <p>Great for simple content blocks or spacing between major sections.</p>
  </div>
</Section>
`

/**
 * Props Interface
 */
export const propsInterface = `
interface SectionProps {
  title?: string                              // Section heading text
  description?: string                        // Section description text
  id?: string                                 // Unique ID for navigation/anchors
  backgroundColor?: string                    // Tailwind bg class (default: 'bg-white')
  textColor?: string                          // Tailwind text class (default: 'text-neutral-900')
  paddingY?: 'none' | 'small' | 'medium' | 'large'  // Vertical padding (default: 'medium')
  contained?: boolean                         // Constrain width with container (default: true)
  align?: 'left' | 'center' | 'right'        // Text alignment (default: 'left')
  ariaLabel?: string                          // ARIA label for accessibility
}

Padding Sizes:
  none:   No vertical padding
  small:  py-4 md:py-6
  medium: py-6 md:py-8 lg:py-10 (default)
  large:  py-8 md:py-12 lg:py-16

Slots:
  default - Main content area
`

/**
 * WCAG 2.1 AA Compliance Notes
 */
export const accessibilityNotes = `
Semantic HTML:
  ✅ Uses <section> element for semantic structure
  ✅ Uses <header> for section heading area
  ✅ Proper heading hierarchy with <h2>
  ✅ ARIA labels for screen reader context

Keyboard Navigation:
  ✅ tabindex="-1" allows programmatic focus for skip links
  ✅ Not in normal tab order (only interactive content should be)
  ✅ Can be targeted by anchor links (#id)

Color Contrast:
  ✅ Default text-neutral-900 on bg-white: 21:1 ratio
  ✅ Ensure custom colors maintain 4.5:1 minimum contrast
  ✅ Large text (18pt+) needs 3:1 minimum

Responsive Design:
  ✅ Mobile-first approach with progressive enhancement
  ✅ Breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
  ✅ Flexible padding scales with viewport

Best Practices:
  ✅ One <h1> per page (Section uses <h2>)
  ✅ Use unique IDs for each section
  ✅ Provide descriptive aria-label when title isn't sufficient
  ✅ Maintain logical heading hierarchy (don't skip levels)
  ✅ Use semantic HTML over div soup
`

/**
 * Common Patterns
 */
export const commonPatterns = `
Hero Section (after HeroImage):
  - padding-y="large"
  - align="center"
  - Background variation for visual interest

Content Sections:
  - padding-y="medium" (default)
  - align="left" for text-heavy content
  - align="center" for featured content

CTA Sections:
  - padding-y="large"
  - align="center"
  - Bold background color (bg-primary, bg-secondary)
  - Contrasting text-color

Divider Pattern (alternating backgrounds):
  Section 1: bg-white
  Section 2: bg-neutral-50
  Section 3: bg-white
  Section 4: bg-primary + text-white

Full-Width Content:
  - :contained="false"
  - Useful for galleries, full-bleed images
  - Consider adding container inside slot for mixed layouts
`

/**
 * Usage Tips
 */
export const usageTips = `
1. Always use semantic sections for major page areas
2. Provide unique IDs for main sections (aids navigation)
3. Use aria-label when section purpose isn't obvious from title
4. Match padding-y to content importance (large = important)
5. Alternate background colors for visual rhythm
6. Center align for promotional/featured content
7. Left align for reading-heavy content
8. Use contained={false} sparingly for special layouts
9. Keep heading hierarchy consistent (h1 → h2 → h3)
10. Test with keyboard navigation and screen readers
`
