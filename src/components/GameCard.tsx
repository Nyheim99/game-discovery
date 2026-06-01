import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import type { Game } from '@/services/api-client'
import { getCroppedImageUrl } from '@/services/image-url'
import { useFavorites } from '@/context/favorites-context'
import CriticScore from './CriticScore'
import FavoriteHeart from './FavoriteHeart'
import PlatformIconList from './PlatformIconList'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

interface Props {
  game: Game
  // Position in the grid, used to stagger the entrance animation.
  index?: number
}

function GameCard({ game, index = 0 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(game.id)
  // Honour the OS "reduce motion" setting: a plain fade, no movement. One
  // object so the fork is a single branch. Framer owns the transform (entrance
  // + hover lift + tap), so the lift moved off CSS to avoid the two fighting
  // over `transform`; border/shadow stay as CSS transitions.
  const reduce = useReducedMotion()
  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.25 },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, delay: Math.min(index, 10) * 0.03 },
        whileHover: { y: -4 },
        whileTap: { scale: 0.99 },
      }

  return (
    <motion.div
      {...motionProps}
      className="group relative h-full overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/20"
    >
      {/* Frosted favorite button. Sibling of the Link (an <a> can't wrap a
          <button>); z-10 keeps it clickable above the link overlay. */}
      <button
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-white"
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

      <Link to={`/games/${game.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={
              game.background_image
                ? getCroppedImageUrl(game.background_image)
                : noImagePlaceholder
            }
            alt={game.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <PlatformIconList platforms={game.parent_platforms} />
            {game.metacritic ? <CriticScore score={game.metacritic} /> : null}
          </div>
          {/* Clamp to two lines and reserve that height so every card is the
              same height regardless of title length. */}
          <h2 className="line-clamp-2 min-h-[3.5rem] font-display text-lg font-semibold">
            {game.name}
          </h2>
        </div>
      </Link>
    </motion.div>
  )
}

export default GameCard
