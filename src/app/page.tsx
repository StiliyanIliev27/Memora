'use client'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/stores/AuthContext'
import Link from 'next/link'
import { MapPin, Heart, Users, Camera, Globe, Star, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
        // Authenticated user - show dashboard with app layout
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome back, {user.user_metadata?.name || 'Friend'}!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Ready to explore and share your memories?
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Link href="/map">
                  <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="text-blue-600 mb-4">
                      <MapPin className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Interactive Map</h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      Explore your memories on a beautiful world map with interactive markers
                    </p>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 mt-auto">
                      Explore Map
                    </Button>
                  </div>
                </Link>

                <Link href="/add-memory">
                  <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="text-purple-600 mb-4">
                      <Camera className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Add Memories</h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      Upload photos, videos, and notes to your favorite locations
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 mt-auto">
                      Add Memory
                    </Button>
                  </div>
                </Link>

                <Link href="/connections">
                  <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="text-green-600 mb-4">
                      <Users className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Connections</h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      Connect with friends, partners, and groups to share memories
                    </p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 mt-auto">
                      Manage Connections
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        // Non-authenticated user - show landing page with header and footer
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {/* Hero Section - Mapbox Style */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-32 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-8 shadow-2xl">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <h1 className="text-7xl font-bold text-white mb-8 leading-tight">
                    Maps that do more
                  </h1>
                  <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                    The location platform for sharing memories, connecting with loved ones, and exploring the world together
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/signup">
                      <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl rounded-xl font-semibold">
                        Get started for free
                      </Button>
                    </Link>
                    <Link href="/signin">
                      <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold">
                        Contact us
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid - Pin Traveler Style */}
            <section className="py-32 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    Bring location to life with beautiful memories
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Use Memora's interactive maps, ready-made templates, and live updating features to build customizable memory maps for web and mobile.
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                  {/* Interactive Maps */}
                  <div className="group">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl mb-6 group-hover:shadow-xl transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Memory Maps</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Create beautiful, interactive maps where you can pin your memories with photos, videos, and stories. 
                        Customize your map with different styles and share with loved ones.
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Explore Maps
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Memory Sharing */}
                  <div className="group">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl mb-6 group-hover:shadow-xl transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-xl mb-6">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Memories Together</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Connect with partners, friends, and groups to create shared memory collections. 
                        Everyone can contribute photos and stories to build a collective journey.
                      </p>
                      <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                        Learn More
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Global Connections */}
                  <div className="group">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl mb-6 group-hover:shadow-xl transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-6">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Connections</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Build meaningful connections across the globe. Whether it's couples, friends, or groups, 
                        create lasting bonds through shared experiences and memories.
                      </p>
                      <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                        Discover Connections
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Smart Search */}
                  <div className="group">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl mb-6 group-hover:shadow-xl transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-xl mb-6">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Memory Capture</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Easily capture and organize your memories with intelligent features. 
                        Upload photos, videos, and notes, then let Memora help you organize them beautifully.
                      </p>
                      <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                        Start Capturing
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Trusted by memory makers worldwide
                  </h2>
                  <p className="text-xl text-gray-600">
                    Join thousands of people who are already sharing their memories and exploring the world together
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
                    <div className="text-gray-600">Memories Shared</div>
                  </div>
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
                    <div className="text-gray-600">Countries Explored</div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section - Mapbox Style */}
            <section className="py-32 bg-gradient-to-r from-slate-900 to-blue-900">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-5xl font-bold text-white mb-8">
                  Ready to get started?
                </h2>
                <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                  Create an account or talk to one of our experts about building your perfect memory map.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl rounded-xl font-semibold">
                      Sign up for free
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold">
                      Contact us
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
