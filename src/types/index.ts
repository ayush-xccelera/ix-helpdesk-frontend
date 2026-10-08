export type Role = 'admin' | 'agent' | 'customer'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TicketCategory = 'hardware' | 'software' | 'network' | 'access' | 'other'

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UserSummary {
  id: string
  fullName: string
}

export interface Ticket {
  id: string
  number: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  requester: UserSummary
  assignee: UserSummary | null
  slaDueAt: string | null
  slaBreached: boolean
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}

export interface Comment {
  id: string
  ticketId: string
  author: UserSummary
  body: string
  internal: boolean
  createdAt: string
  updatedAt?: string
}

export interface TicketHistoryEntry {
  id: string
  action: string
  actor: UserSummary
  createdAt: string
  changes?: Record<string, { before?: unknown; after?: unknown }> | Record<string, unknown>
}

export interface DashboardSummary {
  totalOpen: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  slaBreached: number
  avgResolutionHours: number
  createdLast7Days: { date: string; count: number }[]
}

export interface HealthStatus {
  status: string
  db: string
  redis: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse extends AuthTokens {
  user: User
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiErrorShape {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
