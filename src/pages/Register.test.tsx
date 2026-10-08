import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { Register } from './Register'

test('renders without crashing', () => {
  render(renderWithProviders(<Register />, ['/register']))
})
