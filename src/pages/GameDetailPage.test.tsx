import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/test-utils'
import GameDetailPage from './GameDetailPage'
import { fetchGameDetails } from '@/services/api-client'

vi.mock('@/services/api-client')

// Spy on navigation so we can assert the Back button without a real history.
const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

type Details = Awaited<ReturnType<typeof fetchGameDetails>>

const fullGame: Details = {
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
}

function renderDetail() {
  return renderWithProviders(
    <Routes>
      <Route path="/games/:slug" element={<GameDetailPage />} />
    </Routes>,
    { route: '/games/celeste' },
  )
}

describe('GameDetailPage', () => {
  it('shows a loading skeleton while the request is in flight', () => {
    // A promise that never resolves keeps the query in its loading state.
    vi.mocked(fetchGameDetails).mockReturnValue(new Promise(() => {}))

    renderDetail()

    expect(screen.getByRole('status')).toHaveTextContent('Loading game…')
  })

  it('reads the slug from the URL and renders the fetched game', async () => {
    vi.mocked(fetchGameDetails).mockResolvedValue(fullGame)

    renderDetail()

    expect(
      await screen.findByRole('heading', { name: 'Celeste' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/mountain-climbing/i)).toBeInTheDocument()
    expect(screen.getByText('Released 2018-01-25')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /official website/i }),
    ).toHaveAttribute('href', 'https://www.celestegame.com')
  })

  it('omits optional sections when the data is missing', async () => {
    vi.mocked(fetchGameDetails).mockResolvedValue({
      ...fullGame,
      released: null,
      website: '',
      description_raw: '',
    })

    renderDetail()

    await screen.findByRole('heading', { name: 'Celeste' })
    expect(screen.queryByText(/released/i)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /official website/i }),
    ).not.toBeInTheDocument()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(fetchGameDetails).mockRejectedValue(new Error('boom'))

    renderDetail()

    expect(
      await screen.findByText(/couldn’t load this game/i),
    ).toBeInTheDocument()
  })

  it('goes back in history when the Back button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchGameDetails).mockResolvedValue(fullGame)

    renderDetail()
    await screen.findByRole('heading', { name: 'Celeste' })
    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(navigateMock).toHaveBeenCalledWith(-1)
  })
})
