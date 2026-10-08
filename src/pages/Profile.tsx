import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LogOut, UserCircle } from 'lucide-react'
import { fetchCurrentUser } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Skeleton } from '../components/Skeleton'

export function Profile(): JSX.Element {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  const handleConfirmLogout = async (): Promise<void> => {
    await logout()
    setIsLogoutDialogOpen(false)
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-ink">Profile</h1>

      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-muted">Unable to load your profile right now.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle className="h-12 w-12 text-primary-500" aria-hidden="true" />
              <div>
                <p className="text-lg font-semibold text-ink">{data.fullName}</p>
                <p className="text-sm text-muted">{data.email}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Role</dt>
                <dd className="capitalize text-ink">{data.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Status</dt>
                <dd className="text-ink">{data.isActive ? 'Active' : 'Inactive'}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-neutral-100"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Log out"
        message="Are you sure you want to log out of HelpDesk?"
        confirmLabel="Log out"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  )
}
