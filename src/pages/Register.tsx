import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LifeBuoy, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../auth/AuthContext'
import { validateConfirmPassword, validateEmail, validatePassword, validateRequired } from '../validation'

export function Register(): JSX.Element {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fullNameError = validateRequired(fullName, 'Full name')
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
  const isValid = !fullNameError && !emailError && !passwordError && !confirmPasswordError

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setHasAttemptedSubmit(true)
    setSubmitError('')

    if (!isValid) {
      return
    }

    setIsSubmitting(true)
    try {
      await register(fullName, email, password)
      toast.success('Account created. Please sign in.')
      navigate('/login')
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      setSubmitError(message || 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <LifeBuoy className="h-8 w-8 text-primary-500" aria-hidden="true" />
          <h1 className="text-xl font-bold text-ink">Create your account</h1>
        </div>

        {submitError && (
          <div role="alert" className="mb-4 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="register-fullname" className="mb-1 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="register-fullname"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              aria-describedby="register-fullname-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="register-fullname-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && fullNameError ? (
                <span className="text-danger-600">{fullNameError}</span>
              ) : (
                'Your name as it should appear to support agents.'
              )}
            </p>
          </div>

          <div>
            <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby="register-email-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="register-email-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && emailError ? <span className="text-danger-600">{emailError}</span> : 'We will never share your email.'}
            </p>
          </div>

          <div>
            <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby="register-password-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="register-password-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && passwordError ? (
                <span className="text-danger-600">{passwordError}</span>
              ) : (
                'At least 8 characters, including one letter and one digit.'
              )}
            </p>
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="mb-1 block text-sm font-medium text-ink">
              Confirm password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-describedby="register-confirm-password-help"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p id="register-confirm-password-help" className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && confirmPasswordError ? (
                <span className="text-danger-600">{confirmPasswordError}</span>
              ) : (
                'Re-enter the password above to confirm.'
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={(hasAttemptedSubmit && !isValid) || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
