'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  itemName?: string
  loading?: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName,
  loading = false
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // Error handling is done by the parent component
    } finally {
      setIsDeleting(false)
    }
  }

  const displayTitle = itemName ? `${title} "${itemName}"` : title

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>{displayTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting || loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || loading}
            className="flex-1"
          >
            {isDeleting || loading ? (
              <>
                <Trash2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
