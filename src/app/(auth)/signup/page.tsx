import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'
import { MapPin, ArrowRight, ChevronRight } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
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
              Join Memora
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed font-light">
            Start your journey of capturing and sharing memories across the world
          </p>
        </div>
        
        {/* Sign Up Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <SignUpForm />
        </div>
        
        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in here
            </Link>
          </p>
          
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
