import { SignUpForm } from '@/components/auth/SignUpForm'
import { EnvChecker } from '@/components/debug/EnvChecker'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Memora</h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your memories, explore the world
          </p>
        </div>
        
        <EnvChecker />
        <SignUpForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
