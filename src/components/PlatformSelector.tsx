import { FiChevronDown } from 'react-icons/fi'
import { usePlatforms } from '@/hooks/usePlatforms'

interface Props {
  selectedPlatformId: number | null
  onSelectPlatform: (platformId: number | null) => void
}

function PlatformSelector({ selectedPlatformId, onSelectPlatform }: Props) {
  const { data: platforms, error } = usePlatforms()

  // If platforms fail to load, just hide the dropdown.
  if (error) return null

  return (
    // appearance-none hides the browser's cramped native arrow so we can draw
    // our own with proper spacing (pr-9 leaves room for it).
    <div className="relative">
      <select
        className="h-11 cursor-pointer appearance-none rounded-lg border border-border bg-surface-2 pr-9 pl-3 text-sm text-text outline-none transition focus:border-accent"
        aria-label="Filter by platform"
        value={selectedPlatformId ?? ''}
        onChange={(event) => {
          const value = event.target.value
          onSelectPlatform(value ? Number(value) : null)
        }}
      >
        <option value="">All platforms</option>
        {platforms?.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name}
          </option>
        ))}
      </select>
      <FiChevronDown
        size={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
    </div>
  )
}

export default PlatformSelector
