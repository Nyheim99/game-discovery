import { Link } from 'react-router-dom'
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
    <div className="game-card">
      {/* The favorite button is a sibling of the Link (not nested inside it):
          an <a> may not contain a <button>. */}
      <button
        className="favorite-button"
        aria-pressed={favorite}
        aria-label={
          favorite
            ? `Remove ${game.name} from favorites`
            : `Add ${game.name} to favorites`
        }
        onClick={() => toggleFavorite(game.id)}
      >
        {favorite ? '★' : '☆'}
      </button>
      {/* Link renders an <a> but intercepts the click to navigate without a
          full page reload. */}
      <Link to={`/games/${game.slug}`} className="game-card-link">
        <img
          src={game.background_image || noImagePlaceholder}
          alt={game.name}
        />
        <div className="game-card-body">
          <div className="game-card-meta">
            <PlatformIconList platforms={game.parent_platforms} />
            {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
          </div>
          <h2>{game.name}</h2>
        </div>
      </Link>
    </div>
  )
}

export default GameCard
