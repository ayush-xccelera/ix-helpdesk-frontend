import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function Forbidden(): JSX.Element {
  const navigate = useNavigate()
  const { role } = useAuth()
  const homeRoute = role === 'customer' ? '/tickets' : '/dashboard'

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="h-12 w-12 text-danger-500" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-ink">403 — Forbidden</h1>
      <p className="max-w-sm text-sm text-muted">
        You do not have permission to access this page. If you believe this is a mistake, contact
        your administrator.
      </p>
      <button
        type="button"
        onClick={() => navigate(homeRoute)}
        className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
      >
        Back to Home
      </button>
    </div>
  )
}
