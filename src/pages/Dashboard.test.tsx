import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { Dashboard } from './Dashboard'

test('renders without crashing', () => {
  render(renderWithProviders(<Dashboard />, ['/dashboard']))
})
