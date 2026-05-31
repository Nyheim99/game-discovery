interface Props {
  onSearch: (searchText: string) => void
}

function SearchInput({ onSearch }: Props) {
  function handleSubmit(formData: FormData) {
    const searchText = formData.get('search')?.toString() ?? ''
    onSearch(searchText)
  }

  return (
    <form action={handleSubmit} className="search-form" role="search">
      <input
        name="search"
        type="search"
        placeholder="Search games…"
        className="search-input"
        aria-label="Search games"
      />
    </form>
  )
}

export default SearchInput
