import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

export function NotFound(): JSX.Element {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-canvas text-center">
      <SearchX className="h-12 w-12 text-neutral-400" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-ink">404 — Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
      >
        Go Home
      </Link>
    </div>
  )
}
