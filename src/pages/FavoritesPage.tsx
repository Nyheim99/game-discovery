import { useQueries } from '@tanstack/react-query'
import { useFavorites } from '@/context/favorites-context'
import { fetchGameDetails } from '@/services/api-client'
import GameCard from '@/components/GameCard'

// We only store favorite IDs, so to show cards we fetch each game by id.
// useQueries runs a *dynamic* list of queries (one per favorite) in parallel —
// useQuery can't do that because the number of favorites changes.
function FavoritesPage() {
  const { favoriteIds } = useFavorites()

  const results = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['game', String(id)],
      queryFn: () => fetchGameDetails(String(id)),
    })),
  })

  if (favoriteIds.length === 0) {
    return (
      <section>
        <h2>Favorites</h2>
        <p>No favorites yet. Tap the ☆ on a game to save it here.</p>
      </section>
    )
  }

  // Keep only the queries that have loaded; flatMap drops the not-yet-ready
  // ones (TS narrows `game` to a real value because we filter out undefined).
  const games = results.flatMap((result) => (result.data ? [result.data] : []))
  const isLoading = results.some((result) => result.isLoading)

  return (
    <section>
      <h2>Favorites</h2>
      {isLoading && games.length === 0 ? (
        <p>Loading…</p>
      ) : (
        <div className="game-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
