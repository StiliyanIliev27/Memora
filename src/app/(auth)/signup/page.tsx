import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'
import { MapPin, ArrowRight, ChevronRight, Heart, Users } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Left Column - Interactive Map (60%) - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                {/* Floating Memory Markers */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg flex items-center justify-center animate-pulse">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                        <div className="font-semibold text-gray-900">Paris, France</div>
                        <div className="text-gray-600">Our first trip together</div>
                      </div>
                      <div className="w-2 h-2 bg-white transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-full shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '1s'}}>
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                        <div className="font-semibold text-gray-900">Tokyo, Japan</div>
                        <div className="text-gray-600">Friends adventure</div>
                      </div>
                      <div className="w-2 h-2 bg-white transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="w-8 h-8 bg-purple-500 rounded-full shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                        <div className="font-semibold text-gray-900">New York, USA</div>
                        <div className="text-gray-600">Business trip memories</div>
                      </div>
                      <div className="w-2 h-2 bg-white transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12">
                <div className="max-w-md">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4">
                    Start Your <br />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Memory Journey
                    </span>
                  </h2>
                  
                  <p className="text-lg text-white/90 mb-8 leading-relaxed">
                    Join thousands of people who are already creating, sharing, and preserving 
                    their most precious memories with Memora.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">Interactive world maps</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white/80">Share with loved ones</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-white/80">Beautiful memory galleries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Sign Up Form (40%) */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  {/* Logo/Brand */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Main Headline */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Join Memora
                    </span>
                  </h1>
                  <p className="text-gray-600">
                    Start your journey of capturing and sharing memories
                  </p>
                </div>
                
                {/* Sign Up Form */}
                <SignUpForm />
                
                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
