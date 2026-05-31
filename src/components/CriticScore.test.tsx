import { render, screen } from '@testing-library/react'
import CriticScore from './CriticScore'

describe('CriticScore', () => {
  it('displays the score', () => {
    render(<CriticScore score={88} />)
    expect(screen.getByText('88')).toBeInTheDocument()
  })

  it('marks high scores (>= 75)', () => {
    render(<CriticScore score={88} />)
    expect(screen.getByText('88')).toHaveAttribute('data-tier', 'high')
  })

  it('marks mid scores (50–74)', () => {
    render(<CriticScore score={60} />)
    expect(screen.getByText('60')).toHaveAttribute('data-tier', 'medium')
  })

  it('marks low scores (< 50)', () => {
    render(<CriticScore score={42} />)
    expect(screen.getByText('42')).toHaveAttribute('data-tier', 'low')
  })
})
