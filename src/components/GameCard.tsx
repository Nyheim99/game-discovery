import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import type { Game } from '@/services/api-client'
import { useFavorites } from '@/context/favorites-context'
import CriticScore from './CriticScore'
import PlatformIconList from './PlatformIconList'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

interface Props {
  game: Game
}

function GameCard({ game }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(game.id)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/20">
      {/* Frosted favorite button. Sibling of the Link (an <a> can't wrap a
          <button>); z-10 keeps it clickable above the link overlay. */}
      <button
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-white"
        aria-pressed={favorite}
        aria-label={
          favorite
            ? `Remove ${game.name} from favorites`
            : `Add ${game.name} to favorites`
        }
        onClick={() => toggleFavorite(game.id)}
      >
        {favorite ? <FaHeart className="text-rose-500" /> : <FaRegHeart />}
      </button>

      <Link to={`/games/${game.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={game.background_image || noImagePlaceholder}
            alt={game.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <PlatformIconList platforms={game.parent_platforms} />
            {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
          </div>
          <h2 className="font-display text-lg font-semibold">{game.name}</h2>
        </div>
      </Link>
    </div>
  )
}

export default GameCard
