import { renderHook } from '@testing-library/react'
import { useTheme } from './theme-context'

describe('useTheme', () => {
  it('throws if used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      /must be used within a ThemeProvider/i,
    )
  })
})
