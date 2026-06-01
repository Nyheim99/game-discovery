import { useGenres } from '@/hooks/useGenres'

interface Props {
  selectedGenreId: number | null
  onSelectGenre: (genreId: number | null) => void
}

// Shared pill styling; the selected genre gets an unmistakable accent fill.
function pillClass(selected: boolean) {
  const base =
    'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition'
  return selected
    ? `${base} border-accent bg-accent text-white`
    : `${base} border-border bg-surface text-muted hover:border-accent/40 hover:text-text`
}

function GenreList({ selectedGenreId, onSelectGenre }: Props) {
  const { data: genres, error, isLoading } = useGenres()

  // If genres fail to load, just hide the bar rather than break the page.
  if (error) return null

  // Reserve the bar's space while loading so the content below it doesn't jump
  // when the genres arrive.
  if (isLoading) {
    return (
      <section>
        <h2 className="sr-only">Genres</h2>
        <div
          className="no-scrollbar flex gap-2 overflow-x-auto pb-1"
          aria-hidden="true"
        >
          {Array.from({ length: 12 }, (_, i) => i).map((i) => (
            <div
              key={i}
              className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-surface-2"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <nav aria-label="Genres">
      <h2 className="sr-only">Genres</h2>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <li>
          <button
            className={pillClass(selectedGenreId === null)}
            aria-pressed={selectedGenreId === null}
            onClick={() => onSelectGenre(null)}
          >
            All genres
          </button>
        </li>
        {genres?.map((genre) => (
          <li key={genre.id}>
            <button
              className={pillClass(genre.id === selectedGenreId)}
              aria-pressed={genre.id === selectedGenreId}
              onClick={() => onSelectGenre(genre.id)}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default GenreList
