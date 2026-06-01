import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import FavoritesPage from './FavoritesPage'
import { fetchGameDetails } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows an empty state when there are no favorites', () => {
    renderWithProviders(<FavoritesPage />)

    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument()
  })

  it('fetches and renders a card for each saved favorite id', async () => {
    // Seed the favorites the provider reads on mount.
    localStorage.setItem('favoriteGameIds', '[1]')
    vi.mocked(fetchGameDetails).mockResolvedValue({
      id: 1,
      slug: 'celeste',
      name: 'Celeste',
    } as Awaited<ReturnType<typeof fetchGameDetails>>)

    renderWithProviders(<FavoritesPage />)

    // findBy* waits for the parallel useQueries to resolve.
    expect(
      await screen.findByRole('heading', { name: 'Celeste' }),
    ).toBeInTheDocument()
    expect(fetchGameDetails).toHaveBeenCalledWith('1')
  })
})
