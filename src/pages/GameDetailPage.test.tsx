import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/test-utils'
import GameDetailPage from './GameDetailPage'

// Mock the API so the test doesn't hit the real RAWG network.
vi.mock('@/services/api-client', () => ({
  fetchGameDetails: vi.fn().mockResolvedValue({
    id: 1,
    slug: 'celeste',
    name: 'Celeste',
    background_image: '',
    metacritic: 92,
    rating: 4.5,
    parent_platforms: [],
    description_raw: 'A mountain-climbing platformer.',
    released: '2018-01-25',
    website: 'https://www.celestegame.com',
  }),
}))

describe('GameDetailPage', () => {
  it('reads the slug from the URL and renders the fetched game', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/games/:slug" element={<GameDetailPage />} />
      </Routes>,
      { route: '/games/celeste' },
    )

    // findBy* waits for the async query to resolve.
    expect(
      await screen.findByRole('heading', { name: 'Celeste' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/mountain-climbing/i)).toBeInTheDocument()
  })
})
