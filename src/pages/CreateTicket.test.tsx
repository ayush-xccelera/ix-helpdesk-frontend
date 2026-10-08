import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { CreateTicket } from './CreateTicket'

test('renders without crashing', () => {
  render(renderWithProviders(<CreateTicket />, ['/tickets/new']))
})
