"use client"

import { useAuth } from './auth/AuthContext'
import TodoList from './TodoList'
import LoginForm from './auth/LoginForm'

export default function Home() {
  const { token } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {token ? <TodoList /> : <LoginForm />}
    </main>
  )
}