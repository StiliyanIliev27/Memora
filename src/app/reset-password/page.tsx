'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthContext } from '@/stores/AuthContext'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Globe, Heart, Users, Sparkles, Navigation, Plane, Camera, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import InteractiveMap from '@/components/3d/InteractiveMap'
import { toast } from 'sonner'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword } = useAuthContext()

  // Get access token from URL parameters
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  useEffect(() => {
    // Check if we have the required tokens
    if (!accessToken || !refreshToken) {
      toast.error('Invalid or expired reset link. Please request a new password reset.')
    }
  }, [accessToken, refreshToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate passwords
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(password)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password updated successfully! Redirecting to sign in...')
        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    return checks
  }

  const passwordChecks = validatePassword(password)

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
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Secure Update</div>
                      <div className="text-lg font-bold text-green-600">Protected</div>
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
            
            {/* Right Column - Reset Password Form (40%) */}
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
                      Set New Password
                    </span>
                  </h1>
                  <p className="text-gray-600">
                    Create a strong password to secure your account
                  </p>
                  
                  {/* Interactive Features Preview */}
                  <div className="mt-6 flex justify-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Secure Password</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Account Protected</span>
                    </div>
                  </div>
                </div>
                
                {/* Reset Password Form */}
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {password && (
                          <div className="mt-3 space-y-2">
                            <div className="text-xs font-medium text-gray-600">Password strength:</div>
                            <div className="space-y-1">
                              {[
                                { key: 'length', label: 'At least 6 characters', check: passwordChecks.length },
                                { key: 'uppercase', label: 'One uppercase letter', check: passwordChecks.uppercase },
                                { key: 'lowercase', label: 'One lowercase letter', check: passwordChecks.lowercase },
                                { key: 'number', label: 'One number', check: passwordChecks.number },
                                { key: 'special', label: 'One special character', check: passwordChecks.special }
                              ].map(({ key, label, check }) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <CheckCircle className={`h-3 w-3 ${check ? 'text-green-500' : 'text-gray-300'}`} />
                                  <span className={`text-xs ${check ? 'text-green-600' : 'text-gray-500'}`}>
                                    {label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                        disabled={loading || !accessToken || !refreshToken}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating Password...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4" />
                            <span>Update Password</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Enhanced Back to Sign In Link */}
                <div className="text-center mt-8">
                  <Link 
                    href="/signin" 
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors hover:underline font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
