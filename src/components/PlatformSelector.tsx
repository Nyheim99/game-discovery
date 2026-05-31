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
    <select
      className="cursor-pointer rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none transition focus:border-accent"
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
  )
}

export default PlatformSelector
