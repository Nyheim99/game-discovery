import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortSelector from './SortSelector'

describe('SortSelector', () => {
  it('reflects the current sortOrder as the selected option', () => {
    render(<SortSelector sortOrder="-metacritic" onChangeSortOrder={vi.fn()} />)

    // A controlled <select> shows the option whose value matches the prop.
    const select = screen.getByRole('combobox', { name: 'Order games by' })
    expect(select).toHaveValue('-metacritic')
  })

  it('calls onChangeSortOrder with the chosen option value', async () => {
    const user = userEvent.setup()
    const onChangeSortOrder = vi.fn()
    render(<SortSelector sortOrder="" onChangeSortOrder={onChangeSortOrder} />)

    // Pick by the visible option label; the handler receives the value behind it.
    await user.selectOptions(
      screen.getByRole('combobox'),
      'Order by: Average rating',
    )

    expect(onChangeSortOrder).toHaveBeenCalledWith('-rating')
  })
})
