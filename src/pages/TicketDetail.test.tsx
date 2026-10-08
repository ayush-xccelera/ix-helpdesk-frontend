import { render } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { TicketDetail } from './TicketDetail'

test('renders without crashing', () => {
  render(
    renderWithProviders(
      <Routes>
        <Route path="/tickets/:id" element={<TicketDetail />} />
      </Routes>,
      ['/tickets/t1'],
    ),
  )
})
