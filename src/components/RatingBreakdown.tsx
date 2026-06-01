import type { Rating } from '@/services/api-client'

interface Props {
  ratings: Rating[] | undefined
}

// A colour per rating tier; anything unexpected falls back to a neutral grey.
const tierColor: Record<string, string> = {
  exceptional: 'bg-green-500',
  recommended: 'bg-sky-500',
  meh: 'bg-amber-500',
  skip: 'bg-rose-500',
}

// Show RAWG's most common tiers in a sensible order regardless of API order.
const order = ['exceptional', 'recommended', 'meh', 'skip']

// A stacked bar of how players rated the game, with a small legend.
function RatingBreakdown({ ratings }: Props) {
  if (!ratings?.length) return null

  const sorted = [...ratings].sort(
    (a, b) => order.indexOf(a.title) - order.indexOf(b.title),
  )

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">
        Player ratings
      </h2>

      <div className="flex h-3 overflow-hidden rounded-full">
        {sorted.map((rating) => (
          <div
            key={rating.id}
            className={tierColor[rating.title] ?? 'bg-muted'}
            style={{ width: `${rating.percent}%` }}
            title={`${rating.title}: ${rating.percent}%`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {sorted.map((rating) => (
          <li key={rating.id} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${tierColor[rating.title] ?? 'bg-muted'}`}
            />
            <span className="capitalize">{rating.title}</span>
            <span className="ml-auto text-muted">{rating.percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RatingBreakdown
