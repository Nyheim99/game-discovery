import { Link, NavLink, Outlet } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { LuGamepad2 } from 'react-icons/lu'
import ThemeToggle from './ThemeToggle'

// The shell shared by every page: a full-width sticky header stays put while
// the routed page swaps in and out at <Outlet />.
function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Brand: a gradient logo mark + the title, links home. */}
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-400 text-white">
              <LuGamepad2 size={20} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Game<span className="text-accent">Discovery</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <nav>
              {/* NavLink's render-prop lets us style the active route. */}
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted hover:text-text'
                  }`
                }
              >
                <FiHeart size={16} />
                Favorites
              </NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-6 lg:px-10">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
