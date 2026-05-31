import { useGenres } from '@/hooks/useGenres'

interface Props {
  selectedGenreId: number | null
  onSelectGenre: (genreId: number | null) => void
}

// Shared button styling; the selected genre gets an unmistakable accent pill.
function itemClass(selected: boolean) {
  const base = 'w-full rounded-lg px-3 py-2 text-left text-sm transition'
  return selected
    ? `${base} bg-accent/15 font-semibold text-accent`
    : `${base} text-muted hover:bg-surface-2 hover:text-text`
}

function GenreList({ selectedGenreId, onSelectGenre }: Props) {
  const { data: genres, error, isLoading } = useGenres()

  // If genres fail to load, just hide the list rather than break the page.
  if (error) return null

  // Reserve the list's space while loading so the content below it doesn't
  // jump when the genres arrive (this was the main layout-shift culprit).
  if (isLoading) {
    return (
      <>
        <h2 className="mb-3 font-display text-lg font-semibold">Genres</h2>
        <ul className="space-y-1" aria-hidden="true">
          {Array.from({ length: 19 }, (_, i) => i).map((i) => (
            <li key={i} className="px-3 py-2">
              <div className="h-5 w-full animate-pulse rounded bg-surface-2" />
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <>
      <h2 className="mb-3 font-display text-lg font-semibold">Genres</h2>
      <ul className="space-y-1">
        <li>
          <button
            className={itemClass(selectedGenreId === null)}
            aria-pressed={selectedGenreId === null}
            onClick={() => onSelectGenre(null)}
          >
            All genres
          </button>
        </li>
        {genres?.map((genre) => (
          <li key={genre.id}>
            <button
              className={itemClass(genre.id === selectedGenreId)}
              aria-pressed={genre.id === selectedGenreId}
              onClick={() => onSelectGenre(genre.id)}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default GenreList
