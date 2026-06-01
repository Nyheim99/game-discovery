import { useQuery } from '@tanstack/react-query'
import { fetchScreenshots } from '@/services/api-client'

// A game's screenshots, keyed by slug so each game caches separately.
export function useScreenshots(slug: string) {
  return useQuery({
    queryKey: ['screenshots', slug],
    queryFn: () => fetchScreenshots(slug),
    staleTime: 1000 * 60 * 60 * 24,
  })
}
