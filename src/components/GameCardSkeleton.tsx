function GameCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface"
      aria-hidden="true"
    >
      <div className="aspect-[16/10] animate-pulse bg-surface-2" />
      <div className="p-4">
        <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}

export default GameCardSkeleton
