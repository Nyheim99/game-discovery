import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FiX } from 'react-icons/fi'
import type { GameQuery } from '@/services/api-client'
import { useGenres } from '@/hooks/useGenres'
import { usePlatforms } from '@/hooks/usePlatforms'

interface Props {
  gameQuery: GameQuery
  onClearGenre: () => void
  onClearPlatform: () => void
}

interface Chip {
  label: string
  onRemove: () => void
}

function ActiveFilters({ gameQuery, onClearGenre, onClearPlatform }: Props) {
  const { data: genres } = useGenres()
  const { data: platforms } = usePlatforms()
  const reduce = useReducedMotion()
  // One object so the reduced-motion fork is a single branch.
  const chipMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        layout: true,
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }

  // Look up human-readable names for the selected ids.
  const genreName = genres?.find((g) => g.id === gameQuery.genreId)?.name
  const platformName = platforms?.find(
    (p) => p.id === gameQuery.platformId,
  )?.name

  // Build the list of chips to show from whatever filters are active. (Search
  // isn't shown here — the search box keeps its own term and clear button.)
  const chips: Chip[] = []
  if (genreName) {
    chips.push({ label: `Genre: ${genreName}`, onRemove: onClearGenre })
  }
  if (platformName) {
    chips.push({
      label: `Platform: ${platformName}`,
      onRemove: onClearPlatform,
    })
  }

  if (chips.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {/* initial={false} so chips already present on first render don't animate
          — only ones added/removed afterwards do. */}
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.li
            key={chip.label}
            {...chipMotion}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 rounded-full bg-surface-2 py-1 pr-1.5 pl-3 text-sm"
          >
            {chip.label}
            <button
              type="button"
              aria-label={`Remove filter: ${chip.label}`}
              onClick={chip.onRemove}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted transition hover:bg-border hover:text-text"
            >
              <FiX size={14} />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export default ActiveFilters
