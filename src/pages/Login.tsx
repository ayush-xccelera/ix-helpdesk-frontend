import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LifeBuoy, Loader2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { validateEmail, validateRequired } from '../validation'

export function Login(): JSX.Element {
  const { login, isAuthenticated, isBootstrapping } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const emailError = validateEmail(email)
  const passwordError = validateRequired(password, 'Password')
  const isValid = !emailError && !passwordError

  if (!isBootstrapping && isAuthenticated) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setHasAttemptedSubmit(true)
    setSubmitError('')

    if (!isValid) {
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'
      navigate(redirectTo)
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      setSubmitError(message || 'Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <LifeBuoy className="h-8 w-8 text-primary-500" aria-hidden="true" />
          <h1 className="text-xl font-bold text-ink">Sign in to HelpDesk</h1>
        </div>

        {submitError && (
          <div role="alert" className="mb-4 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={hasAttemptedSubmit && Boolean(emailError)}
              aria-describedby="login-email-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="login-email-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && emailError ? (
                <span className="text-danger-600">{emailError}</span>
              ) : (
                'Enter the email address you registered with.'
              )}
            </p>
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={hasAttemptedSubmit && Boolean(passwordError)}
              aria-describedby="login-password-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="login-password-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && passwordError ? (
                <span className="text-danger-600">{passwordError}</span>
              ) : (
                'Enter your account password.'
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={(hasAttemptedSubmit && !isValid) || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Sign in
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/register" className="font-medium text-primary-500 hover:underline">
            Create an account
          </Link>
          <Link to="/forgot-password" className="font-medium text-muted hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}
