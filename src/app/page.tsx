'use client'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/stores/AuthContext'
import Link from 'next/link'
import { MapPin, Heart, Users, Camera, Globe, Star } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {user ? (
        // Authenticated user - show dashboard
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome back, {user.user_metadata?.name || 'Friend'}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to explore and share your memories?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/map">
              <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="text-blue-600 mb-4">
                  <MapPin className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Map</h3>
                <p className="text-gray-600 mb-6">
                  Explore your memories on a beautiful world map with interactive markers
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Explore Map
                </Button>
              </div>
            </Link>

            <Link href="/add-memory">
              <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="text-purple-600 mb-4">
                  <Camera className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Add Memories</h3>
                <p className="text-gray-600 mb-6">
                  Upload photos, videos, and notes to your favorite locations
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  Add Memory
                </Button>
              </div>
            </Link>

            <Link href="/connections">
              <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="text-green-600 mb-4">
                  <Users className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Connections</h3>
                <p className="text-gray-600 mb-6">
                  Connect with friends, partners, and groups to share memories
                </p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  Manage Connections
                </Button>
              </div>
            </Link>
          </div>
        </div>
        ) : (
          // Non-authenticated user - show landing page
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-24">
              <div className="container mx-auto px-4 text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-6">
                  Share Your Memories, <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Explore the World</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Create an interactive world map where you can save and share your memories 
                  with loved ones. Mark locations with photos, videos, and stories that bring your adventures to life.
                </p>
                <div className="flex gap-6 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Why Choose Memora?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Connect with your loved ones through shared experiences across the globe
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 group-hover:bg-red-200 transition-colors">
                      <Heart className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Couples</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Share romantic moments and travel memories with your partner. Create a visual timeline of your love story across the world.
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6 group-hover:bg-yellow-200 transition-colors">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Friends</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Create shared memories with your closest friends. Plan trips together and relive your adventures through photos and stories.
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Groups</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Organize group trips and events with multiple people. Everyone can contribute their memories to create a collective story.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of people who are already sharing their memories and exploring the world together.
                </p>
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                    Create Your First Memory
                  </Button>
                </Link>
              </div>
            </section>
          </>
        )}
    </>
  )
}
