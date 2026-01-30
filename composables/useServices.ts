/**
 * Services Composable
 *
 * Lazy-loads service JSON data by category via interaction or viewport proximity.
 * Uses deterministic cache keys per category to ensure single-fetch behavior.
 * Cached indefinitely in memory (static read-only data).
 */

import type { IServiceCard } from '~/types/ServiceCard'
import { useContent } from '~/composables/useContent'

/**
 * Service category identifiers
 */
export type ServiceCategory =
  | 'graphic-production'
  | 'decoration-foiling'
  | 'screen-printing-embroidery'
  | 'printed-matter'
  | 'event-advertisement'

/**
 * Generate deterministic cache key for a service category
 */
function getCacheKey(category: ServiceCategory): string {
  return `services_${category}`
}

/**
 * Generate data URL for a service category
 */
function getDataUrl(category: ServiceCategory): string {
  return `/data/services/${category}/services.json`
}

/**
 * Composable for fetching services by category
 * @param category - Service category identifier
 */
export function useServices(category: ServiceCategory) {
  const cacheKey = getCacheKey(category)
  const dataUrl = getDataUrl(category)

  const { data, loading, error, fetchContent } = useContent<IServiceCard[]>(
    cacheKey,
    dataUrl,
  )

  /**
   * Lazy load services when element enters viewport
   * @param element - Target element ref or getter function
   * @param threshold - Intersection threshold (0-1)
   */
  const loadOnVisible = (
    element: Ref<HTMLElement | null> | (() => HTMLElement | null | undefined),
    threshold = 0.1,
  ) => {
    if (!import.meta.client) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !data.value) {
            fetchContent()
            observer.disconnect()
          }
        })
      },
      { threshold },
    )

    // Handle both ref and getter function
    const getElement = () => {
      if (typeof element === 'function') {
        return element()
      }
      return unref(element)
    }

    watch(
      getElement,
      (el) => {
        if (el) {
          observer.observe(el)
        }
      },
      { immediate: true },
    )

    // Cleanup
    onUnmounted(() => observer.disconnect())
  }

  /**
   * Load services on user interaction (click, hover, focus)
   * @param element - Target element ref or getter function
   */
  const loadOnInteraction = (
    element: Ref<HTMLElement | null> | (() => HTMLElement | null | undefined),
  ) => {
    if (!import.meta.client) return

    const load = () => {
      if (!data.value) {
        fetchContent()
      }
    }

    // Handle both ref and getter function
    const getElement = () => {
      if (typeof element === 'function') {
        return element()
      }
      return unref(element)
    }

    watch(
      getElement,
      (el) => {
        if (el) {
          el.addEventListener('mouseenter', load, { once: true })
          el.addEventListener('focus', load, { once: true })
          el.addEventListener('touchstart', load, { once: true, passive: true })
        }
      },
      { immediate: true },
    )
  }

  /**
   * Eager load (fetch immediately)
   */
  const load = () => {
    if (!data.value) {
      fetchContent()
    }
  }

  return {
    services: data,
    loading: readonly(loading),
    error: readonly(error),
    load,
    loadOnVisible,
    loadOnInteraction,
  }
}

/**
 * Composable for pre-fetching multiple service categories
 * Useful for prefetching related content
 */
export function usePrefetchServices(categories: ServiceCategory[]) {
  const prefetch = () => {
    categories.forEach((category) => {
      const { load } = useServices(category)
      load()
    })
  }

  return {
    prefetch,
  }
}
