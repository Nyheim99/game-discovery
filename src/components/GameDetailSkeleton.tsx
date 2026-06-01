// Placeholder shown while the detail page's data loads, mirroring its layout
// (back button, two-column gallery + info card, description) so it doesn't jump.
function GameDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-5 h-9 w-24 animate-pulse rounded-lg bg-surface-2" />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Gallery: a big viewer + a thumbnail strip. */}
        <div className="min-w-0">
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-surface-2" />
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 flex-1 animate-pulse rounded-lg bg-surface-2"
              />
            ))}
          </div>
        </div>

        {/* Info card. */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6">
          <div className="h-8 w-3/4 animate-pulse rounded bg-surface-2" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-surface-2"
              />
            ))}
          </div>
          <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-surface-2" />
        </div>
      </div>

      {/* Description lines. */}
      <div className="mt-8 max-w-3xl space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}

export default GameDetailSkeleton
