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
        <h1 className="mb-5 font-display text-2xl font-bold">Favorites</h1>
        <p className="text-muted">
          No favorites yet — tap the heart on any game to save it here.
        </p>
      </section>
    )
  }

  // Keep only the queries that have loaded; flatMap drops the not-yet-ready
  // ones (TS narrows `game` to a real value because we filter out undefined).
  const games = results.flatMap((result) => (result.data ? [result.data] : []))
  const isLoading = results.some((result) => result.isLoading)

  return (
    <section>
      <h1 className="mb-5 font-display text-2xl font-bold">Favorites</h1>
      {isLoading && games.length === 0 ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
