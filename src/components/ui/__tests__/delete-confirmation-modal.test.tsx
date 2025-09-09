import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { DeleteConfirmationModal } from '../delete-confirmation-modal'

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Delete Memory',
    description: 'Are you sure you want to delete this memory?',
    loading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when open', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)
    
    expect(screen.getByText('Delete Memory')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this memory?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<DeleteConfirmationModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Delete Memory')).not.toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when loading is true', () => {
    render(<DeleteConfirmationModal {...defaultProps} loading={true} />)
    
    const deleteButton = screen.getByRole('button', { name: 'Deleting...' })
    expect(deleteButton).toBeDisabled()
  })

  it('renders with custom title and description', () => {
    const customProps = {
      ...defaultProps,
      title: 'Remove Connection',
      description: 'This action cannot be undone.',
    }
    
    render(<DeleteConfirmationModal {...customProps} />)
    
    expect(screen.getByText('Remove Connection')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('displays item name in title when provided', () => {
    const customProps = {
      ...defaultProps,
      itemName: 'My Memory',
    }
    
    render(<DeleteConfirmationModal {...customProps} />)
    
    expect(screen.getByText('Delete Memory "My Memory"')).toBeInTheDocument()
  })

  it('handles async onConfirm correctly', async () => {
    const mockOnConfirm = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(<DeleteConfirmationModal {...defaultProps} onConfirm={mockOnConfirm} />)
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    
    // Click the button to start the async operation
    fireEvent.click(deleteButton)
    
    // Button should be disabled during deletion
    expect(deleteButton).toBeDisabled()
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })
    
    // Wait a bit more for the state to update and onClose to be called
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    }, { timeout: 200 })
  })

  it('handles onConfirm errors gracefully', async () => {
    const mockOnConfirm = jest.fn().mockRejectedValue(new Error('Delete failed'))
    
    render(<DeleteConfirmationModal {...defaultProps} onConfirm={mockOnConfirm} />)
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)
    
    // Wait for the error to be handled
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })
    
    // Wait for the state to update after error
    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    }, { timeout: 200 })
  })
}) 
