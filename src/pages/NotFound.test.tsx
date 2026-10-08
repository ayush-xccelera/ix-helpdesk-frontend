import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { NotFound } from './NotFound'

test('renders without crashing', () => {
  render(renderWithProviders(<NotFound />, ['/unknown-route']))
})
