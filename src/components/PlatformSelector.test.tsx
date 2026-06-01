import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlatformSelector from './PlatformSelector'
import { usePlatforms } from '@/hooks/usePlatforms'

vi.mock('@/hooks/usePlatforms')

const platforms = [
  { id: 1, name: 'PC', slug: 'pc' },
  { id: 2, name: 'PlayStation', slug: 'playstation' },
]

function mockPlatforms(state: Partial<ReturnType<typeof usePlatforms>>) {
  vi.mocked(usePlatforms).mockReturnValue(
    state as ReturnType<typeof usePlatforms>,
  )
}

describe('PlatformSelector', () => {
  it('renders nothing when platforms fail to load', () => {
    mockPlatforms({ data: undefined, error: new Error('boom') })

    const { container } = render(
      <PlatformSelector selectedPlatformId={null} onSelectPlatform={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the selected platform as the current value', () => {
    mockPlatforms({ data: platforms, error: null })

    render(
      <PlatformSelector selectedPlatformId={2} onSelectPlatform={vi.fn()} />,
    )

    // value is a string in the DOM even though the prop is a number.
    expect(
      screen.getByRole('combobox', { name: 'Filter by platform' }),
    ).toHaveValue('2')
  })

  it('calls onSelectPlatform with a number when a platform is chosen', async () => {
    const user = userEvent.setup()
    const onSelectPlatform = vi.fn()
    mockPlatforms({ data: platforms, error: null })

    render(
      <PlatformSelector
        selectedPlatformId={null}
        onSelectPlatform={onSelectPlatform}
      />,
    )
    await user.selectOptions(screen.getByRole('combobox'), 'PlayStation')

    // The component converts the string value back to a number at the boundary.
    expect(onSelectPlatform).toHaveBeenCalledWith(2)
  })

  it('calls onSelectPlatform with null when "All platforms" is chosen', async () => {
    const user = userEvent.setup()
    const onSelectPlatform = vi.fn()
    mockPlatforms({ data: platforms, error: null })

    render(
      <PlatformSelector
        selectedPlatformId={1}
        onSelectPlatform={onSelectPlatform}
      />,
    )
    await user.selectOptions(screen.getByRole('combobox'), 'All platforms')

    expect(onSelectPlatform).toHaveBeenCalledWith(null)
  })
})
