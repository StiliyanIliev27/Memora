import { SignUpForm } from '@/components/auth/SignUpForm'
import { useAuthContext } from '@/stores/AuthContext'
import InteractiveMap from '@/components/3d/InteractiveMap'
import Link from 'next/link'
import { MapPin, Globe, Heart, Users, Sparkles, Navigation, Plane, Camera } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-1000"></div>
      
      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full">
          <div className="flex min-h-[600px]">
            {/* Left Column - Interactive 3D Map (60%) - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
              </div>
              
              {/* Interactive Corner Elements */}
              <div className="absolute top-4 left-4 z-20">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse animation-delay-300"></div>
                  <div className="w-3 h-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-pulse animation-delay-600"></div>
                </div>
              </div>
              
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 z-20 space-y-2">
                <div className="group cursor-pointer">
                  <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20">
                    <Plane className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20">
                    <Camera className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
                  </div>
                </div>
              </div>
              
              {/* Interactive Stats Panel */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Join Thousands</div>
                      <div className="text-lg font-bold text-blue-600">5,247+</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Map Container */}
              <div className="relative w-full h-full">
                <InteractiveMap />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
            
            {/* Right Column - Sign Up Form (40%) */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  {/* Enhanced Logo/Brand */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Enhanced Main Headline */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Join Memora
                    </span>
                  </h1>
                  <p className="text-gray-600">
                    Start your journey of capturing and sharing memories
                  </p>
                  
                  {/* Interactive Features Preview */}
                  <div className="mt-6 flex justify-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Global Memories</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Interactive Map</span>
                    </div>
                  </div>
                </div>
                
                {/* Sign Up Form */}
                <SignUpForm />
                
                {/* Enhanced Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline">
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
