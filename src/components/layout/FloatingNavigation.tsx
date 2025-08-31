'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/stores/AuthContext'
import { databaseService } from '@/lib/database'
import { ConnectionWithUsers } from '@/types/database'
import { MemoryMarker } from '@/types/map'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Heart, Users, Star, Plus, Search, ChevronDown, ChevronUp, Check, X, Loader2, Bell } from 'lucide-react'
import { AddMemoryModal } from '@/components/memories/AddMemoryModal'
import { CreateConnectionModal } from '@/components/connections/CreateConnectionModal'
import { ConnectionModal } from '@/components/connections/ConnectionModal'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const RELATIONSHIP_ICONS = {
  couple: { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  friend: { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  group: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
}

interface FloatingNavigationProps {
  selectedLocation?: { lat: number; lng: number } | null
  selectedLocationDetails?: any
  onStartAddMemory?: () => void
  onMemoryClick?: (memory: MemoryMarker) => void
}

export function FloatingNavigation({ selectedLocation, selectedLocationDetails, onStartAddMemory, onMemoryClick }: FloatingNavigationProps) {
  const { user } = useAuthContext()
  const [connections, setConnections] = useState<ConnectionWithUsers[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnectionsExpanded, setIsConnectionsExpanded] = useState(true)
  const [isPendingExpanded, setIsPendingExpanded] = useState(true)
  const [showAddMemory, setShowAddMemory] = useState(false)
  const [showCreateConnection, setShowCreateConnection] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<ConnectionWithUsers | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadConnections()
    const cleanup = setupRealtimeSubscription()
    
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [user]) // Added user to dependency array

  useEffect(() => {
    loadConnections()
    const cleanup = setupRealtimeSubscription()
    
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [user]) // Added user to dependency array

  // Auto-show modal when location is selected
  useEffect(() => {
    if (selectedLocation) {
      setShowAddMemory(true)
    }
  }, [selectedLocation])

  const setupRealtimeSubscription = () => {
    if (!user) return () => {} // Return an empty cleanup function if user is not logged in

    const subscription = supabase
      .channel('connection_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `user1_id=eq.${user.id} OR user2_id=eq.${user.id}`
        },
        (payload) => {
          // Reload connections when there's a change
  
          loadConnections()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const loadConnections = async () => {
    setLoading(true)
    try {
      const data = await databaseService.getConnections()
      
      setConnections(data)
    } catch (error) {
      // Error loading connections
    } finally {
      setLoading(false)
    }
  }

  const handleConnectionAction = async (connectionId: string, action: 'accept' | 'reject') => {
    setUpdating(connectionId)
    try {
      if (action === 'accept') {
        await databaseService.updateConnectionStatus(connectionId, 'accepted')
        toast.success('Connection accepted successfully!')
        
        // Immediately update local state
        setConnections(prevConnections => 
          prevConnections.map(conn => 
            conn.id === connectionId 
              ? { ...conn, status: 'accepted' }
              : conn
          )
        )
      } else {
        // For reject, delete the connection entirely
        await databaseService.deleteConnection(connectionId)
        toast.success('Connection rejected successfully!')
        
        // Immediately remove from local state
        setConnections(prevConnections => 
          prevConnections.filter(conn => conn.id !== connectionId)
        )
      }
    } catch (error) {
      // Error handling connection action
      toast.error(`Failed to ${action} connection`)
    } finally {
      setUpdating(null)
    }
  }

  const handleConnectionClick = (connection: ConnectionWithUsers) => {
    setSelectedConnection(connection)
    setShowConnectionModal(true)
  }

  const handleConnectionRemoved = () => {
    // The connection will be removed from the list via real-time subscription
    // or we can manually remove it from local state
    if (selectedConnection) {
      setConnections(prevConnections => 
        prevConnections.filter(conn => conn.id !== selectedConnection.id)
      )
    }
  }

  const activeConnections = connections.filter(c => c.status === 'accepted')
  const pendingRequests = connections.filter(c => c.user2?.id === user?.id && c.status === 'pending')
  const sentRequests = connections.filter(c => c.user1?.id === user?.id && c.status === 'pending')

  const filteredConnections = activeConnections.filter(connection => {
    const otherUser = connection.user1?.id === user?.id ? connection.user2 : connection.user1
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  }).slice(0, 5)

  const getOtherUser = (connection: ConnectionWithUsers) => {
    return connection.user1?.id === user?.id ? connection.user2 : connection.user1
  }

  return (
    <>
      <div className="w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        {/* App Logo and Name */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Memora
              </h1>
              <p className="text-xs text-gray-500">Share your memories</p>
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        {(pendingRequests.length > 0 || sentRequests.length > 0) && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {pendingRequests.length + sentRequests.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                className="h-8 w-8 p-0"
              >
                {isPendingExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isPendingExpanded && (
              <div className="space-y-3">
                {/* Incoming Requests */}
                {pendingRequests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Bell className="h-4 w-4 mr-1 text-orange-500" />
                      Incoming ({pendingRequests.length})
                    </h3>
                    <div className="space-y-2">
                      {pendingRequests.map((connection) => {
                        const sender = connection.user1
                        const relationshipConfig = RELATIONSHIP_ICONS[connection.connection_type]
                        const Icon = relationshipConfig.icon

                        return (
                          <div key={connection.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className={`w-8 h-8 rounded-full ${relationshipConfig.bgColor} flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${relationshipConfig.color}`} />
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sender?.avatar_url} alt={sender?.name} />
                              <AvatarFallback className="text-xs">
                                {sender?.name?.charAt(0) || sender?.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {sender?.name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {connection.connection_type}
                              </p>
                              {connection.message && (
                                <p className="text-xs text-gray-600 mt-1 truncate">"{connection.message}"</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                onClick={() => handleConnectionAction(connection.id, 'accept')}
                                disabled={updating === connection.id}
                                className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                              >
                                {updating === connection.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleConnectionAction(connection.id, 'reject')}
                                disabled={updating === connection.id}
                                className="h-7 w-7 p-0 border-red-300 text-red-600 hover:bg-red-50"
                              >
                                {updating === connection.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Sent Requests */}
                {sentRequests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      Sent ({sentRequests.length})
                    </h3>
                    <div className="space-y-2">
                      {sentRequests.map((connection) => {
                        const recipient = connection.user2
                        const relationshipConfig = RELATIONSHIP_ICONS[connection.connection_type]
                        const Icon = relationshipConfig.icon

                        return (
                          <div key={connection.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className={`w-8 h-8 rounded-full ${relationshipConfig.bgColor} flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${relationshipConfig.color}`} />
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={recipient?.avatar_url} alt={recipient?.name} />
                              <AvatarFallback className="text-xs">
                                {recipient?.name?.charAt(0) || recipient?.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {recipient?.name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {connection.connection_type}
                              </p>
                              {connection.message && (
                                <p className="text-xs text-gray-600 mt-1 truncate">"{connection.message}"</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                              Pending
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Active Connections Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">Active Connections</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeConnections.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConnectionsExpanded(!isConnectionsExpanded)}
                className="h-8 w-8 p-0"
              >
                {isConnectionsExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateConnection(true)}
                className="h-8 w-8 p-0 hover:bg-blue-50 relative"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                {sentRequests.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-white"
                  >
                    {sentRequests.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {isConnectionsExpanded && (
            <>
              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Connections List */}
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {searchQuery ? 'No connections found' : 'No active connections'}
                    </p>
                  </div>
                ) : (
                  filteredConnections.map((connection) => {
                    const otherUser = getOtherUser(connection)
                    const relationshipConfig = RELATIONSHIP_ICONS[connection.connection_type]
                    const Icon = relationshipConfig.icon

                    return (
                                              <div
                          key={connection.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleConnectionClick(connection)}
                        >
                          <div className={`w-8 h-8 rounded-full ${relationshipConfig.bgColor} flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${relationshipConfig.color}`} />
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={otherUser?.avatar_url} alt={otherUser?.name} />
                            <AvatarFallback className="text-xs">
                              {otherUser?.name?.charAt(0) || otherUser?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {otherUser?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {connection.connection_type}
                            </p>
                          </div>
                        </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 space-y-3">
          <Button
            onClick={() => onStartAddMemory?.()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white relative"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Memory
            {pendingRequests.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showAddMemory && (
        <AddMemoryModal
          isOpen={showAddMemory}
          onClose={() => setShowAddMemory(false)}
          selectedLocation={selectedLocation}
          selectedLocationDetails={selectedLocationDetails}
        />
      )}

      {showCreateConnection && (
        <CreateConnectionModal
          isOpen={showCreateConnection}
          onClose={() => setShowCreateConnection(false)}
          onSuccess={() => {
            setShowCreateConnection(false)
            loadConnections()
          }}
        />
      )}

      {showConnectionModal && selectedConnection && (
        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={() => {
            setShowConnectionModal(false)
            setSelectedConnection(null)
          }}
          connection={selectedConnection}
          onConnectionRemoved={handleConnectionRemoved}
          onMemoryClick={(memory) => {
            // Close connection modal and open memory modal
            setShowConnectionModal(false)
            setSelectedConnection(null)
            // Pass the memory to the parent component to open memory modal
            onMemoryClick?.(memory)
          }}
        />
      )}
    </>
  )
}
