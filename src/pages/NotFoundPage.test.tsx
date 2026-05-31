import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  it('shows a 404 message and a link home', () => {
    renderWithProviders(<NotFoundPage />)

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to games/i }),
    ).toHaveAttribute('href', '/')
  })
})
