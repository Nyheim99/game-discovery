import { useEffect, useRef } from 'react'
import { useGames } from '@/hooks/useGames'
import type { GameQuery } from '@/services/api-client'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'

interface Props {
  gameQuery: GameQuery
}

// Enough placeholders to fill the full-width grid's first couple of rows while
// the real games load.
const skeletons = Array.from({ length: 12 }, (_, i) => i)

function GameGrid({ gameQuery }: Props) {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGames(gameQuery)

  // A reference to the invisible element at the bottom of the list.
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      // Start loading a bit before the sentinel is fully on screen.
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // `data.pages` is an array of page-responses; flatten them into one
  // list of games.
  const games = data?.pages.flatMap((page) => page.results) ?? []
  // Total number of matching games (RAWG sends this on each page).
  const totalCount = data?.pages[0]?.count ?? 0

  if (error)
    return (
      <p role="alert" className="py-10 text-center text-red-400">
        Error: {error.message}
      </p>
    )
  if (!isLoading && games.length === 0)
    return (
      <p role="status" className="py-10 text-center text-muted">
        No games found.
      </p>
    )

  return (
    <>
      {isLoading ? (
        <p className="sr-only" role="status">
          Loading games…
        </p>
      ) : (
        <p className="text-muted" role="status">
          {totalCount.toLocaleString()} games found
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {isLoading
          ? skeletons.map((skeleton) => <GameCardSkeleton key={skeleton} />)
          : games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
      </div>

      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex min-h-10 justify-center py-6 text-muted"
        >
          {isFetchingNextPage && <p role="status">Loading more…</p>}
        </div>
      )}
    </>
  )
}

export default GameGrid
