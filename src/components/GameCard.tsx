import type { Game } from '@/services/api-client'
import { useFavorites } from '@/context/favorites-context'
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
      <h2>{game.name}</h2>
    </div>
  )
}

export default GameCard
