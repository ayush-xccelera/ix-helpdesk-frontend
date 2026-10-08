import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { TicketsList } from './TicketsList'

test('updates the status filter select when a new status is chosen', async () => {
  render(renderWithProviders(<TicketsList />, ['/tickets']))

  const statusSelect = screen.getByLabelText('Filter by status') as HTMLSelectElement
  await userEvent.selectOptions(statusSelect, 'open')

  expect(statusSelect.value).toBe('open')
})

test('updates the search box value as the user types', async () => {
  render(renderWithProviders(<TicketsList />, ['/tickets']))

  const searchBox = screen.getByLabelText('Search tickets') as HTMLInputElement
  await userEvent.type(searchBox, 'printer')

  expect(searchBox.value).toBe('printer')
})
