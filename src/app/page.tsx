'use client'

import { useAuthContext } from '@/stores/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { FloatingNavigation } from '@/components/layout/FloatingNavigation'
import { ProfileDropdown } from '@/components/layout/ProfileDropdown'
import InteractiveMap, { InteractiveMapRef } from '@/components/maps/InteractiveMap'
import { MemoryModal } from '@/components/memories/MemoryModal'
import { MemoryMarker } from '@/types/map'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Heart, Users, Camera, Globe, Star, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<any>(null)
  const [selectedMemory, setSelectedMemory] = useState<MemoryMarker | null>(null)
  const [showMemoryModal, setShowMemoryModal] = useState(false)
  const mapRef = useRef<InteractiveMapRef>(null)

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect, just show the landing page
    }
  }, [user, loading, router])

  const handleLocationSelected = (location: { lat: number; lng: number }, details?: any) => {
    setSelectedLocation(location)
    setSelectedLocationDetails(details)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    // Authenticated user - show dashboard

    return (
      <div className="h-screen relative overflow-hidden">
        {/* Full-screen map background */}
        <div className="absolute inset-0">
          <InteractiveMap ref={mapRef} onLocationSelected={handleLocationSelected} />
        </div>
        
        {/* Left floating navigation */}
        <div className="absolute left-4 top-4 bottom-4 z-10">
          <FloatingNavigation 
            selectedLocation={selectedLocation} 
            selectedLocationDetails={selectedLocationDetails}
            onStartAddMemory={() => {
              mapRef.current?.startAddMemory()
            }}
            onMemoryClick={(memory) => {
              setSelectedMemory(memory)
              setShowMemoryModal(true)
            }}
          />
        </div>
        
        {/* Top-right profile dropdown */}
        <div className="absolute top-4 right-4 z-10">
          <ProfileDropdown />
        </div>
        
        {/* Main content area (for modals/popups) */}
        <div className="relative z-20">
          {/* Memory Modal */}
          <MemoryModal
            memory={selectedMemory}
            isOpen={showMemoryModal}
            onClose={() => {
              setShowMemoryModal(false)
              setSelectedMemory(null)
            }}
            onUpdate={() => {
              // Refresh the map when memory is updated
              mapRef.current?.loadMemories()
            }}
          />
        </div>
      </div>
    )
  }

  // Non-authenticated user - show landing page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Sophisticated Design */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Logo/Brand */}
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
                <span className="block">Capture</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Every Moment
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Transform your memories into an interactive world map. Share experiences, 
                connect with loved ones, and create lasting stories across the globe.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <Link href="/signup">
                  <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="relative z-10">Start Your Journey</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline" size="lg" className="px-12 py-6 text-lg font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    Sign In
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>150+ Countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Elegant Grid */}
        <section className="py-32 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memora</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the perfect blend of technology and emotion. 
                Create, share, and relive your most precious moments.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Interactive Maps */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Memory Maps</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Pin your memories to beautiful, interactive maps. Customize styles, 
                        add photos and videos, and create your personal world story.
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Explore Maps
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Sharing */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Together</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Connect with partners, friends, and groups. Create shared collections 
                        where everyone contributes to building beautiful memories.
                      </p>
                      <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Connections */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Connections</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Build meaningful relationships across continents. Whether couples, 
                        friends, or groups, create lasting bonds through shared experiences.
                      </p>
                      <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                        Discover Connections
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Capture */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Memory Capture</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Effortlessly capture and organize your memories. Upload photos, 
                        videos, and notes with intelligent organization features.
                      </p>
                      <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                        Start Capturing
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section - Elegant Stats */}
        <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Memory Makers Worldwide
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join a global community of people who believe in preserving and sharing life's precious moments.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4">10K+</div>
                  <div className="text-gray-600 font-medium">Active Users</div>
                  <div className="text-sm text-gray-500 mt-2">Creating memories daily</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-4">50K+</div>
                  <div className="text-gray-600 font-medium">Memories Shared</div>
                  <div className="text-sm text-gray-500 mt-2">Stories worth telling</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">150+</div>
                  <div className="text-gray-600 font-medium">Countries Explored</div>
                  <div className="text-sm text-gray-500 mt-2">Global adventures</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Sophisticated */}
        <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.2)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.2)_0%,transparent_50%)]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Ready to Begin Your Story?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of people who are already creating, sharing, and preserving 
                their most precious memories with Memora.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="group relative overflow-hidden bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform">
                    <span className="relative z-10">Create Your First Memory</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline" size="lg" className="px-12 py-6 text-lg font-semibold rounded-2xl border-2 border-white/30 text-black hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform">
                    Sign In to Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
