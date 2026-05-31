import { useEffect, useRef } from 'react'
import { useGames } from '../hooks/useGames'
import type { GameQuery } from '../services/api-client'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'

interface Props {
  gameQuery: GameQuery
}

const skeletons = [1, 2, 3, 4, 5, 6]

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

  if (error) return <p>Error: {error.message}</p>
  if (!isLoading && games.length === 0) return <p>No games found.</p>

  return (
    <>
      <div className="game-grid">
        {isLoading
          ? skeletons.map((skeleton) => <GameCardSkeleton key={skeleton} />)
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>

      {hasNextPage && (
        <div ref={sentinelRef} className="load-more-sentinel">
          {isFetchingNextPage && <p>Loading more…</p>}
        </div>
      )}
    </>
  )
}

export default GameGrid
