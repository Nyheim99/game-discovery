import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GenreList from './GenreList'
import { useGenres } from '@/hooks/useGenres'

vi.mock('@/hooks/useGenres')

const genres = [
  { id: 4, name: 'Action', image_background: '' },
  { id: 5, name: 'RPG', image_background: '' },
]

// Helper to set what the mocked useGenres returns for a given test.
function mockGenres(state: Partial<ReturnType<typeof useGenres>>) {
  vi.mocked(useGenres).mockReturnValue(state as ReturnType<typeof useGenres>)
}

describe('GenreList', () => {
  it('renders a loading skeleton while genres load', () => {
    mockGenres({ data: undefined, error: null, isLoading: true })

    render(<GenreList selectedGenreId={null} onSelectGenre={vi.fn()} />)

    // The heading shows, but no real genre buttons yet.
    expect(screen.getByRole('heading', { name: 'Genres' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Action' }),
    ).not.toBeInTheDocument()
  })

  it('renders nothing when genres fail to load', () => {
    mockGenres({ data: undefined, error: new Error('boom'), isLoading: false })

    const { container } = render(
      <GenreList selectedGenreId={null} onSelectGenre={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a button per genre plus an "All genres" reset', () => {
    mockGenres({ data: genres, error: null, isLoading: false })

    render(<GenreList selectedGenreId={null} onSelectGenre={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'All genres' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'RPG' })).toBeInTheDocument()
  })

  it('marks the selected genre as pressed', () => {
    mockGenres({ data: genres, error: null, isLoading: false })

    render(<GenreList selectedGenreId={4} onSelectGenre={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'All genres' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('calls onSelectGenre with the id when a genre is clicked', async () => {
    const user = userEvent.setup()
    const onSelectGenre = vi.fn()
    mockGenres({ data: genres, error: null, isLoading: false })

    render(<GenreList selectedGenreId={null} onSelectGenre={onSelectGenre} />)
    await user.click(screen.getByRole('button', { name: 'RPG' }))

    expect(onSelectGenre).toHaveBeenCalledWith(5)
  })

  it('calls onSelectGenre with null when "All genres" is clicked', async () => {
    const user = userEvent.setup()
    const onSelectGenre = vi.fn()
    mockGenres({ data: genres, error: null, isLoading: false })

    render(<GenreList selectedGenreId={4} onSelectGenre={onSelectGenre} />)
    await user.click(screen.getByRole('button', { name: 'All genres' }))

    expect(onSelectGenre).toHaveBeenCalledWith(null)
  })
})
