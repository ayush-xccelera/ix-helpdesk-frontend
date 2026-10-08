import { apiClient } from './client'
import type {
  Comment,
  PaginatedResponse,
  Ticket,
  TicketCategory,
  TicketHistoryEntry,
  TicketPriority,
  TicketStatus,
} from '../types'

export interface ListTicketsParams {
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
  assigneeId?: string
  q?: string
  page?: number
  pageSize?: number
  sort?: string
}

export async function listTickets(params: ListTicketsParams): Promise<PaginatedResponse<Ticket>> {
  const response = await apiClient.get<PaginatedResponse<Ticket>>('/tickets', { params })
  return response.data
}

export async function getTicket(id: string): Promise<Ticket> {
  const response = await apiClient.get<Ticket>(`/tickets/${id}`)
  return response.data
}

export async function createTicket(input: {
  title: string
  description: string
  priority: TicketPriority
  category: TicketCategory
}): Promise<Ticket> {
  const response = await apiClient.post<Ticket>('/tickets', input)
  return response.data
}

export async function updateTicket(
  id: string,
  input: Partial<{
    status: TicketStatus
    priority: TicketPriority
    assigneeId: string | null
    title: string
    description: string
  }>,
): Promise<Ticket> {
  const response = await apiClient.patch<Ticket>(`/tickets/${id}`, input)
  return response.data
}

export async function listComments(ticketId: string): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>(`/tickets/${ticketId}/comments`)
  return response.data
}

export async function createComment(
  ticketId: string,
  input: { body: string; internal: boolean },
): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/tickets/${ticketId}/comments`, input)
  return response.data
}

export async function listTicketHistory(ticketId: string): Promise<TicketHistoryEntry[]> {
  const response = await apiClient.get<TicketHistoryEntry[]>(`/tickets/${ticketId}/history`)
  return response.data
}
