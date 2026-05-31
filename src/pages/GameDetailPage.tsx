import { useNavigate, useParams } from 'react-router-dom'
import { useGameDetails } from '@/hooks/useGameDetails'
import CriticScore from '@/components/CriticScore'
import PlatformIconList from '@/components/PlatformIconList'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

function GameDetailPage() {
  // useParams reads the dynamic segment from the route "/games/:slug".
  // The "!" tells TypeScript "this is definitely present" — it always is,
  // because this page only renders when the URL matches that route.
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: game, isLoading, isError } = useGameDetails(slug!)

  if (isLoading) {
    return <p className="detail-status">Loading…</p>
  }

  if (isError || !game) {
    return <p className="detail-status">Couldn’t load this game.</p>
  }

  return (
    <article className="game-detail">
      {/* navigate(-1) goes back one entry in history — like the browser's
          back button — so the user returns to wherever they came from. */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <img
        className="game-detail-image"
        src={game.background_image || noImagePlaceholder}
        alt={game.name}
      />

      <h1>{game.name}</h1>

      <div className="game-detail-meta">
        <PlatformIconList platforms={game.parent_platforms} />
        {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
        {game.released ? <span>Released {game.released}</span> : null}
      </div>

      {game.description_raw ? (
        <p className="game-detail-description">{game.description_raw}</p>
      ) : null}

      {game.website ? (
        <a href={game.website} target="_blank" rel="noopener noreferrer">
          Official website ↗
        </a>
      ) : null}
    </article>
  )
}

export default GameDetailPage
