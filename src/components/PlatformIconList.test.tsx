import { render, screen } from '@testing-library/react'
import PlatformIconList from './PlatformIconList'

describe('PlatformIconList', () => {
  it('renders nothing (no crash) when platforms is missing', () => {
    // RAWG omits parent_platforms for some games — this used to throw.
    const { container } = render(<PlatformIconList />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an icon per known platform', () => {
    render(
      <PlatformIconList
        platforms={[
          { platform: { id: 1, name: 'PC', slug: 'pc' } },
          { platform: { id: 2, name: 'PlayStation', slug: 'playstation' } },
        ]}
      />,
    )
    expect(screen.getByTitle('PC')).toBeInTheDocument()
    expect(screen.getByTitle('PlayStation')).toBeInTheDocument()
  })

  it('skips platforms it has no icon for', () => {
    render(
      <PlatformIconList
        platforms={[
          { platform: { id: 1, name: 'PC', slug: 'pc' } },
          // An unknown slug has no entry in the icon map and is dropped.
          { platform: { id: 99, name: 'Atari', slug: 'atari' } },
        ]}
      />,
    )

    expect(screen.getByTitle('PC')).toBeInTheDocument()
    expect(screen.queryByTitle('Atari')).not.toBeInTheDocument()
  })
})
