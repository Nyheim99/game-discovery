import { render, screen } from '@testing-library/react'
import WhereToBuy from './WhereToBuy'
import { useGameStores } from '@/hooks/useGameStores'
import type { NamedEntity } from '@/services/api-client'

vi.mock('@/hooks/useGameStores')

function mockLinks(data: unknown) {
  vi.mocked(useGameStores).mockReturnValue({
    data,
  } as unknown as ReturnType<typeof useGameStores>)
}

const stores: { store: NamedEntity }[] = [
  { store: { id: 1, name: 'Steam', slug: 'steam' } },
  { store: { id: 5, name: 'GOG', slug: 'gog' } },
]

describe('WhereToBuy', () => {
  it('renders nothing when the game lists no stores', () => {
    mockLinks([])

    const { container } = render(
      <WhereToBuy slug="celeste" stores={undefined} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when no store has a matching buy link', () => {
    // Stores are listed, but the URLs haven't loaded (or none matched).
    mockLinks(undefined)

    const { container } = render(<WhereToBuy slug="celeste" stores={stores} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('links each store that has a matching buy URL', () => {
    // Only Steam (id 1) has a URL; GOG (id 5) has none, so it's dropped.
    mockLinks([{ store_id: 1, url: 'https://steam/celeste' }])

    render(<WhereToBuy slug="celeste" stores={stores} />)

    const link = screen.getByRole('link', { name: /steam/i })
    expect(link).toHaveAttribute('href', 'https://steam/celeste')
    expect(screen.queryByRole('link', { name: /gog/i })).not.toBeInTheDocument()
  })
})
