// composables/useSiteUrl.ts

/**
 * Returns the configured site URL (NUXT_PUBLIC_APP_URL env var).
 * Use this to build absolute URLs for og:image, og:url, and canonical links
 * so the domain only needs to be changed in one place.
 */
export const useSiteUrl = (): string => {
  const { public: { appUrl } } = useRuntimeConfig()
  return appUrl as string
}
