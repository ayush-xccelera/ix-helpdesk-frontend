import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { AdminUsers } from './AdminUsers'

test('renders without crashing', () => {
  render(renderWithProviders(<AdminUsers />, ['/admin/users']))
})
