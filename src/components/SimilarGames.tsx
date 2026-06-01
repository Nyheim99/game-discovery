import { useSimilarGames } from '@/hooks/useSimilarGames'
import GameCard from './GameCard'

interface Props {
  // The current game's primary genre (may be unknown) and its id, so it can be
  // excluded from its own "similar" list.
  genreId: number | undefined
  excludeId: number
}

// A small grid of games sharing this game's genre. Reuses GameCard, so each
// card keeps its favorite button and link for free.
function SimilarGames({ genreId, excludeId }: Props) {
  const { data: games } = useSimilarGames(genreId, excludeId)

  if (!games?.length) return null

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-xl font-semibold">Similar games</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

export default SimilarGames
