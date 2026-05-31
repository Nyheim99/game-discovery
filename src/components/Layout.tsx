import { Link, NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

// The shell shared by every page: the header stays put while the routed page
// swaps in and out at <Outlet />.
function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        {/* The title is a link home, so it works as a "back to start" from
            any page. */}
        <Link to="/" className="app-title">
          <h1>🎮 Game Discovery</h1>
        </Link>
        <div className="app-header-actions">
          {/* NavLink is like Link, but adds an "active" class when the current
              URL matches — so we can highlight the page we're on. */}
          <nav className="app-nav">
            <NavLink to="/favorites">★ Favorites</NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  )
}

export default Layout
