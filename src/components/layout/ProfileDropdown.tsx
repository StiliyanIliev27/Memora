'use client'

import { useState } from 'react'
import { useAuthContext } from '@/stores/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { ProfileModal } from '@/components/user/ProfileModal'

export function ProfileDropdown() {
  const { user, signOut } = useAuthContext()
  const [showProfile, setShowProfile] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
              <AvatarFallback className="text-sm">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl border border-gray-200 shadow-lg" align="end" forceMount>
          <DropdownMenuItem onClick={() => setShowProfile(true)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      {showProfile && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  )
}
