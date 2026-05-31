import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchInput from './SearchInput'

describe('SearchInput', () => {
  it('calls onSearch with the typed text when submitted', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox', { name: 'Search games' })
    await user.type(input, 'witcher{enter}')

    expect(onSearch).toHaveBeenCalledWith('witcher')
  })

  it('does not call onSearch until submitted', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    // Typing alone should not trigger a search (it happens on submit).
    await user.type(
      screen.getByRole('searchbox', { name: 'Search games' }),
      'halo',
    )

    expect(onSearch).not.toHaveBeenCalled()
  })
})
