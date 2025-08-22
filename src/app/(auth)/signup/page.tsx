import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import InteractiveMap from '@/components/3d/InteractiveMap'

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
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full">
          <div className="flex min-h-[600px]">
            {/* Left Column - Interactive 3D Map (60%) - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
              <InteractiveMap />
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
