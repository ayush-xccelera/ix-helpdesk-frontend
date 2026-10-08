import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchHealthStatus } from '../api/dashboard'
import { ConfirmDialog } from './ConfirmDialog'

export function TopBar(): JSX.Element {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function checkHealth(): Promise<void> {
      try {
        const health = await fetchHealthStatus()
        if (isMounted) {
          setIsHealthy(health.status === 'ok' || health.status === 'healthy')
        }
      } catch {
        if (isMounted) {
          setIsHealthy(false)
        }
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleConfirmLogout = async (): Promise<void> => {
    await logout()
    setIsLogoutDialogOpen(false)
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${isHealthy ? 'bg-success-500' : 'bg-danger-500'}`}
          role="status"
          aria-label={isHealthy ? 'API is healthy' : 'API is unreachable'}
          title={isHealthy ? 'API healthy' : 'API unreachable'}
        />
        <span className="text-xs text-muted">{isHealthy ? 'All systems operational' : 'API unreachable'}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
        >
          <UserIcon className="h-4 w-4" aria-hidden="true" />
          {user?.fullName ?? 'Account'}
        </button>
        <button
          type="button"
          onClick={() => setIsLogoutDialogOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Log out"
        message="Are you sure you want to log out of HelpDesk?"
        confirmLabel="Log out"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </header>
  )
}
