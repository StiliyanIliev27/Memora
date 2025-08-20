'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthContext } from '@/stores/AuthContext'
import { databaseService } from '@/lib/database'
import type { User } from '@/types/database'

export function ProfileForm() {
  const [profile, setProfile] = useState<Partial<User>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

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
        // If update fails, it might be because the profile doesn't exist yet
        // This could happen if the database migrations haven't been run
        setError('Database not ready. Please run the migrations first.')
      }
    } catch (err) {
      setError('An error occurred while updating your profile. Make sure the database is set up correctly.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Loading your profile...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">
          Update your profile information
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Input
              id="email"
              type="email"
              value={profile.email || ''}
              disabled
              className="bg-gray-50"
            />
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

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
      </form>
    </div>
  </div>
  )
}
