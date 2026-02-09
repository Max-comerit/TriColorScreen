// composables/useResponsivePerPage.ts
export function useResponsivePerPage() {
  const { width } = useWindowWidth()

  const perPage = computed(() => {
    if (width.value >= 1024) return 3
    if (width.value >= 640) return 2
    return 1
  })

  return { perPage }
}
