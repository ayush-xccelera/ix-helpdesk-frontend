import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setOnAuthFailure,
  setRefreshToken,
} from '../api/client'
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth'
import type { AuthTokens, Role, User } from '../types'

interface AuthContextValue {
  user: User | null
  isBootstrapping: boolean
  isAuthenticated: boolean
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const apiBaseUrl = (import.meta.env.VITE_API_URL || '') + '/api/v1'

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let isMounted = true

    setOnAuthFailure(() => {
      setAccessToken(null)
      setRefreshToken(null)
      if (isMounted) {
        setUser(null)
      }
    })

    async function bootstrap(): Promise<void> {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        setIsBootstrapping(false)
        return
      }
      try {
        const response = await axios.post<AuthTokens>(`${apiBaseUrl}/auth/refresh`, { refreshToken })
        setAccessToken(response.data.accessToken)
        setRefreshToken(response.data.refreshToken)
        const currentUser = await fetchCurrentUser()
        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        setAccessToken(null)
        setRefreshToken(null)
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
      setOnAuthFailure(null)
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    const response = await loginUser({ email, password })
    setAccessToken(response.accessToken)
    setRefreshToken(response.refreshToken)
    setUser(response.user)
  }

  const register = async (fullName: string, email: string, password: string): Promise<void> => {
    await registerUser({ fullName, email, password })
  }

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } finally {
      setAccessToken(null)
      setRefreshToken(null)
      setUser(null)
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isBootstrapping,
      isAuthenticated: Boolean(user) && Boolean(getAccessToken()),
      role: user?.role ?? null,
      login,
      register,
      logout,
    }),
    [user, isBootstrapping],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
