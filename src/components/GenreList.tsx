import { useGenres } from '../hooks/useGenres'

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
    <ul className="genre-list">
      <li key={0}>
        <button
          className={selectedGenreId === null ? 'selected' : ''}
          onClick={() => onSelectGenre(null)}
        >
          All genres
        </button>
      </li>
      {genres?.map((genre) => (
        <li key={genre.id}>
          <button
            className={genre.id === selectedGenreId ? 'selected' : ''}
            onClick={() => onSelectGenre(genre.id)}
          >
            {genre.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default GenreList
