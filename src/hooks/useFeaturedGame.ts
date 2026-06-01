import { useQuery } from '@tanstack/react-query'
import { fetchGames } from '@/services/api-client'

// Picks one standout game to headline the home page. We ask RAWG for the
// highest-Metacritic games and take the top result. This is its own query
// (cached under its own key, separate from the grid) so the hero stays stable
// while the user filters the list below it.
export function useFeaturedGame() {
  return useQuery({
    queryKey: ['featured-game'],
    queryFn: () =>
      fetchGames(
        {
          genreId: null,
          platformId: null,
          searchText: '',
          sortOrder: '-metacritic',
        },
        1,
      ),
    // `select` reshapes the cached data for consumers: we only want the single
    // top game, not the whole page of results.
    select: (data) => data.results[0],
    // The feature needn't change often, so don't refetch it for a day.
    staleTime: 1000 * 60 * 60 * 24,
  })
}
