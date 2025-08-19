'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
    connectionTest: string
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    connectionTest: 'Not tested'
  })

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      connectionTest: 'Checking...'
    })

    // Test connection
    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      .then(response => {
        if (response.ok) {
          setEnvStatus(prev => ({ ...prev, connectionTest: 'Connected ✅' }))
        } else {
          setEnvStatus(prev => ({ ...prev, connectionTest: `Error: ${response.status}` }))
        }
      })
      .catch(error => {
        setEnvStatus(prev => ({ ...prev, connectionTest: `Failed: ${error.message}` }))
      })
    } else {
      setEnvStatus(prev => ({ ...prev, connectionTest: 'Cannot test - missing env vars' }))
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle>Environment Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Supabase URL:</span>
          <span className={envStatus.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
            {envStatus.supabaseUrl ? '✅ Set' : '❌ Missing'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Supabase Key:</span>
          <span className={envStatus.supabaseKey ? 'text-green-600' : 'text-red-600'}>
            {envStatus.supabaseKey ? '✅ Set' : '❌ Missing'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Connection:</span>
          <span className={
            envStatus.connectionTest === 'Connected ✅' ? 'text-green-600' : 
            envStatus.connectionTest === 'Checking...' ? 'text-yellow-600' : 'text-red-600'
          }>
            {envStatus.connectionTest}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
