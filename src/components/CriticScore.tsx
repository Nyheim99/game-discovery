interface Props {
  score: number
}

// Tailwind classes per score tier. dark: variants keep contrast in both themes.
const tierStyles = {
  high: 'bg-green-500/15 text-green-700 dark:text-green-400',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  low: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

function CriticScore({ score }: Props) {
  const tier = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low'

  return (
    <span
      data-tier={tier}
      className={`rounded-md px-2 py-0.5 text-sm font-bold ${tierStyles[tier]}`}
    >
      {score}
    </span>
  )
}

export default CriticScore
