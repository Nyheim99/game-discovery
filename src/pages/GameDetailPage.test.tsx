import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/test-utils'
import GameDetailPage from './GameDetailPage'
import {
  fetchGameDetails,
  fetchScreenshots,
  fetchGameStores,
} from '@/services/api-client'

vi.mock('@/services/api-client')

// The detail page also renders the gallery and "where to buy" sections; keep
// their data empty so these tests stay focused on the details.
beforeEach(() => {
  vi.mocked(fetchScreenshots).mockResolvedValue([])
  vi.mocked(fetchGameStores).mockResolvedValue([])
})

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
    expect(screen.getByText('2018-01-25')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /official website/i }),
    ).toHaveAttribute('href', 'https://www.celestegame.com')
  })

  it('falls back to placeholder facts, but still hides truly optional sections', async () => {
    vi.mocked(fetchGameDetails).mockResolvedValue({
      ...fullGame,
      released: null,
      website: '',
      description_raw: '',
    })

    renderDetail()

    await screen.findByRole('heading', { name: 'Celeste' })
    // Facts always render a row; missing values fall back rather than vanish.
    expect(screen.getByText('Release date')).toBeInTheDocument()
    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0)
    expect(screen.getByText('Not rated')).toBeInTheDocument()
    // The website link, though, is still hidden when there's no URL.
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

  it('lists the genres and other facts, and lets you favorite the game', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchGameDetails).mockResolvedValue({
      ...fullGame,
      genres: [{ id: 4, name: 'Platformer', slug: 'platformer' }],
      developers: [
        { id: 1, name: 'Maddy Makes Games', slug: 'mmg' },
        { id: 2, name: 'Extremely OK', slug: 'eok' },
      ],
      publishers: [{ id: 3, name: 'Some Publisher', slug: 'some-publisher' }],
      esrb_rating: { id: 1, name: 'Everyone 10+', slug: 'everyone-10-plus' },
      tags: [
        { id: 7, name: 'Singleplayer', slug: 'singleplayer', language: 'eng' },
        { id: 8, name: 'Одиночная', slug: 'odinochnaya', language: 'rus' },
      ],
    })

    renderDetail()

    expect(await screen.findByText('Platformer')).toBeInTheDocument()
    // Plural vs singular labels, plus the other API facts.
    expect(screen.getByText('Developers')).toBeInTheDocument()
    expect(screen.getByText('Publisher')).toBeInTheDocument()
    expect(screen.getByText('Some Publisher')).toBeInTheDocument()
    expect(screen.getByText('Everyone 10+')).toBeInTheDocument()
    // English tags show; non-English ones are filtered out.
    expect(screen.getByText('Singleplayer')).toBeInTheDocument()
    expect(screen.queryByText('Одиночная')).not.toBeInTheDocument()

    // Toggling favorite flips the button's label.
    await user.click(screen.getByRole('button', { name: /add to wishlist/i }))
    expect(
      screen.getByRole('button', { name: /in wishlist/i }),
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
