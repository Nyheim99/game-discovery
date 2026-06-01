import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

interface Props {
  searchText: string
  onSearch: (searchText: string) => void
}

const DEBOUNCE_MS = 400

function SearchInput({ searchText, onSearch }: Props) {
  // A controlled value so the typed text stays in the field (it used to clear
  // on submit). Seeded from the URL-derived searchText so a shared or refreshed
  // search still shows its term.
  const [value, setValue] = useState(searchText)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // The last term we pushed up. Lets us tell our own echo (the URL updating
  // because we searched) apart from an external change (e.g. clicking the logo
  // to go home), so we only overwrite the field for the latter.
  const lastReported = useRef(searchText)

  // Cancel any pending debounce if we unmount mid-type.
  useEffect(() => () => clearTimeout(timer.current), [])

  // Sync the field when the search term changes from outside this component.
  useEffect(() => {
    if (searchText !== lastReported.current) {
      lastReported.current = searchText
      setValue(searchText)
    }
  }, [searchText])

  function report(next: string) {
    lastReported.current = next
    onSearch(next)
  }

  // Report a search up to the parent — debounced while typing, immediate for
  // Enter and the clear button.
  function runSearch(next: string, immediate = false) {
    clearTimeout(timer.current)
    if (immediate) {
      report(next)
    } else {
      timer.current = setTimeout(() => report(next), DEBOUNCE_MS)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    setValue(next)
    runSearch(next)
  }

  function handleClear() {
    setValue('')
    runSearch('', true)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    runSearch(value, true)
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="relative">
        <FiSearch
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        />
        <input
          name="search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Search games…"
          aria-label="Search games"
          className="h-11 w-full rounded-xl border border-border bg-surface-2 pr-11 pl-11 text-text outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-border hover:text-text"
          >
            <FiX size={16} />
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default SearchInput
