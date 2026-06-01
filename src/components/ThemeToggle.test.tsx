import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  // ThemeProvider remembers the choice in localStorage; clear it so every test
  // starts from the OS default (our matchMedia stub reports light).
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts in light mode, offering to switch to dark', () => {
    renderWithProviders(<ThemeToggle />)

    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    ).toBeInTheDocument()
  })

  it('switches to dark mode when clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeToggle />)

    await user.click(screen.getByRole('button'))

    // After toggling, the button now offers the *opposite* action.
    expect(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    ).toBeInTheDocument()
  })

  it('toggles back to light mode on a second click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button)
    await user.click(button)

    expect(button).toHaveAccessibleName('Switch to dark mode')
  })
})
