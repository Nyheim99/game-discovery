import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useScreenshots } from '@/hooks/useScreenshots'
import { getCroppedImageUrl } from '@/services/image-url'
import noImagePlaceholder from '@/assets/no-image-placeholder.svg'

interface Props {
  slug: string
  name: string
  coverImage: string
}

interface MediaItem {
  id: string
  src: string
  thumb: string
}

const AUTOPLAY_MS = 5000

// A gallery of a game's cover + screenshots: one large viewer, prev/next arrows
// and a thumbnail strip. It auto-advances on a timer, pausing while the user is
// hovering so it never slides away mid-look.
function GameMediaGallery({ slug, name, coverImage }: Props) {
  const { data: screenshots } = useScreenshots(slug)

  // Cover first, then screenshots — all plain images.
  const media: MediaItem[] = [
    {
      id: 'cover',
      src: coverImage || noImagePlaceholder,
      thumb: coverImage ? getCroppedImageUrl(coverImage) : noImagePlaceholder,
    },
    // Cap the screenshots so the thumbnail strip stays a reasonable size and
    // the thumbnails never shrink to nothing.
    ...(screenshots ?? []).slice(0, 7).map(
      (shot): MediaItem => ({
        id: `s-${shot.id}`,
        src: shot.image,
        thumb: getCroppedImageUrl(shot.image),
      }),
    ),
  ]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = media.length
  // The list grows as screenshots load; clamp so the index stays valid.
  const safeIndex = Math.min(index, count - 1)

  // Auto-advance. This is a legitimate effect: we're syncing with an external
  // system (a timer). It's cleared on unmount and recreated if paused/count
  // change, and pauses on hover so it doesn't fight the user.
  useEffect(() => {
    if (paused || count <= 1) return
    const id = setInterval(
      () => setIndex((current) => (current + 1) % count),
      AUTOPLAY_MS,
    )
    return () => clearInterval(id)
  }, [paused, count])

  function step(delta: number) {
    setIndex((current) => (current + delta + count) % count)
  }

  return (
    // min-w-0 lets this grid column shrink below the image's intrinsic width —
    // without it a large cover image forces the whole page to scroll sideways.
    <div className="min-w-0">
      <div
        className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          src={media[safeIndex].src}
          alt={name}
          className="h-full w-full object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-black/50 text-white transition hover:bg-black/70"
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-black/50 text-white transition hover:bg-black/70"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* The strip only matters when there's more than the cover to choose.
          flex-1 makes the thumbnails share the row width evenly so they fill
          it (no empty gap on the right); max-w keeps a few from going huge. */}
      {count > 1 && (
        <div className="mt-3 flex gap-2">
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === safeIndex}
              aria-label={`Show image ${i + 1}`}
              className={`h-16 max-w-40 min-w-0 flex-1 overflow-hidden rounded-lg border-2 transition ${
                i === safeIndex
                  ? 'border-accent'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={item.thumb}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameMediaGallery
