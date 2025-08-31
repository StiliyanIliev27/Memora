'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Calendar, User, FileText, Image, Play, File, Edit, Trash2, X, Eye, Heart, Users, MapPin as MapPinIcon, Plus, Upload } from 'lucide-react'
import { MemoryMarker } from '@/types/map'
import { MemoryFile, ConnectionWithUsers } from '@/types/database'
import { databaseService } from '@/lib/database'
import { useAuthContext } from '@/stores/AuthContext'
import { FilePreviewModal } from './FilePreviewModal'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'
import { toast } from 'sonner'

interface MemoryModalProps {
  memory: MemoryMarker | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export function MemoryModal({ memory, isOpen, onClose, onUpdate }: MemoryModalProps) {
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(memory?.title || '')
  const [description, setDescription] = useState(memory?.description || '')
  const [memoryFiles, setMemoryFiles] = useState<MemoryFile[]>([])
  const [showFilePreview, setShowFilePreview] = useState(false)
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [connectionDetails, setConnectionDetails] = useState<ConnectionWithUsers | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  // Update state when memory prop changes
  useEffect(() => {
    if (memory) {
      setTitle(memory.title || '')
      setDescription(memory.description || '')
    }
  }, [memory])

  // Load memory files when modal opens
  useEffect(() => {
    if (isOpen && memory?.id) {
      loadMemoryFiles()
      loadConnectionDetails()
    }
  }, [isOpen, memory?.id])

  const loadMemoryFiles = async () => {
    if (!memory?.id) return
    
    try {
      const files = await databaseService.getMemoryFiles(memory.id)
      setMemoryFiles(files)
    } catch (error) {
      // Error loading memory files
    }
  }

  const loadConnectionDetails = async () => {
    if (!memory?.connection_id) {
      setConnectionDetails(null)
      return
    }
    
    try {
      const connection = await databaseService.getConnectionDetails(memory.connection_id)
      setConnectionDetails(connection)
    } catch (error) {
      // Error loading connection details
    }
  }

  if (!memory) return null

  const isOwner = memory.created_by === user?.id

  const handleUpdate = async () => {
    if (!memory.id) return
    
    setLoading(true)
    try {
      const result = await databaseService.updateMemory(memory.id, {
        title,
        description: description || undefined
      })
      
      if (result) {
        setIsEditing(false)
        onUpdate?.()
      }
    } catch (error) {
      alert('Error updating memory')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!memory.id) return
    
    setLoading(true)
    try {
      const result = await databaseService.deleteMemory(memory.id)
      if (result) {
        toast.success('Memory deleted successfully')
        onUpdate?.()
        onClose()
      } else {
        toast.error('Failed to delete memory')
      }
    } catch (error) {
      toast.error('Error deleting memory')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !memory?.id) return

    setUploadingFiles(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const result = await databaseService.addFileToMemory(memory.id, file)
        if (result) {
          toast.success(`File "${file.name}" uploaded successfully`)
        } else {
          toast.error(`Failed to upload "${file.name}"`)
        }
      }
      // Reload memory files
      await loadMemoryFiles()
    } catch (error) {
      toast.error('Error uploading files')
    } finally {
      setUploadingFiles(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleFilePreview = (fileIndex: number) => {
    setSelectedFileIndex(fileIndex)
    setShowFilePreview(true)
  }

  const handleFileDeleted = (fileId: string) => {
    setMemoryFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      const success = await databaseService.deleteMemoryFile(fileId)
      if (success) {
        toast.success('File deleted successfully')
        setMemoryFiles(prev => prev.filter(file => file.id !== fileId))
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      toast.error('Error deleting file')
    }
  }

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return Image
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return Play
    return File
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
                     <DialogTitle className="flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <MapPin className="h-5 w-5 text-blue-600" />
               <span>Memory Details</span>
             </div>
                           {isOwner && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
           </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
                             {isEditing ? (
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md"
                   placeholder="Memory title"
                 />
               ) : (
                 title || 'Untitled Memory'
               )}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {memory.location || 'Unknown Location'}
              </p>
              <p className="text-xs text-gray-500">
                {memory.position[1].toFixed(6)}, {memory.position[0].toFixed(6)}
              </p>
            </div>
          </div>

                     {/* Date */}
           <div className="flex items-center space-x-2">
             <Calendar className="h-4 w-4 text-gray-500" />
             <span className="text-sm text-gray-600">
               {memory.date ? formatDate(memory.date) : 'Date not available'}
             </span>
           </div>

                       {/* Memory Type & Connection */}
            <div className="flex items-center space-x-2">
              {memory.is_personal ? (
                <MapPinIcon className="h-4 w-4 text-blue-500" />
              ) : memory.connection_type === 'couple' ? (
                <Heart className="h-4 w-4 text-red-500" />
              ) : (
                <Users className="h-4 w-4 text-orange-500" />
              )}
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {memory.is_personal ? 'Personal Memory' : 
                   memory.connection_type === 'couple' ? 'Couple Memory' :
                   memory.connection_type === 'friend' ? 'Friend Memory' :
                   memory.connection_type === 'group' ? 'Group Memory' : 'Shared Memory'}
                </span>
                {connectionDetails && !memory.is_personal && (
                  <div className="text-xs text-gray-500 mt-1">
                    Shared with: {connectionDetails.user1.name} & {connectionDetails.user2.name}
                  </div>
                )}
              </div>
            </div>

          {/* Description */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Description</span>
            </div>
                         {isEditing ? (
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                 placeholder="Tell the story behind this memory..."
               />
             ) : (
               <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                 {description || 'No description provided'}
               </p>
             )}
          </div>

                     {/* Files */}
           <div>
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-2">
                 <File className="h-4 w-4 text-gray-500" />
                 <span className="text-sm font-medium text-gray-900">Attachments ({memoryFiles.length})</span>
               </div>
               {isOwner && (
                 <div className="flex items-center space-x-2">
                   <input
                     type="file"
                     multiple
                     accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                     onChange={handleFileUpload}
                     className="hidden"
                     id="file-upload"
                     disabled={uploadingFiles}
                   />
                   <label
                     htmlFor="file-upload"
                     className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Plus className="h-3 w-3" />
                     <span>{uploadingFiles ? 'Uploading...' : 'Add Files'}</span>
                   </label>
                 </div>
               )}
             </div>
               {memoryFiles.length > 0 && (
                 <div className="space-y-2">
                   {memoryFiles.map((file, index) => (
                     <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                       {file.file_type === 'photo' ? (
                         <Image className="h-4 w-4 text-blue-500" />
                       ) : file.file_type === 'video' ? (
                         <Play className="h-4 w-4 text-red-500" />
                       ) : (
                         <File className="h-4 w-4 text-gray-500" />
                       )}
                                               <span className="text-sm text-gray-600 flex-1 truncate">{file.file_name}</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilePreview(index)}
                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFileDelete(file.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      {/* File Preview Modal */}
      <FilePreviewModal
        files={memoryFiles}
        currentIndex={selectedFileIndex}
        isOpen={showFilePreview}
        onClose={() => setShowFilePreview(false)}
        onFileDeleted={handleFileDeleted}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Memory"
        description="Are you sure you want to delete this memory? This action cannot be undone."
        itemName={memory?.title}
        loading={loading}
      />
    </Dialog>
  )
}
