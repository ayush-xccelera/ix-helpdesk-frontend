import { render } from '@testing-library/react'
import { test } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { ForgotPassword } from './ForgotPassword'

test('renders without crashing', () => {
  render(renderWithProviders(<ForgotPassword />, ['/forgot-password']))
})
