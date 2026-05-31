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
      <img src={game.background_image || noImagePlaceholder} alt={game.name} />
      <div className="game-card-body">
        <div className="game-card-meta">
          <PlatformIconList platforms={game.parent_platforms} />
          {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
        </div>
        <h2>{game.name}</h2>
      </div>
    </div>
  )
}

export default GameCard
