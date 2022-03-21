import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

type Props = {}

export default function login({}: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      router.push('../editor')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (supabase.auth.user()?.id) {
      router.push('../editor')
    }
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex max-w-6xl flex-col space-y-4 rounded p-20 shadow">
        <div className="w-full text-center">
          <h1 className="text-2xl">Welcome back</h1>
          <h2 className="text-lg">Login</h2>
        </div>
        <div className="flex w-full justify-center">
          <input
            className="w-64 focus:outline-blue-500"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-center">
          <input
            type="password"
            className="w-64 focus:outline-blue-500"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-center">
          <button
            onClick={() => handleLogin(email, password)}
            className="w-20 rounded bg-blue-400 p-2 text-white shadow-sm"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
