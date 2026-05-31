import { render, screen } from '@testing-library/react'
import CriticScore from './CriticScore'

describe('CriticScore', () => {
  it('displays the score', () => {
    render(<CriticScore score={88} />)
    expect(screen.getByText('88')).toBeInTheDocument()
  })

  it('uses the green class for high scores (>= 75)', () => {
    render(<CriticScore score={88} />)
    expect(screen.getByText('88')).toHaveClass('critic-green')
  })

  it('uses the yellow class for mid scores (50–74)', () => {
    render(<CriticScore score={60} />)
    expect(screen.getByText('60')).toHaveClass('critic-yellow')
  })

  it('uses the red class for low scores (< 50)', () => {
    render(<CriticScore score={42} />)
    expect(screen.getByText('42')).toHaveClass('critic-red')
  })
})
