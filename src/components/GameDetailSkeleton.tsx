// Placeholder shown while the detail page's data loads, mirroring its layout
// (back button, hero, meta row, description) so the page doesn't jump.
function GameDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl" aria-hidden="true">
      <div className="mb-4 h-9 w-24 animate-pulse rounded-lg bg-surface-2" />
      <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-surface-2" />
      <div className="mt-5 flex gap-4">
        <div className="h-6 w-32 animate-pulse rounded bg-surface-2" />
        <div className="h-6 w-16 animate-pulse rounded bg-surface-2" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}

export default GameDetailSkeleton
