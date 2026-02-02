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

### `useCardContent.ts`
Generic composable for lazy-loading card content from any JSON file.

```vue
<script setup lang="ts">
import type { IServiceCard } from '~/types/ServiceCard'
import { useCardContent } from '~/composables/useCardContent'

// Example: Load services for a specific category
const { services, loading, error, load, loadOnVisible } = useCardContent<IServiceCard[]>('/data/services/graphic-production/services.json')

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

**Prefetch multiple files:**

```vue
<script setup lang="ts">
import { useCardContent } from '~/composables/useCardContent'

const files = [
  '/data/services/graphic-production/services.json',
  '/data/services/decoration-foiling/services.json',
  '/data/services/screen-printing-embroidery/services.json',
]

const prefetchAll = () => {
  files.forEach((src) => {
    const { load } = useCardContent(src)
    load()
  })
}

onMounted(() => {
  requestIdleCallback(() => prefetchAll())
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

- **Cache Key Format**: `content_{type}` or `services_{src}`
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

- `useCardContent` now accepts either a `Ref<HTMLElement | null>` or a getter function (e.g. `() => element`) for `loadOnVisible` and `loadOnInteraction`.
    - This allows compatibility with both template refs and exposed DOM elements, and prevents Vue warnings about invalid watch sources.
- Both composables now handle IntersectionObserver and event listeners robustly for both ref and function usage.
- Example usage:

```ts
// Correct usage with getter function (for custom/exposed DOM elements)
onMounted(() => {
  loadOnVisible(() => sectionRef.value, 0.1)
})
```

- This ensures lazy loading works with both template refs and custom/exposed DOM elements, and avoids runtime errors or warnings.

## CardGrid Usage Note

The CardGrid component does not expose a slot. It renders cards automatically based on the loaded content and the `type` prop. Do not use `<template #default>` or slot syntax with CardGrid.
