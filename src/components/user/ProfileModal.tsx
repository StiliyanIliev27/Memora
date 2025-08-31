'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/stores/AuthContext'
import { databaseService } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Calendar, MapPin } from 'lucide-react'
import type { User as UserType } from '@/types/database'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuthContext()
  const [profile, setProfile] = useState<Partial<UserType>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      loadProfile()
    }
  }, [isOpen, user])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const userProfile = await databaseService.getCurrentUser()
      if (userProfile) {
        setProfile(userProfile)
      } else {
        // Fallback to auth user data if database profile doesn't exist
        if (user) {
          setProfile({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'User',
            gender: user.user_metadata?.gender || undefined
          })
        }
      }
    } catch (err) {
      // Fallback to auth user data if database fails
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'User',
          gender: user.user_metadata?.gender || undefined
        })
      } else {
        setError('Failed to load profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updatedProfile = await databaseService.updateUserProfile(profile)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setSuccess('Profile updated successfully!')
      } else {
        setError('Database not ready. Please run the migrations first.')
      }
    } catch (err) {
      setError('An error occurred while updating your profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>My Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={profile.name || 'User'} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'User'}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender (Optional)</Label>
                <select
                  id="gender"
                  value={profile.gender || ''}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
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
                Close
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
