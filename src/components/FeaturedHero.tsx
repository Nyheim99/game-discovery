import { Link } from 'react-router-dom'
import FavoriteHeart from './FavoriteHeart'
import type { Game } from '@/services/api-client'
import { useFeaturedGame } from '@/hooks/useFeaturedGame'
import { useGameDetails } from '@/hooks/useGameDetails'
import { useFavorites } from '@/context/favorites-context'
import CriticScore from './CriticScore'
import PlatformIconList from './PlatformIconList'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

// The home page's headline: one standout game shown large.
function FeaturedHero() {
  const { data: game, isLoading } = useFeaturedGame()

  if (isLoading) return <FeaturedHeroSkeleton />
  // The hero is non-essential chrome — if it fails to load, just omit it
  // rather than show an error where a banner should be.
  if (!game) return null

  return <FeaturedHeroContent game={game} />
}

// Split into its own component so we can call useGameDetails with a *definite*
// slug. Hooks can't be called conditionally, so we only mount this once the
// featured game exists.
function FeaturedHeroContent({ game }: { game: Game }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  // Reuse the detail query (same cache key as the detail page) just to pull a
  // short description — and as a bonus this warms the cache, so clicking
  // "View details" opens instantly.
  const { data: details } = useGameDetails(game.slug)
  const favorite = isFavorite(game.id)

  return (
    <section
      aria-label="Featured game"
      className="relative overflow-hidden rounded-3xl border border-border"
    >
      <img
        src={game.background_image || noImagePlaceholder}
        alt={game.name}
        className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
      />
      {/* Left-to-right dark gradient keeps the overlaid text readable. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
          ★ Featured
        </span>
        <h1 className="font-display text-3xl font-bold text-white drop-shadow sm:text-5xl">
          {game.name}
        </h1>

        {details?.description_raw ? (
          <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/80">
            {details.description_raw}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
          <PlatformIconList platforms={game.parent_platforms} />
          <Link
            to={`/games/${game.slug}`}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View details
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
            aria-pressed={favorite}
            aria-label={
              favorite
                ? `Remove ${game.name} from wishlist`
                : `Add ${game.name} to wishlist`
            }
            onClick={() => toggleFavorite(game.id)}
          >
            <FavoriteHeart filled={favorite} filledClassName="text-rose-500" />
          </button>
        </div>
      </div>
    </section>
  )
}

// A space-reserving placeholder so the page below doesn't jump when the hero
// arrives (the same anti-layout-shift trick used for the genre list).
function FeaturedHeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[320px] w-full animate-pulse rounded-3xl bg-surface-2 sm:h-[380px] lg:h-[440px]"
    />
  )
}

export default FeaturedHero
