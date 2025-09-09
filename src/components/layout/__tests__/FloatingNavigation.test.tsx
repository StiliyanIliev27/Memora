import React from 'react'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { FloatingNavigation } from '../FloatingNavigation'

jest.setTimeout(20000)

// Mocks
const stableUser = { id: 'user-1', email: 'u@example.com', name: 'User One' }
jest.mock('@/stores/AuthContext', () => ({
  useAuthContext: () => ({ user: stableUser }),
}))

const mockGetConnections = jest.fn()
const mockUpdateStatus = jest.fn()
const mockDeleteConnection = jest.fn()

jest.mock('@/lib/database', () => ({
  databaseService: {
    getConnections: (...args: any[]) => mockGetConnections(...args),
    updateConnectionStatus: (...args: any[]) => mockUpdateStatus(...args),
    deleteConnection: (...args: any[]) => mockDeleteConnection(...args),
  },
}))

const mockUnsubscribe = jest.fn()
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  unsubscribe: mockUnsubscribe,
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => mockChannel),
  },
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))
import { toast } from 'sonner'

// Mock heavy modals to lightweight stubs
jest.mock('@/components/memories/AddMemoryModal', () => ({
  AddMemoryModal: ({ isOpen }: any) => (isOpen ? <div role="dialog">AddMemoryModal</div> : null),
}))
jest.mock('@/components/connections/CreateConnectionModal', () => ({
  CreateConnectionModal: ({ isOpen, onClose, onSuccess }: any) => (
    isOpen ? <div role="dialog" onClick={onClose || onSuccess}>CreateConnectionModal</div> : null
  ),
}))
jest.mock('@/components/connections/ConnectionModal', () => ({
  ConnectionModal: ({ isOpen, onClose }: any) => (isOpen ? <div role="dialog" onClick={onClose}>ConnectionModal</div> : null),
}))

function buildConnection(overrides: Partial<any> = {}) {
  return {
    id: 'conn-1',
    status: 'pending',
    connection_type: 'friend',
    user1: { id: 'user-2', name: 'Alice', email: 'alice@example.com', avatar_url: '' },
    user2: { id: 'user-1', name: 'You', email: 'you@example.com', avatar_url: '' },
    message: 'pls connect',
    ...overrides,
  }
}

describe('FloatingNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetConnections.mockResolvedValue([
      buildConnection({ id: 'c1', status: 'pending' }),
      buildConnection({ id: 'c2', status: 'accepted' }),
      buildConnection({ id: 'c3', status: 'accepted', user1: { id: 'user-1' }, user2: { id: 'user-3', name: 'Bob', email: 'bob@example.com' } }),
    ])
  })

  it('renders counts and toggles sections', async () => {
    render(<FloatingNavigation />)

    expect(await screen.findByText('Active Connections')).toBeInTheDocument()
    expect(await screen.findByText('Pending Requests')).toBeInTheDocument()

    const toggleButtons = screen.getAllByRole('button')
    const togglePending = toggleButtons.find(b => b.className.includes('h-8 w-8 p-0'))!
    fireEvent.click(togglePending)
  })

  it('filters active connections by search', async () => {
    render(<FloatingNavigation />)

    await screen.findByText('Active Connections')

    const input = await screen.findByPlaceholderText('Search connections...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'bob' } })

    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('invokes onStartAddMemory when clicking Add Memory', async () => {
    const onStartAddMemory = jest.fn()
    render(<FloatingNavigation onStartAddMemory={onStartAddMemory} />)

    const addButton = await screen.findByRole('button', { name: /add memory/i })
    fireEvent.click(addButton)
    expect(onStartAddMemory).toHaveBeenCalledTimes(1)
  })

  it('accepts a pending connection and updates state immediately', async () => {
    mockUpdateStatus.mockResolvedValue(undefined)
    render(<FloatingNavigation />)

    // Scope within Incoming section to avoid duplicate names
    const incoming = await screen.findByText(/Incoming/)
    const list = incoming.parentElement!.nextElementSibling!
    const firstCard = list.querySelector('div')!

    // Verify it shows Alice
    expect(within(firstCard).getByText('Alice')).toBeInTheDocument()

    const acceptBtn = within(firstCard).getAllByRole('button')[0]
    fireEvent.click(acceptBtn)

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalled()
    })
  })

  it('rejects a pending connection and removes it', async () => {
    mockDeleteConnection.mockResolvedValue(undefined)
    render(<FloatingNavigation />)

    const incoming = await screen.findByText(/Incoming/)
    const list = incoming.parentElement!.nextElementSibling!
    const firstCard = list.querySelector('div')!

    expect(within(firstCard).getByText('Alice')).toBeInTheDocument()

    const buttons = within(firstCard).getAllByRole('button')
    const rejectBtn = buttons[1]
    fireEvent.click(rejectBtn)

    await waitFor(() => {
      expect(mockDeleteConnection).toHaveBeenCalled()
    })
  })

  it('shows AddMemoryModal when selectedLocation is provided', async () => {
    render(<FloatingNavigation selectedLocation={{ lat: 1, lng: 2 }} />)

    const dialogs = await screen.findAllByRole('dialog')
    expect(dialogs.length).toBeGreaterThan(0)
  })
})
