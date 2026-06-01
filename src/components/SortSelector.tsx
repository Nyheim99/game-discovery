import { FiChevronDown } from 'react-icons/fi'

interface Props {
  sortOrder: string
  onChangeSortOrder: (sortOrder: string) => void
}

// The empty value is the default "Popular" feed; fetchGames maps "no sort" to
// most-added among recent releases, so that's what this option means (and it
// leaves the ordering param off for a clean URL). "-added" is the same
// popularity metric without the recency window — the all-time evergreens. The
// rest are plain RAWG ordering params. (Release-date and Name sorts were
// dropped — RAWG surfaces unreleased shovelware for the former and non-Latin
// titles for the latter.)
const sortOptions = [
  { value: '', label: 'Popular' },
  { value: '-added', label: 'Most added (all-time)' },
  { value: '-metacritic', label: 'Metacritic' },
  { value: '-rating', label: 'Average rating' },
]

function SortSelector({ sortOrder, onChangeSortOrder }: Props) {
  return (
    // appearance-none hides the browser's cramped native arrow so we can draw
    // our own with proper spacing (pr-9 leaves room for it).
    <div className="relative">
      <select
        className="h-11 cursor-pointer appearance-none rounded-lg border border-border bg-surface-2 pr-9 pl-3 text-sm text-text outline-none transition focus:border-accent"
        aria-label="Order games by"
        value={sortOrder}
        onChange={(event) => onChangeSortOrder(event.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Order by: {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown
        size={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
    </div>
  )
}

export default SortSelector
