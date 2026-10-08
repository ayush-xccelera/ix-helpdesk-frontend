import axios from 'axios'
import type { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import { REFRESH_TOKEN_STORAGE_KEY } from '../constants'
import type { ApiErrorShape, AuthTokens } from '../types'

// Access token is intentionally kept only in memory (module-level variable),
// never written to localStorage, so a page refresh requires a silent
// refresh using the refresh token below.
let accessToken: string | null = null
let onAuthFailure: (() => void) | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

export function setOnAuthFailure(callback: (() => void) | null): void {
  onAuthFailure = callback
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  }
}

const baseURL = (import.meta.env.VITE_API_URL || '') + '/api/v1'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers = (config.headers ?? {}) as AxiosRequestHeaders
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

function extractErrorMessage(error: AxiosError<ApiErrorShape>): string {
  const payload = error.response?.data
  if (payload && typeof payload === 'object' && 'error' in payload && payload.error?.message) {
    return payload.error.message
  }
  if (error.message === 'Network Error') {
    return 'Unable to reach the server. Please check your connection and try again.'
  }
  return error.message || 'Something went wrong. Please try again.'
}

let isRefreshing = false
let pendingRequests: Array<() => void> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorShape>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        if (onAuthFailure) {
          onAuthFailure()
        }
        toast.error('Your session has expired. Please log in again.')
        return Promise.reject(error)
      }

      try {
        if (!isRefreshing) {
          isRefreshing = true
          const response = await axios.post<AuthTokens>(`${baseURL}/auth/refresh`, { refreshToken })
          setAccessToken(response.data.accessToken)
          setRefreshToken(response.data.refreshToken)
          isRefreshing = false
          pendingRequests.forEach((resolve) => resolve())
          pendingRequests = []
        } else {
          await new Promise<void>((resolve) => pendingRequests.push(resolve))
        }

        originalRequest.headers = (originalRequest.headers ?? {}) as AxiosRequestHeaders
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        pendingRequests = []
        setAccessToken(null)
        setRefreshToken(null)
        if (onAuthFailure) {
          onAuthFailure()
        }
        toast.error('Your session has expired. Please log in again.')
        return Promise.reject(refreshError)
      }
    }

    const message = extractErrorMessage(error)
    // Every failed real-branch request surfaces exactly once here, so
    // callers must never toast the same error again in their own catch.
    if (status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)
