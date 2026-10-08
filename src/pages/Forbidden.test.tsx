import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { Forbidden } from './Forbidden'

test('renders without crashing', () => {
  render(renderWithProviders(<Forbidden />, ['/403']))
})
