import { FiChevronDown } from 'react-icons/fi'

interface Props {
  sortOrder: string
  onChangeSortOrder: (sortOrder: string) => void
}

const sortOptions = [
  { value: '', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: '-released', label: 'Release date' },
  { value: '-metacritic', label: 'Popularity' },
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
