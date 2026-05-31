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
    <select
      className="sort-selector"
      value={sortOrder}
      onChange={(event) => onChangeSortOrder(event.target.value)}
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          Order by: {option.label}
        </option>
      ))}
    </select>
  )
}

export default SortSelector
