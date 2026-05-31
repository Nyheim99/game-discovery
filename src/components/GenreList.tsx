import { useGenres } from '@/hooks/useGenres'

interface Props {
  selectedGenreId: number | null
  onSelectGenre: (genreId: number | null) => void
}

function GenreList({ selectedGenreId, onSelectGenre }: Props) {
  const { data: genres, error, isLoading } = useGenres()

  // If genres fail to load, just hide the list rather than break the page.
  if (error) return null
  if (isLoading) return <p>Loading genres…</p>

  return (
    <>
      <h2 className="sidebar-heading">Genres</h2>
      <ul className="genre-list">
        <li>
          <button
            className={selectedGenreId === null ? 'selected' : ''}
            aria-pressed={selectedGenreId === null}
            onClick={() => onSelectGenre(null)}
          >
            All genres
          </button>
        </li>
        {genres?.map((genre) => (
          <li key={genre.id}>
            <button
              className={genre.id === selectedGenreId ? 'selected' : ''}
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
