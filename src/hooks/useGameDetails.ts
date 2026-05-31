import { useQuery } from '@tanstack/react-query'
import { fetchGameDetails } from '@/services/api-client'

// Fetches one game's full details by its slug. The slug is part of the
// queryKey, so each game caches separately and navigating between games
// refetches the right one.
export function useGameDetails(slug: string) {
  return useQuery({
    queryKey: ['game', slug],
    queryFn: () => fetchGameDetails(slug),
  })
}
