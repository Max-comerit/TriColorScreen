# Content Composables

This folder contains composables for lazy-loading and caching static JSON content.

## Architecture

- **Static JSON** stored in `/public/data` (CDN-cacheable, served as-is)
- **No SSR fetching** - content loaded client-side after hydration
- **Infinite caching** - static read-only data cached in memory forever
- **Deterministic keys** - prevents duplicate fetches and hydration mismatches
- **No useAsyncData** - avoids render blocking and protects Lighthouse LCP

## Composables

### `useContent.ts`
Base composable for generic JSON content fetching with caching.

```ts
const { data, loading, error, fetchContent } = useContent<MyType>(
  'my_unique_key',
  '/data/my-content.json'
)
```

### `useServiceCategories.ts`
Lazy-loads service category cards from `/public/data/index/service-categories.json`

```vue
<script setup lang="ts">
const { serviceCategories, loading, error, load, loadOnVisible, loadOnInteraction } = useServiceCategories()

// Option 1: Load immediately
onMounted(() => load())

// Option 2: Load when element enters viewport
const sectionRef = ref<HTMLElement | null>(null)
loadOnVisible(sectionRef, 0.1)

// Option 3: Load on user interaction
const buttonRef = ref<HTMLElement | null>(null)
loadOnInteraction(buttonRef)
</script>

<template>
  <section ref="sectionRef">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="serviceCategories">
      <ServiceCard
        v-for="(category, index) in serviceCategories"
        :key="index"
        v-bind="category"
      />
    </div>
  </section>
</template>
```

### `useServices.ts`
Lazy-loads services by category from `/public/data/services/{category}/services.json`

```vue
<script setup lang="ts">
const { services, loading, error, load, loadOnVisible } = useServices('graphic-production')

// Load when section is visible
const servicesRef = ref<HTMLElement | null>(null)
loadOnVisible(servicesRef)
</script>

<template>
  <section ref="servicesRef">
    <div v-if="loading">Loading services...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="services">
      <ServiceCard
        v-for="(service, index) in services"
        :key="index"
        v-bind="service"
      />
    </div>
  </section>
</template>
```

**Prefetch multiple categories:**

```vue
<script setup lang="ts">
const { prefetch } = usePrefetchServices([
  'graphic-production',
  'decoration-foiling',
  'screen-printing-embroidery'
])

// Prefetch on interaction or idle
onMounted(() => {
  requestIdleCallback(() => prefetch())
})
</script>
```

## Available Service Categories

- `graphic-production`
- `decoration-foiling`
- `screen-printing-embroidery`
- `printed-matter`
- `event-advertisement`

## Cache Behavior

- **Cache Key Format**: `content_{type}` or `services_{category}`
- **TTL**: Infinite (static data never expires)
- **Shared State**: Uses `useState` for cross-component cache sharing
- **Hydration Safe**: Client-only fetching prevents mismatch
- **Single Fetch**: Deterministic keys ensure content fetched only once

## Performance Benefits

✅ No SSR overhead - content loaded after hydration  
✅ No render blocking - uses lazy loading strategies  
✅ Optimal LCP - critical content rendered immediately  
✅ Long-term caching - reduces network requests  
✅ IntersectionObserver - loads only visible content  
✅ CDN-friendly - static JSON served from `/public`

## Bugfixes (2026-01-29)

- `useServiceCategories` and `useServices` now accept either a `Ref<HTMLElement | null>` or a getter function (e.g. `() => element`) for `loadOnVisible` and `loadOnInteraction`.
    - This allows compatibility with both template refs and exposed DOM elements, and prevents Vue warnings about invalid watch sources.
- Both composables now handle IntersectionObserver and event listeners robustly for both ref and function usage.
- Example usage:

```ts
// Correct usage with getter function
onMounted(() => {
  loadOnVisible(() => sectionRef.value?.$el, 0.1)
})
```

- This ensures lazy loading works with custom/exposed DOM elements and avoids runtime errors or warnings.
