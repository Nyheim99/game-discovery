import { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameMediaGallery from './GameMediaGallery'
import { useScreenshots } from '@/hooks/useScreenshots'

vi.mock('@/hooks/useScreenshots')

function mockScreenshots(data: unknown) {
  vi.mocked(useScreenshots).mockReturnValue({
    data,
  } as unknown as ReturnType<typeof useScreenshots>)
}

// The large viewer image is the one labelled with the game name.
const mainSrc = () =>
  screen.getByRole('img', { name: 'Celeste' }).getAttribute('src')

describe('GameMediaGallery', () => {
  it('shows just the cover and no controls when there are no screenshots', () => {
    mockScreenshots([])

    render(
      <GameMediaGallery slug="celeste" name="Celeste" coverImage="cover.jpg" />,
    )

    expect(mainSrc()).toBe('cover.jpg')
    // Only the cover exists, so there's nothing to switch between.
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('navigates with the arrows and thumbnails', async () => {
    const user = userEvent.setup()
    mockScreenshots([
      { id: 1, image: 's1.jpg' },
      { id: 2, image: 's2.jpg' },
    ])

    render(
      <GameMediaGallery slug="celeste" name="Celeste" coverImage="cover.jpg" />,
    )

    expect(mainSrc()).toBe('cover.jpg')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(mainSrc()).toBe('s1.jpg')

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(mainSrc()).toBe('cover.jpg')

    // Thumbnails jump straight to a specific image (image 3 = second shot).
    await user.click(screen.getByRole('button', { name: 'Show image 3' }))
    expect(mainSrc()).toBe('s2.jpg')
  })

  it('auto-advances through the images on a timer', () => {
    vi.useFakeTimers()
    try {
      mockScreenshots([{ id: 1, image: 's1.jpg' }])

      render(
        <GameMediaGallery
          slug="celeste"
          name="Celeste"
          coverImage="cover.jpg"
        />,
      )

      expect(mainSrc()).toBe('cover.jpg')
      act(() => void vi.advanceTimersByTime(5000))
      expect(mainSrc()).toBe('s1.jpg')
    } finally {
      vi.useRealTimers()
    }
  })
})
