'use client'

import { useState } from 'react'
import { useAuthContext } from '@/stores/AuthContext'
import { databaseService } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Heart, Users, Star, Mail, Send, Loader2 } from 'lucide-react'

interface CreateConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const RELATIONSHIP_TYPES = [
  { value: 'couple', label: 'Couple', icon: Heart, color: 'text-red-500' },
  { value: 'friend', label: 'Friend', icon: Star, color: 'text-yellow-500' },
  { value: 'group', label: 'Group', icon: Users, color: 'text-blue-500' },
]

export function CreateConnectionModal({ isOpen, onClose, onSuccess }: CreateConnectionModalProps) {
  const { user } = useAuthContext()
  const [email, setEmail] = useState('')
  const [relationshipType, setRelationshipType] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email || !relationshipType) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!user?.id) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await databaseService.createConnectionByEmail({
        recipientEmail: email,
        relationshipType: relationshipType as 'couple' | 'friend' | 'group',
        message: message || undefined,
        senderId: user.id,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Connection request sent successfully!')
        setEmail('')
        setRelationshipType('')
        setMessage('')
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = RELATIONSHIP_TYPES.find(type => type.value === relationshipType)
  const IconComponent = selectedType?.icon || Mail

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>Create Connection</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter their email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship Type</Label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedType && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <IconComponent className={`h-4 w-4 ${selectedType.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {selectedType.label} Relationship
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedType.value === 'couple' && 'For romantic partners and significant others'}
                {selectedType.value === 'friend' && 'For close friends and companions'}
                {selectedType.value === 'group' && 'For travel groups and communities'}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send Request</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
