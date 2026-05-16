'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login failed')

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-max-w-md p-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
            <span className="font-bold text-3xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[var(--text-muted)]">Sign in to manage your tasks effectively</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                className="input-field pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="input-field pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-3 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
