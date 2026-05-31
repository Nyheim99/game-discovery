import { Link, Outlet } from 'react-router-dom'
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
        <ThemeToggle />
      </header>
      <Outlet />
    </div>
  )
}

export default Layout
