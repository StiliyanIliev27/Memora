import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../dialog'

describe('Dialog', () => {
  it('renders dialog content when open', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
          <div>Dialog content goes here</div>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
  })

  it('does not render dialog content when closed', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
          <div>Dialog content goes here</div>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('This is a test dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Dialog content goes here')).not.toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-dialog">
          <DialogHeader>
            <DialogTitle>Custom Dialog</DialogTitle>
            <DialogDescription>Custom dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('custom-dialog')
  })

  it('renders dialog with different sizes', () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>Small dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-md')
    
    rerender(
      <Dialog open={true}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>Large dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-lg')
  })

  it('renders dialog header with title and description', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Header Title</DialogTitle>
            <DialogDescription>Header description text</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const title = screen.getByText('Header Title')
    const description = screen.getByText('Header description text')
    
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(title.tagName).toBe('H2')
    expect(description.tagName).toBe('P')
  })

  it('renders dialog content with children', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content Dialog</DialogTitle>
            <DialogDescription>Dialog with custom content</DialogDescription>
          </DialogHeader>
          <div data-testid="custom-content">
            <h3>Custom Content</h3>
            <p>This is custom dialog content</p>
            <button>Action Button</button>
          </div>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
    expect(screen.getByText('This is custom dialog content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
  })

  it('applies proper ARIA attributes', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog has proper accessibility</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    const dialog = screen.getByRole('dialog')
    const title = screen.getByText('Accessible Dialog')
    const description = screen.getByText('This dialog has proper accessibility')
    
    expect(dialog).toHaveAttribute('aria-labelledby', title.id)
    expect(dialog).toHaveAttribute('aria-describedby', description.id)
  })

  it('renders close button when provided', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog with Close</DialogTitle>
            <DialogDescription>Dialog with close button</DialogDescription>
          </DialogHeader>
          <button className="absolute top-4 right-4">×</button>
        </DialogContent>
      </Dialog>
    )
    
    const closeButton = screen.getByRole('button', { name: '×' })
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveClass('absolute', 'top-4', 'right-4')
  })
})
