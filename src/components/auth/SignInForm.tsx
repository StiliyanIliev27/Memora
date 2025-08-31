'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthContext } from '@/stores/AuthContext'
import { toast } from 'sonner'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const { signIn, user } = useAuthContext()

  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('redirectTo') || '/'
      router.push(redirectTo)
    }
  }, [user, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Sign in successful! Redirecting...')
        setTimeout(() => {
          const redirectTo = searchParams.get('redirectTo') || '/'
          router.push(redirectTo)
        }, 1500)
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
