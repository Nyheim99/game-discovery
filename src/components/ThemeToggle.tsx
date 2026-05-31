import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '@/context/theme-context'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted transition-colors hover:text-text hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-accent"
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  )
}

export default ThemeToggle
