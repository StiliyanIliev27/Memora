'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/stores/AuthContext'
import { databaseService } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  Users, 
  Star, 
  X, 
  Camera, 
  Video, 
  FileText,
  Trash2,
  AlertTriangle,
  Check
} from 'lucide-react'
import { ConnectionWithUsers, MemoryWithConnection, DeletionRequest } from '@/types/database'
import { MemoryMarker } from '@/types/map'
import { toast } from 'sonner'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  connection: ConnectionWithUsers | null
  onConnectionRemoved?: () => void
  onMemoryClick?: (memory: MemoryMarker) => void
}

const RELATIONSHIP_ICONS = {
  couple: { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  friend: { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  group: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
}

const MEMORY_TYPE_ICONS = {
  photo: Camera,
  video: Video,
  note: FileText,
}

export function ConnectionModal({ isOpen, onClose, connection, onConnectionRemoved, onMemoryClick }: ConnectionModalProps) {
  const { user } = useAuthContext()
  const [sharedMemories, setSharedMemories] = useState<MemoryWithConnection[]>([])
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([])
  const [userDeletionRequests, setUserDeletionRequests] = useState<DeletionRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    if (isOpen && connection) {
      loadSharedMemories()
    }
  }, [isOpen, connection])

  useEffect(() => {
    if (isOpen && connection) {
      loadSharedMemories()
      loadDeletionRequests()
    }
  }, [isOpen, connection])

  const loadDeletionRequests = async () => {
    if (!connection) return
    
    try {
      // Load requests that the current user needs to respond to
      const requests = await databaseService.getDeletionRequestsForConnection(connection.id)
      setDeletionRequests(requests)
      
      // Load requests that the current user has sent (for showing pending status)
      const userRequests = await databaseService.getUserDeletionRequests(connection.id)
      setUserDeletionRequests(userRequests)
    } catch (error) {
      // Error loading deletion requests
    }
  }

  const loadSharedMemories = async () => {
    if (!connection) return
    
    setLoading(true)
    try {
      const memories = await databaseService.getMemoriesForConnection(connection.id)
      setSharedMemories(memories)
    } catch (error) {
      // Error loading shared memories
    } finally {
      setLoading(false)
    }
  }

  const getOtherUser = () => {
    if (!connection || !user) return null
    return connection.user1?.id === user.id ? connection.user2 : connection.user1
  }

  const handleRemoveConnection = async () => {
    if (!connection) return
    
    setRemoving(true)
    try {
      const success = await databaseService.deleteConnection(connection.id)
      if (success) {
        toast.success('Connection removed successfully!')
        onConnectionRemoved?.()
        onClose()
      } else {
        toast.error('Failed to remove connection')
      }
    } catch (error) {
      toast.error('Error removing connection')
    } finally {
      setRemoving(false)
      setShowRemoveConfirm(false)
    }
  }

  const handleDeletionRequestResponse = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const success = await databaseService.respondToDeletionRequest(requestId, status)
      if (success) {
        toast.success(`Deletion request ${status}`)
        // Reload data
        loadSharedMemories()
        loadDeletionRequests()
      } else {
        toast.error(`Failed to ${status} deletion request`)
      }
    } catch (error) {
      toast.error(`Error responding to deletion request`)
    }
  }

  const handleRequestMemoryDeletion = async (memoryId: string) => {
    try {
      const request = await databaseService.createDeletionRequest(memoryId, undefined, 'Requesting to delete this memory')
      if (request) {
        toast.success('Deletion request sent!')
        loadDeletionRequests()
      } else {
        toast.error('Failed to send deletion request')
      }
    } catch (error) {
      toast.error('Error sending deletion request')
    }
  }

  const handleRequestFileDeletion = async (fileId: string) => {
    try {
      const request = await databaseService.createDeletionRequest(undefined, fileId, 'Requesting to delete this file')
      if (request) {
        toast.success('File deletion request sent!')
        loadDeletionRequests()
      } else {
        toast.error('Failed to send file deletion request')
      }
    } catch (error) {
      toast.error('Error sending file deletion request')
    }
  }

  const hasPendingDeletionRequest = (memoryId: string) => {
    return userDeletionRequests.some(request => 
      request.memory_id === memoryId && request.status === 'pending'
    )
  }

  const hasPendingFileDeletionRequest = (fileId: string) => {
    return userDeletionRequests.some(request => 
      request.file_id === fileId && request.status === 'pending'
    )
  }

  const otherUser = getOtherUser()
  const relationshipConfig = connection ? RELATIONSHIP_ICONS[connection.connection_type] : null
  const Icon = relationshipConfig?.icon

  if (!connection || !otherUser) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Connection Details</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Profile Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={otherUser.avatar_url} alt={otherUser.name} />
                      <AvatarFallback className="text-lg">
                        {otherUser.name?.charAt(0) || otherUser.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{otherUser.name || 'Unknown User'}</h3>
                        {relationshipConfig && Icon && (
                          <div className={`w-8 h-8 rounded-full ${relationshipConfig.bgColor} flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${relationshipConfig.color}`} />
                          </div>
                        )}
                      </div>
                    
                                          <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{otherUser.email}</span>
                        </div>
                        
                        {otherUser.gender && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="capitalize">{otherUser.gender}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Connected since {new Date(connection.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRemoveConfirm(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Deletion Requests Section */}
            {deletionRequests.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Requests to Respond To</h4>
                    <Badge variant="destructive">{deletionRequests.length} requests</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {deletionRequests.map((request) => (
                      <div key={request.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="font-medium text-red-900">
                                {request.request_type === 'memory' ? 'Memory Deletion' : 'File Deletion'}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-1">
                              <strong>{request.requester_name}</strong> wants to delete{' '}
                              {request.request_type === 'memory' ? (
                                <span className="font-medium">"{request.memory_title}"</span>
                              ) : (
                                <span className="font-medium">"{request.file_name}"</span>
                              )}
                            </p>
                            
                            {request.message && (
                              <p className="text-xs text-gray-600 italic mb-2">"{request.message}"</p>
                            )}
                            
                            <p className="text-xs text-gray-500">
                              Requested {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleDeletionRequestResponse(request.id, 'rejected')}
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeletionRequestResponse(request.id, 'approved')}
                              variant="destructive"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shared Memories Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Shared Memories</h4>
                  <Badge variant="secondary">{sharedMemories.length} memories</Badge>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : sharedMemories.length > 0 ? (
                  <div className="space-y-4">
                    {sharedMemories.map((memory) => {
                      const MemoryIcon = MEMORY_TYPE_ICONS[memory.memory_type]
                      return (
                        <div 
                          key={memory.id} 
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => {
                            if (onMemoryClick) {
                              const memoryMarker: MemoryMarker = {
                                id: memory.id,
                                position: [memory.longitude, memory.latitude] as [number, number],
                                icon: memory.is_personal ? 'mappin' :
                                     memory.connection_type === 'couple' ? 'heart' : 'users',
                                color: memory.is_personal ? '#6b7280' :
                                     memory.connection_type === 'couple' ? '#ef4444' :
                                     memory.connection_type === 'friend' ? '#f59e0b' : '#3b82f6',
                                location: memory.location_name,
                                description: memory.description || '',
                                title: memory.title || 'Untitled Memory',
                                date: memory.created_at,
                                created_by: memory.created_by,
                                connection_id: memory.connection_id,
                                connection_type: memory.connection_type as 'couple' | 'friend' | 'group' | undefined,
                                is_personal: memory.is_personal,
                                connection: connection
                              }
                              onMemoryClick(memoryMarker)
                            }
                          }}
                        >
                          <div className="flex items-start space-x-4">
                            {/* Thumbnail/Icon */}
                            <div className="flex-shrink-0">
                              {memory.memory_type === 'photo' && memory.file_url ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                  <img 
                                    src={memory.file_url} 
                                    alt={memory.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : memory.memory_type === 'video' && memory.file_url ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                  <Video className="h-6 w-6 text-gray-400" />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <MemoryIcon className="h-6 w-6 text-blue-600" />
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-semibold text-gray-900">
                                  {memory.title}
                                </h5>
                                <div className="flex items-center space-x-2">
                                  {hasPendingDeletionRequest(memory.id) ? (
                                    <Badge variant="secondary" className="text-xs">
                                      Pending Deletion
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRequestMemoryDeletion(memory.id)
                                      }}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{memory.location_name}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(memory.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No shared memories yet</p>
                    <p className="text-sm">Start creating memories together!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Connection Confirmation Modal */}
      <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Remove Connection</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to remove <strong>{otherUser.name}</strong> from your connections? 
              This action cannot be undone.
            </p>
            
            <div className="flex space-x-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowRemoveConfirm(false)} 
                className="flex-1"
                disabled={removing}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRemoveConnection} 
                className="flex-1"
                disabled={removing}
              >
                {removing ? 'Removing...' : 'Remove Connection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
