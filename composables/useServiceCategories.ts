/**
 * Service Categories Composable
 *
 * Lazy-loads service category JSON data via interaction or IntersectionObserver.
 * Uses deterministic cache key to ensure single-fetch behavior across all instances.
 * Cached indefinitely in memory (static read-only data).
 */

import type { IServiceCard } from '~/types/ServiceCard'
import { useContent } from '~/composables/useContent'

// Deterministic cache key for service categories
const CACHE_KEY = 'service_categories_index'
const DATA_URL = '/data/index/service-categories.json'

/**
 * Composable for fetching service category cards
 * Implements lazy loading with IntersectionObserver support
 */
export function useServiceCategories() {
  const { data, loading, error, fetchContent } = useContent<IServiceCard[]>(
    CACHE_KEY,
    DATA_URL,
  )

  /**
   * Lazy load service categories when element enters viewport
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
   * Load service categories on user interaction (click, hover, focus)
   * @param element - Target element for interaction
   */
  const loadOnInteraction = (element: Ref<HTMLElement | null>) => {
    if (!import.meta.client) return

    const load = () => {
      if (!data.value) {
        fetchContent()
      }
    }

    watch(
      element,
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
    serviceCategories: data,
    loading: readonly(loading),
    error: readonly(error),
    load,
    loadOnVisible,
    loadOnInteraction,
  }
}
