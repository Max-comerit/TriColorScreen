/**
 * Base Content Composable
 *
 * Provides lazy-loaded, cached JSON content fetching for static read-only data.
 * Does NOT use useAsyncData to avoid render blocking and protect Lighthouse LCP.
 * Uses $fetch with useState for client-side caching with infinite TTL.
 */

interface ContentCacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Generic composable for fetching and caching static JSON content
 * @param cacheKey - Deterministic cache key (must be unique per content type)
 * @param url - URL to fetch JSON from (relative to /public)
 * @returns Reactive state with loading, error, and data
 */
export function useContent<T>(cacheKey: string, url: string) {
  // Use useState for shared, reactive cache across all instances
  const cache = useState<ContentCacheEntry<T> | null>(`content_${cacheKey}`, () => null)
  // Share loading and error state to prevent duplicate simultaneous fetches
  const loading = useState<boolean>(`${cacheKey}_loading`, () => false)
  const error = useState<Error | null>(`${cacheKey}_error`, () => null)

  /**
   * Fetch content from URL and cache it indefinitely
   * Only fetches once per cache key - subsequent calls return cached data
   */
  const fetchContent = async (): Promise<T | null> => {
    // Return cached data if available (infinite TTL)
    if (cache.value?.data) {
      return cache.value.data
    }

    // Prevent duplicate fetches
    if (loading.value) {
      return null
    }

    try {
      loading.value = true
      error.value = null

      // Skip on server-side to avoid hydration mismatch
      if (import.meta.server) {
        return null
      }

      // Fetch JSON from public directory (CDN-cacheable)
      const data = await $fetch<T>(url)

      // Cache with infinite TTL (static read-only data)
      cache.value = {
        data,
        timestamp: Date.now(),
      }

      return data
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch content')
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Computed property for accessing cached data
   */
  const data = computed(() => cache.value?.data ?? null)

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetchContent,
  }
}
