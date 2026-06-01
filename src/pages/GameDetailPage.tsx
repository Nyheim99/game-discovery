import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useGameDetails } from '@/hooks/useGameDetails'
import { useFavorites } from '@/context/favorites-context'
import CriticScore from '@/components/CriticScore'
import GameDetailSkeleton from '@/components/GameDetailSkeleton'
import GameMediaGallery from '@/components/GameMediaGallery'
import PlatformIconList from '@/components/PlatformIconList'
import RatingBreakdown from '@/components/RatingBreakdown'
import SimilarGames from '@/components/SimilarGames'
import WhereToBuy from '@/components/WhereToBuy'

function GameDetailPage() {
  // useParams reads the dynamic segment from the route "/games/:slug".
  // The "!" tells TypeScript "this is definitely present" — it always is,
  // because this page only renders when the URL matches that route.
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
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

  const favorite = isFavorite(game.id)

  // Derive the simple label/value facts from whatever the API gave us, so the
  // info card just maps over a list instead of repeating markup per field.
  const facts: { label: string; value: string }[] = []
  if (game.released) facts.push({ label: 'Release date', value: game.released })
  if (game.developers?.length)
    facts.push({
      label: game.developers.length > 1 ? 'Developers' : 'Developer',
      value: game.developers.map((d) => d.name).join(', '),
    })
  if (game.publishers?.length)
    facts.push({
      label: game.publishers.length > 1 ? 'Publishers' : 'Publisher',
      value: game.publishers.map((p) => p.name).join(', '),
    })
  if (game.esrb_rating)
    facts.push({ label: 'ESRB', value: game.esrb_rating.name })

  // RAWG returns tags in many languages; keep the English ones and cap the list.
  const tags =
    game.tags?.filter((tag) => tag.language === 'eng').slice(0, 12) ?? []

  return (
    <article>
      {/* navigate(-1) goes back one entry in history — like the browser's
          back button — so the user returns to wherever they came from. */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium transition hover:bg-border"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      {/* Main column (gallery + description) on the left, info sidebar on the
          right. items-start so the columns align at the top and each sizes to
          its own content, rather than being stretched to match. */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <GameMediaGallery
            slug={game.slug}
            name={game.name}
            coverImage={game.background_image}
          />

          {game.description_raw ? (
            <p className="leading-relaxed whitespace-pre-line text-text/90">
              {game.description_raw}
            </p>
          ) : null}
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6">
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">
                {game.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-muted">
                {game.metacritic ? (
                  <CriticScore score={game.metacritic} />
                ) : null}
                <PlatformIconList platforms={game.parent_platforms} />
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs tracking-wide text-muted uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-medium">{fact.value}</dd>
                </div>
              ))}

              {game.genres?.length ? (
                <div className="col-span-2">
                  <dt className="text-xs tracking-wide text-muted uppercase">
                    Genres
                  </dt>
                  <dd className="mt-1">
                    <ul className="flex flex-wrap gap-2">
                      {game.genres.map((genre) => (
                        <li
                          key={genre.id}
                          className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs"
                        >
                          {genre.name}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}

              {tags.length ? (
                <div className="col-span-2">
                  <dt className="text-xs tracking-wide text-muted uppercase">
                    Tags
                  </dt>
                  <dd className="mt-1">
                    <ul className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <li
                          key={tag.id}
                          className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted"
                        >
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="flex flex-col gap-3">
              {game.website ? (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center font-medium text-accent hover:underline"
                >
                  Official website ↗
                </a>
              ) : null}

              <button
                onClick={() => toggleFavorite(game.id)}
                aria-pressed={favorite}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {favorite ? <FaHeart /> : <FaRegHeart />}
                {favorite ? 'In favorites' : 'Add to favorites'}
              </button>
            </div>
          </div>

          <RatingBreakdown ratings={game.ratings} />
          <WhereToBuy slug={game.slug} stores={game.stores} />
        </aside>
      </div>

      <SimilarGames genreId={game.genres?.[0]?.id} excludeId={game.id} />
    </article>
  )
}

export default GameDetailPage
