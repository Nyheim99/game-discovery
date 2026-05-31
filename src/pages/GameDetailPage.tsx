import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { useGameDetails } from '@/hooks/useGameDetails'
import CriticScore from '@/components/CriticScore'
import GameDetailSkeleton from '@/components/GameDetailSkeleton'
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
    return (
      <>
        <p className="sr-only" role="status">
          Loading game…
        </p>
        <GameDetailSkeleton />
      </>
    )
  }

  if (isError || !game) {
    return (
      <p className="py-16 text-center text-muted">Couldn’t load this game.</p>
    )
  }

  return (
    <article className="mx-auto max-w-4xl">
      {/* navigate(-1) goes back one entry in history — like the browser's
          back button — so the user returns to wherever they came from. */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium transition hover:bg-border"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      {/* Hero: image with a dark gradient so the overlaid title stays legible. */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={game.background_image || noImagePlaceholder}
          alt={game.name}
          className="h-64 w-full object-cover sm:h-80 md:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <h1 className="absolute right-6 bottom-4 left-6 font-display text-3xl font-bold text-white md:text-4xl">
          {game.name}
        </h1>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-muted">
        <PlatformIconList platforms={game.parent_platforms} />
        {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
        {game.released ? (
          <span className="text-sm">Released {game.released}</span>
        ) : null}
      </div>

      {game.description_raw ? (
        <p className="mt-5 max-w-3xl leading-relaxed whitespace-pre-line text-text/90">
          {game.description_raw}
        </p>
      ) : null}

      {game.website ? (
        <a
          href={game.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-medium text-accent hover:underline"
        >
          Official website ↗
        </a>
      ) : null}
    </article>
  )
}

export default GameDetailPage
