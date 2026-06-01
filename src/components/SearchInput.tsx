import { FiSearch } from 'react-icons/fi'

interface Props {
  onSearch: (searchText: string) => void
}

function SearchInput({ onSearch }: Props) {
  function handleSubmit(formData: FormData) {
    const searchText = formData.get('search')?.toString() ?? ''
    onSearch(searchText)
  }

  return (
    <form action={handleSubmit} role="search">
      <div className="relative">
        <FiSearch
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          name="search"
          type="search"
          placeholder="Search games…"
          aria-label="Search games"
          className="w-full rounded-xl border border-border bg-surface-2 py-3 pr-4 pl-11 text-text outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </form>
  )
}

export default SearchInput
