import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function IndexRedirect(): JSX.Element {
  const { role } = useAuth()
  const target = role === 'customer' ? '/tickets' : '/dashboard'
  return <Navigate to={target} replace />
}
