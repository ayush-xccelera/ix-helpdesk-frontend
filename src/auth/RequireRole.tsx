import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { Role } from '../types'

export function RequireRole({ roles }: { roles: Role[] }): JSX.Element {
  const { role } = useAuth()

  if (!role || !roles.includes(role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
