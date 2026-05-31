import type { Game } from '@/services/api-client'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

interface Props {
  game: Game
}

function GameCard({ game }: Props) {
  return (
    <div className="game-card">
      <img src={game.background_image || noImagePlaceholder} alt={game.name} />
      <h2>{game.name}</h2>
    </div>
  )
}

export default GameCard
