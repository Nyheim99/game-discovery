import { useEffect } from 'react'
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FiHeart } from 'react-icons/fi'
import { LuGamepad2 } from 'react-icons/lu'
import BackToTop from './BackToTop'
import ThemeToggle from './ThemeToggle'

// The shell shared by every page: a full-width sticky header stays put while
// the routed page transitions in and out where <Outlet /> would be.
function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotion()

  // Reset scroll to the top when the route changes, so a detail page doesn't
  // open halfway down where the previous page was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Fade/slide the routed page on navigation. Keyed by pathname so changing the
  // search/filters on the home page (same path, different query) doesn't
  // re-animate the whole page. One object keeps the reduced-motion fork to a
  // single branch.
  const pageMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
      }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Brand: a gradient logo mark + the title, links home. */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-400 text-white transition-transform group-hover:scale-105">
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
                to="/wishlist"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted hover:text-text'
                  }`
                }
              >
                <FiHeart size={16} />
                Wishlist
              </NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-6 lg:px-10">
        {/* mode="wait" lets the leaving page finish exiting before the next
            one enters, so they never overlap and shift the layout. */}
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageMotion}>
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      <BackToTop />
    </div>
  )
}

export default Layout
