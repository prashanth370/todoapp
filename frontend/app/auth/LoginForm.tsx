'use client'

import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegistering) {
        await register(username, password)
      } else {
        await login(username, password)
      }
    } catch (error) {
      console.error('Authentication failed:', error)
      setError('Authentication failed. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{isRegistering ? 'Register' : 'Login'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </form>
        <Button
          variant="link"
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 w-full"
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </Button>
      </CardContent>
    </Card>
  )
}