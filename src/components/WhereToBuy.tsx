import { FiExternalLink } from 'react-icons/fi'
import type { NamedEntity } from '@/services/api-client'
import { useGameStores } from '@/hooks/useGameStores'

interface Props {
  slug: string
  stores: { store: NamedEntity }[] | undefined
}

// "Where to buy" links. The store NAMES come from the game detail (passed in),
// the buy URLs from the /stores sub-endpoint — joined here on the store id.
function WhereToBuy({ slug, stores }: Props) {
  const { data: links } = useGameStores(slug)

  if (!stores?.length) return null

  const buyable = stores
    .map(({ store }) => {
      const link = links?.find((l) => l.store_id === store.id)
      return link ? { id: store.id, name: store.name, url: link.url } : null
    })
    .filter((entry) => entry !== null)

  if (!buyable.length) return null

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">Where to buy</h2>
      <div className="flex flex-wrap gap-2">
        {buyable.map((store) => (
          <a
            key={store.id}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium transition hover:border-accent/40 hover:text-accent"
          >
            {store.name}
            <FiExternalLink size={14} />
          </a>
        ))}
      </div>
    </section>
  )
}

export default WhereToBuy
