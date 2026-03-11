// composables/useSiteUrl.ts

/**
 * Returns the configured site URL from runtimeConfig.public.appUrl (set via
 * the SITE_URL env var in netlify.toml, falling back to DEPLOY_PRIME_URL on
 * deploy previews and 'https://www.tricolorscreen.se' for local development).
 * Use this to build absolute URLs for og:image, og:url, and canonical links.
 */
export const useSiteUrl = (): string => {
  const { public: { appUrl } } = useRuntimeConfig()
  return appUrl as string
}
