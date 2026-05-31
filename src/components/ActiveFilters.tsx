import type { GameQuery } from '@/services/api-client'
import { useGenres } from '@/hooks/useGenres'
import { usePlatforms } from '@/hooks/usePlatforms'

interface Props {
  gameQuery: GameQuery
  onClearSearch: () => void
  onClearGenre: () => void
  onClearPlatform: () => void
}

interface Chip {
  label: string
  onRemove: () => void
}

function ActiveFilters({
  gameQuery,
  onClearSearch,
  onClearGenre,
  onClearPlatform,
}: Props) {
  const { data: genres } = useGenres()
  const { data: platforms } = usePlatforms()

  // Look up human-readable names for the selected ids.
  const genreName = genres?.find((g) => g.id === gameQuery.genreId)?.name
  const platformName = platforms?.find(
    (p) => p.id === gameQuery.platformId,
  )?.name

  // Build the list of chips to show from whatever filters are active.
  const chips: Chip[] = []
  if (gameQuery.searchText) {
    chips.push({
      label: `Search: ${gameQuery.searchText}`,
      onRemove: onClearSearch,
    })
  }
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
    <ul className="active-filters">
      {chips.map((chip) => (
        <li key={chip.label} className="filter-chip">
          {chip.label}
          <button
            type="button"
            aria-label={`Remove filter: ${chip.label}`}
            onClick={chip.onRemove}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ActiveFilters
