import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export function ForgotPassword(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 text-center shadow-card">
        <Mail className="mx-auto mb-4 h-8 w-8 text-primary-500" aria-hidden="true" />
        <h1 className="text-xl font-bold text-ink">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">
          Password resets are handled by your IT administrator. Please contact the helpdesk team
          directly to regain access to your account.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
