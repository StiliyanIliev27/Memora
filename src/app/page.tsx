'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/stores/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {user ? (
          // Authenticated user - show dashboard
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome back, {user.user_metadata?.name || 'Friend'}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ready to explore and share your memories?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-gray-600 mb-4">
                  Explore your memories on a beautiful world map
                </p>
                <Button className="w-full">View Map</Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">📸</div>
                <h3 className="text-xl font-semibold mb-2">Add Memories</h3>
                <p className="text-gray-600 mb-4">
                  Upload photos, videos, and notes to your locations
                </p>
                <Button className="w-full">Add Memory</Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">Connections</h3>
                <p className="text-gray-600 mb-4">
                  Connect with friends, partners, and groups
                </p>
                <Button className="w-full">Manage Connections</Button>
              </div>
            </div>
          </div>
        ) : (
          // Non-authenticated user - show landing page
          <div className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Share Your Memories, <br />
                  <span className="text-blue-600">Explore the World</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Create an interactive world map where you can save and share your memories 
                  with loved ones. Mark locations with photos, videos, and stories.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 py-3">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Why Choose Memora?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold mb-2">Couples</h3>
                    <p className="text-gray-600">
                      Share romantic moments and travel memories with your partner
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold mb-2">Friends</h3>
                    <p className="text-gray-600">
                      Create shared memories with your closest friends
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold mb-2">Groups</h3>
                    <p className="text-gray-600">
                      Organize group trips and events with multiple people
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
