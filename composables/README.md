# Content Composables

This folder contains composables for generic content fetching and caching.

## Architecture

- **Generic composable** (`useJSONContent.ts`) for fetching and caching JSON content
- **Infinite caching** - static read-only data cached in memory forever
- **Deterministic keys** - prevents duplicate fetches
- **Shared state** - loading and error state is shared across all instances with same cache key
- **Client-side only** - content loaded client-side only, skips server-side fetching

## Composables

### `useJSONContent.ts`

Generic composable for fetching and caching JSON content from the public directory.

```ts
const { data, loading, error, fetchContent } = useJSONContent<MyType>(
  'unique_cache_key',
  '/data/my-content.json'
)

// Call fetchContent() to trigger fetch
await fetchContent()
```

**Features:**
- Shared `useState` for loading and error state (prevents duplicate simultaneous fetches)
- Infinite TTL caching for static data
- Server-side safe (skips fetch on server, only runs on client)
- Single fetch per cache key - subsequent calls return cached data
- Fully typed with TypeScript generics

## Data Management

Static JSON content is located in `/public/data/`

### Benefits of hardcoded data approach:
✅ Full TypeScript support and type safety  
✅ NuxtImg optimization at build time  
✅ IDE autocomplete and refactoring  
✅ No runtime network requests for static content  
✅ Reduced bundle size vs. JSON files  
✅ Better for SSG/static deployments (Netlify)
