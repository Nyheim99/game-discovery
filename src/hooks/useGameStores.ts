import { useQuery } from '@tanstack/react-query'
import { fetchGameStores } from '@/services/api-client'

// The buy links for a game, keyed by slug so each game caches separately.
export function useGameStores(slug: string) {
  return useQuery({
    queryKey: ['stores', slug],
    queryFn: () => fetchGameStores(slug),
    staleTime: 1000 * 60 * 60 * 24,
  })
}
