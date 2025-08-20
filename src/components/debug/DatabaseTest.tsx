'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { databaseService } from '@/lib/database'
import type { User } from '@/types/database'

export function DatabaseTest() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testGetCurrentUser = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await databaseService.getCurrentUser()
      setCurrentUser(user)
    } catch (err) {
      setError('Failed to fetch current user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle>Database Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testGetCurrentUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Get Current User'}
        </Button>

        {currentUser && (
          <div className="p-3 bg-green-50 rounded-md">
            <h4 className="font-semibold text-green-800">Current User:</h4>
            <pre className="text-sm text-green-700 mt-2">
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
