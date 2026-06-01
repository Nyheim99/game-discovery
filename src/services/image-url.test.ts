import { getCroppedImageUrl } from './image-url'

describe('getCroppedImageUrl', () => {
  it('inserts the crop transform right after /media/', () => {
    const input = 'https://media.rawg.io/media/games/abc.jpg'
    const expected = 'https://media.rawg.io/media/crop/600/400/games/abc.jpg'

    expect(getCroppedImageUrl(input)).toBe(expected)
  })

  it('returns the url unchanged when there is no /media/ segment', () => {
    const input = 'https://example.com/some/other/image.jpg'

    expect(getCroppedImageUrl(input)).toBe(input)
  })

  it('only transforms the first /media/ occurrence', () => {
    const input = 'https://media.rawg.io/media/games/media/nested.jpg'

    // The slice math keys off the first match, so the second "/media/" in the
    // path is left untouched.
    expect(getCroppedImageUrl(input)).toBe(
      'https://media.rawg.io/media/crop/600/400/games/media/nested.jpg',
    )
  })
})
