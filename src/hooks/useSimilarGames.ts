import { useQuery } from '@tanstack/react-query'
import { fetchGames } from '@/services/api-client'

// "Similar games" = highly-rated games sharing this game's primary genre.
// We reuse the existing fetchGames (top-rated in that genre), then `select`
// trims out the current game and caps the list. `enabled` holds the query
// until we actually know the genre.
export function useSimilarGames(
  genreId: number | undefined,
  excludeId: number,
) {
  return useQuery({
    queryKey: ['similar-games', genreId, excludeId],
    queryFn: () =>
      fetchGames(
        {
          genreId: genreId!,
          platformId: null,
          searchText: '',
          sortOrder: '-rating',
        },
        1,
      ),
    enabled: genreId != null,
    select: (data) =>
      data.results.filter((game) => game.id !== excludeId).slice(0, 8),
    staleTime: 1000 * 60 * 60,
  })
}
