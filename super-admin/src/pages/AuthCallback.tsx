import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const [message, setMessage] = useState<string>('Processing authentication...')
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const processCallback = async () => {
      console.log('[AuthCallback] location.href:', window.location.href)
      console.log('[AuthCallback] hash:', window.location.hash)
      console.log('[AuthCallback] search:', window.location.search)

      // Surface errors from the hash if present
      const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash
      const params = new URLSearchParams(hash)
      const error = params.get('error')
      const errorDescription = params.get('error_description')
      if (error) {
        console.error('[AuthCallback] Error from provider:', error, errorDescription)
        setMessage(decodeURIComponent(errorDescription || 'Authentication failed.'))
        return
      }

      try {
        // Give supabase client a tick to parse hash/query and set the session
        await new Promise(r => setTimeout(r, 50))

        // 1) Check current session immediately
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.warn('[AuthCallback] getSession error:', sessionError.message)
        }
        if (sessionData.session) {
          console.log('[AuthCallback] session present, redirecting to /admin')
          navigate('/admin', { replace: true })
          return
        }

        // 2) Fallback: wait for auth state change (e.g., SIGNED_IN)
        setMessage('Finalizing authentication...')
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('[AuthCallback] onAuthStateChange:', event, !!session)
          if (session) {
            subscription.unsubscribe()
            navigate('/admin', { replace: true })
          }
        })

        // 3) Safety timeout to avoid hanging on this page
        setTimeout(async () => {
          subscription.unsubscribe()
          const { data } = await supabase.auth.getSession()
          if (data.session) {
            navigate('/admin', { replace: true })
          } else {
            console.warn('[AuthCallback] No session established after timeout')
            setMessage('Authentication failed. Please try logging in again.')
          }
        }, 5000)
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err)
        setMessage('Authentication error. Please try again.')
      }
    }

    processCallback()
  }, [navigate, location.key])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 text-sm">{message}</p>
        <p className="text-gray-500 text-xs mt-2">You can close this page if it takes too long.</p>
      </div>
    </div>
  )
}


