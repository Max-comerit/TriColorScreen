/**
 * Services Composable
 *
 * Lazy-loads JSON card content data by category via interaction or viewport proximity.
 * Uses deterministic cache keys per category to ensure single-fetch behavior.
 * Cached indefinitely in memory (static read-only data).
 */

import { useContent } from '~/composables/useContent'

/**
 * Generic composable for fetching card content data from a JSON file
 * @param src - Relative path to the JSON file
 */
export function useCardContent<T>(src: string) {
  const cacheKey = `cardContent_${src}`
  const dataUrl = src
  const { data, loading, error, fetchContent } = useContent<T>(cacheKey, dataUrl)

  /**
   * Lazy load card content when element enters viewport
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
   * Load card content on user interaction (click, hover, focus)
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

    const listeners: Array<{ el: HTMLElement; listener: () => void; type: string }> = []

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
          
          listeners.push(
            { el, listener: load, type: 'mouseenter' },
            { el, listener: load, type: 'focus' },
            { el, listener: load, type: 'touchstart' },
          )
        }
      },
      { immediate: true },
    )

    // Cleanup listeners on unmount
    onUnmounted(() => {
      listeners.forEach(({ el, listener, type }) => {
        el.removeEventListener(type, listener)
      })
      listeners.length = 0
    })
  }

  /**
   * Eager load card content (fetch immediately)
   */
  const load = () => {
    if (!data.value) {
      fetchContent()
    }
  }

  return {
    cardContent: data,
    loading: readonly(loading),
    error: readonly(error),
    load,
    loadOnVisible,
    loadOnInteraction,
  }
}
