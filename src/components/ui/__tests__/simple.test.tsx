import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Simple Test', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })

  it('should render a simple component', () => {
    const TestComponent = () => <div>Test Component</div>
    render(<TestComponent />)
    
    const element = screen.getByText('Test Component')
    expect(element).toBeInTheDocument()
  })
})

