import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { APP_STRINGS } from '@/constants/strings'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const redirectedRef = useRef(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  // If user is authenticated, redirect to admin dashboard
  useEffect(() => {
    if (redirectedRef.current) return
    if (!loading && user) {
      if (location.pathname !== '/admin') {
        console.log('User authenticated, redirecting to admin dashboard')
        redirectedRef.current = true
        navigate('/admin', { replace: true })
      }
    }
  }, [user, loading, navigate, location.pathname])

  // Reset redirect guard after sign-out so future logins can navigate again
  useEffect(() => {
    if (!loading && !user) {
      redirectedRef.current = false
    }
  }, [user, loading, location.pathname])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      console.log('[Login] Sending magic link to:', email)
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // Use a dedicated callback route to finalize auth
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`
        }
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Check your email for the login link!'
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {APP_STRINGS.AUTH_LOGIN_TITLE}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {APP_STRINGS.AUTH_LOGIN_SUBTITLE}
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <div className="text-sm text-blue-800">
              <h3 className="font-medium mb-2">How to login:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter your email address below</li>
                <li>Click "Send Magic Link"</li>
                <li>Check your email for the login link</li>
                <li>Click the link to access the admin dashboard</li>
              </ul>
              <p className="mt-2 text-xs text-blue-600">
                Note: This uses email magic links, not SMS codes. Make sure to check your email (including spam folder).
              </p>
            </div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your email address"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 
                message.type === 'error' ? 'bg-red-50 text-red-800' : 
                'bg-blue-50 text-blue-800'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Magic Link...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account? Sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
