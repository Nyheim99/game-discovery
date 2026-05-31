interface Props {
  score: number
}

function CriticScore({ score }: Props) {
  const color = score >= 75 ? 'green' : score >= 50 ? 'yellow' : 'red'

  return <span className={`critic-score critic-${color}`}>{score}</span>
}

export default CriticScore
