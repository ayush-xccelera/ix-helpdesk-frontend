import { apiClient } from './client'
import type { LoginResponse, User } from '../types'

export async function registerUser(input: { fullName: string; email: string; password: string }): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', input)
  return response.data
}

export async function loginUser(input: { email: string; password: string }): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', input)
  return response.data
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken })
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}
