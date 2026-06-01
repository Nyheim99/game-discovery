import { useQueries } from '@tanstack/react-query'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useFavorites } from '@/context/favorites-context'
import { fetchGameDetails } from '@/services/api-client'
import BackButton from '@/components/BackButton'
import GameCard from '@/components/GameCard'
import GameCardSkeleton from '@/components/GameCardSkeleton'

const skeletons = [1, 2, 3, 4, 5, 6]

// We only store favorite IDs, so to show cards we fetch each game by id.
// useQueries runs a *dynamic* list of queries (one per favorite) in parallel —
// useQuery can't do that because the number of favorites changes.
function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const reduce = useReducedMotion()
  // One object so the reduced-motion fork is a single branch.
  const cardMotion = reduce
    ? { exit: { opacity: 0 } }
    : { layout: true, exit: { opacity: 0, scale: 0.85 } }

  const results = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['game', String(id)],
      queryFn: () => fetchGameDetails(String(id)),
    })),
  })

  const heading = (
    <>
      <div className="mb-5">
        <BackButton />
      </div>
      <h1 className="mb-5 font-display text-2xl font-bold">Wishlist</h1>
    </>
  )

  if (favoriteIds.length === 0) {
    return (
      <section>
        {heading}
        <p className="text-muted">
          No games saved yet — tap the heart on any game to add it to your
          wishlist.
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
      {heading}
      {isLoading && games.length === 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {skeletons.map((skeleton) => (
            <GameCardSkeleton key={skeleton} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {/* AnimatePresence lets a removed game fade/scale out (and the rest
              slide up via layout) when it's unfavorited here. */}
          <AnimatePresence>
            {games.map((game) => (
              <motion.div
                key={game.id}
                {...cardMotion}
                transition={{ duration: 0.2 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
