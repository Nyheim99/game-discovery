import { fireEvent, render, screen } from '@testing-library/react'
import BackToTop from './BackToTop'

describe('BackToTop', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('appears after scrolling down and scrolls to top when clicked', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(<BackToTop />)
    // Hidden at the top of the page.
    expect(
      screen.queryByRole('button', { name: 'Back to top' }),
    ).not.toBeInTheDocument()

    // Scroll down past the threshold.
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true })
    fireEvent.scroll(window)

    const button = await screen.findByRole('button', { name: 'Back to top' })
    fireEvent.click(button)
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))

    scrollTo.mockRestore()
  })
})
