import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import SimilarGames from './SimilarGames'
import { useSimilarGames } from '@/hooks/useSimilarGames'
import type { Game } from '@/services/api-client'

vi.mock('@/hooks/useSimilarGames')

function mockSimilar(data: unknown) {
  vi.mocked(useSimilarGames).mockReturnValue({
    data,
  } as unknown as ReturnType<typeof useSimilarGames>)
}

const games = [
  { id: 1, slug: 'hades', name: 'Hades' },
  { id: 2, slug: 'celeste', name: 'Celeste' },
] as Game[]

describe('SimilarGames', () => {
  it('renders nothing when there are no similar games', () => {
    mockSimilar([])

    const { container } = renderWithProviders(
      <SimilarGames genreId={4} excludeId={9} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a card for each similar game', () => {
    mockSimilar(games)

    renderWithProviders(<SimilarGames genreId={4} excludeId={9} />)

    expect(
      screen.getByRole('heading', { name: 'Similar games' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hades' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Celeste' })).toBeInTheDocument()
  })
})
