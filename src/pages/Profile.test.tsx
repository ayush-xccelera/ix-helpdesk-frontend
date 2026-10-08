import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { Profile } from './Profile'

test('renders without crashing', () => {
  render(renderWithProviders(<Profile />, ['/profile']))
})
