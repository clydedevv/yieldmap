'use client'

import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = 'btcsummer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = () => {
      try {
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-auth='))
          ?.split('=')[1]
        
        const authenticated = authCookie === 'authenticated'
        console.log('Auth check:', { authCookie, authenticated, allCookies: document.cookie })
        setIsAuthenticated(authenticated || false)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      }
    }
    
    // Immediate check
    checkAuth()
    
    // Fallback timeout in case something goes wrong
    const fallbackTimeout = setTimeout(() => {
      if (isAuthenticated === null) {
        console.log('Fallback: setting auth to false')
        setIsAuthenticated(false)
      }
    }, 1000)
    
    return () => clearTimeout(fallbackTimeout)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password === ADMIN_PASSWORD) {
      // Set authentication cookie (expires in 24 hours)
      document.cookie = 'admin-auth=authenticated; path=/; max-age=86400; secure; samesite=strict'
      setIsAuthenticated(true)
    } else {
      setError('Invalid password')
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setIsAuthenticated(false)
    setPassword('')
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">₿</div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">₿</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h1>
            <p className="text-slate-600">Enter password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder:text-slate-500"
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              BTC Yield Explorer Admin Panel
            </p>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, show admin content with logout option
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  )
} 