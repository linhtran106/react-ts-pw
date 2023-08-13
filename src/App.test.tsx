import { render, screen } from '@testing-library/react'
import React from 'react'
import App from './App'

test('renders render my tasks page', () => {
  render(<App />)
  const element = screen.getByText(/my tasks/i)
  expect(element).toBeInTheDocument()
})
