import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { TicketsList } from './TicketsList'

test('renders without crashing', () => {
  render(renderWithProviders(<TicketsList />, ['/tickets']))
})
