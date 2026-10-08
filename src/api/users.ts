import { apiClient } from './client'
import type { PaginatedResponse, Role, User } from '../types'

export interface ListUsersParams {
  role?: Role
  q?: string
  page?: number
  pageSize?: number
}

export async function listUsers(params: ListUsersParams): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>('/users', { params })
  return response.data
}

export async function createUser(input: {
  fullName: string
  email: string
  password: string
  role: Role
}): Promise<User> {
  const response = await apiClient.post<User>('/users', input)
  return response.data
}

export async function updateUser(
  id: string,
  input: Partial<{ fullName: string; role: Role; isActive: boolean }>,
): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${id}`, input)
  return response.data
}
