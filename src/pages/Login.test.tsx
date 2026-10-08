import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { Login } from './Login'

test('renders without crashing', () => {
  render(renderWithProviders(<Login />, ['/login']))
})
