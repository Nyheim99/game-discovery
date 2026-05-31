import { Link } from 'react-router-dom'

// Rendered by the catch-all "*" route when no other route matches.
function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 text-muted">
        We couldn’t find the page you’re looking for.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-contrast transition hover:opacity-90"
      >
        Back to games
      </Link>
    </div>
  )
}

export default NotFoundPage
