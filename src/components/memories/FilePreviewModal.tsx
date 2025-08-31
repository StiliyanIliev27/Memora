'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Download, Trash2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { MemoryFile } from '@/types/database'
import { databaseService } from '@/lib/database'
import { useAuthContext } from '@/stores/AuthContext'
import { toast } from 'sonner'
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal'

interface FilePreviewModalProps {
  files: MemoryFile[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onFileDeleted?: (fileId: string) => void
}

export function FilePreviewModal({ 
  files, 
  currentIndex, 
  isOpen, 
  onClose, 
  onFileDeleted 
}: FilePreviewModalProps) {
  const { user } = useAuthContext()
  const [currentFileIndex, setCurrentFileIndex] = useState(currentIndex)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (!files.length) return null

  const currentFile = files[currentFileIndex]
  const isOwner = currentFile.created_by === user?.id

  const handlePrevious = () => {
    setCurrentFileIndex(prev => prev > 0 ? prev - 1 : files.length - 1)
    setIsVideoPlaying(false)
  }

  const handleNext = () => {
    setCurrentFileIndex(prev => prev < files.length - 1 ? prev + 1 : 0)
    setIsVideoPlaying(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const success = await databaseService.deleteMemoryFile(currentFile.id)
      if (success) {
        toast.success('File deleted successfully')
        onFileDeleted?.(currentFile.id)
        
        // If this was the last file, close the modal
        if (files.length === 1) {
          onClose()
        } else {
          // Move to next file or previous if this was the last one
          if (currentFileIndex === files.length - 1) {
            setCurrentFileIndex(currentFileIndex - 1)
          }
        }
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      toast.error('Error deleting file')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      // For Supabase Storage URLs, we need to fetch the file first
      const response = await fetch(currentFile.file_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = currentFile.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  const renderFileContent = () => {
    switch (currentFile.file_type) {
      case 'photo':
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <img 
              src={currentFile.file_url} 
              alt={currentFile.file_name}
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
            />
          </div>
        )
      
      case 'video':
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <video 
              src={currentFile.file_url}
              controls
              className="max-w-full max-h-[600px] rounded-lg shadow-lg"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
          </div>
        )
      
      case 'note':
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentFile.file_name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {Math.round(currentFile.file_size / 1024)} KB
              </p>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-500">Unsupported file type</p>
              <Button onClick={handleDownload} variant="outline" className="mt-2">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                 <DialogHeader>
           <DialogTitle className="flex items-center justify-between">
             <div className="flex items-center space-x-4">
               <span className="text-lg font-semibold">
                 {currentFile.file_name}
               </span>
               <span className="text-sm text-gray-500">
                 {currentFileIndex + 1} of {files.length}
               </span>
             </div>
             
                           <div className="flex items-center space-x-1">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
           </DialogTitle>
         </DialogHeader>

        <div className="relative">
          {/* Navigation arrows */}
          {files.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* File content */}
          <div className="overflow-y-auto max-h-[70vh]">
            {renderFileContent()}
          </div>

          {/* File info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p><strong>Type:</strong> {currentFile.file_type}</p>
                <p><strong>Size:</strong> {Math.round(currentFile.file_size / 1024)} KB</p>
                <p><strong>Added:</strong> {new Date(currentFile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        itemName={currentFile?.file_name}
        loading={loading}
      />
    </Dialog>
  )
}
