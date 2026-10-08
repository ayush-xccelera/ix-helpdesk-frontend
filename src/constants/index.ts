import type { Role, TicketCategory, TicketPriority, TicketStatus } from '../types'

export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  tickets: '/tickets',
  ticketNew: '/tickets/new',
  ticketDetail: (id: string) => `/tickets/${id}`,
  adminUsers: '/admin/users',
  profile: '/profile',
  forbidden: '/403',
}

export const ROLES: Role[] = ['admin', 'agent', 'customer']

export const TICKET_STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed']

export const TICKET_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent']

export const TICKET_CATEGORIES: TicketCategory[] = ['hardware', 'software', 'network', 'access', 'other']

export const PAGE_SIZE_OPTIONS = [10, 25, 50]

export const DEFAULT_PAGE_SIZE = 10

export const TITLE_MAX_LENGTH = 120

export const ACCESS_TOKEN_STORAGE_KEY = 'helpdesk_access_token_memory_flag'

export const REFRESH_TOKEN_STORAGE_KEY = 'helpdesk_refresh_token'

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  hardware: 'Hardware',
  software: 'Software',
  network: 'Network',
  access: 'Access',
  other: 'Other',
}

// Ticket status workflow transitions allowed from each state.
// Reopen is allowed from any state back to 'open'.
export const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress'],
  in_progress: ['resolved'],
  resolved: ['closed', 'open'],
  closed: ['open'],
}
