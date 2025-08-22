'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileForm } from '@/components/user/ProfileForm'
import { useAuthContext } from '@/stores/AuthContext'
import { MapPin } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin?redirectTo=/profile')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-12">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <MapPin className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed font-light">
            Manage your account settings and preferences
          </p>
        </div>
        
        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
