'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/stores/AuthContext'
import Link from 'next/link'
import { MapPin, Heart, Users, Plus } from 'lucide-react'

export function Header() {
  const { user, signOut, loading } = useAuthContext()

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memora</h1>
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Always on the left */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memora</h1>
            <MapPin className="h-5 w-5 text-blue-600" />
          </Link>
        </div>

        {/* Navigation - Only show if user is authenticated */}
        {user && (
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/map">
              <Button variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-blue-50">
                <MapPin className="h-4 w-4 mr-2" />
                Map
              </Button>
            </Link>
            <Link href="/memories">
              <Button variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-purple-50">
                <Heart className="h-4 w-4 mr-2" />
                Memories
              </Button>
            </Link>
            <Link href="/connections">
              <Button variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-green-50">
                <Users className="h-4 w-4 mr-2" />
                Connections
              </Button>
            </Link>
          </nav>
        )}

        {/* Right side - Get Started for non-auth users, User menu for auth users */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/add-memory">
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Memory
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
                      <AvatarFallback>
                        {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem>
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
