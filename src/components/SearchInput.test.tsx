import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SearchInput from './SearchInput'

const getInput = () => screen.getByRole('searchbox', { name: 'Search games' })

describe('SearchInput', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('seeds the field from the current search term', () => {
    render(<SearchInput searchText="halo" onSearch={vi.fn()} />)

    expect(getInput()).toHaveValue('halo')
  })

  it('searches as you type, but only after the debounce settles', () => {
    const onSearch = vi.fn()
    render(<SearchInput searchText="" onSearch={onSearch} />)

    fireEvent.change(getInput(), { target: { value: 'witcher' } })
    // Nothing fires immediately — it waits for the typing to pause.
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(400))
    expect(onSearch).toHaveBeenCalledWith('witcher')
  })

  it('searches immediately when submitted with Enter', () => {
    const onSearch = vi.fn()
    render(<SearchInput searchText="" onSearch={onSearch} />)

    fireEvent.change(getInput(), { target: { value: 'halo' } })
    fireEvent.submit(getInput().closest('form')!)

    // No need to wait for the debounce.
    expect(onSearch).toHaveBeenCalledWith('halo')
  })

  it('clears the field and searches immediately via the clear button', () => {
    const onSearch = vi.fn()
    render(<SearchInput searchText="witcher" onSearch={onSearch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(getInput()).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })

  it('syncs the field when the term changes externally (e.g. going home)', () => {
    const { rerender } = render(
      <SearchInput searchText="witcher" onSearch={vi.fn()} />,
    )
    expect(getInput()).toHaveValue('witcher')

    // The URL's search term is cleared from outside (not by typing here).
    rerender(<SearchInput searchText="" onSearch={vi.fn()} />)
    expect(getInput()).toHaveValue('')
  })

  it('has no clear button when the field is empty', () => {
    render(<SearchInput searchText="" onSearch={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })
})
