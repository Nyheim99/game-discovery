import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchGames, type GameQuery } from '../services/api-client'

export function useGames(gameQuery: GameQuery) {
  return useInfiniteQuery({
    queryKey: ['games', gameQuery],
    queryFn: ({ pageParam }) => fetchGames(gameQuery, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If RAWG says there's a `next` page, the next page number is
      // simply how many pages we've loaded so far, plus one.
      return lastPage.next ? allPages.length + 1 : undefined
    },
  })
}
