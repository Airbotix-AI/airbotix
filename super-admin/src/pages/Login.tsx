import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { APP_STRINGS } from '@/constants/strings'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // If user is authenticated, redirect to admin dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log('✅ User authenticated, redirecting to admin dashboard')
      navigate('/admin', { replace: true })
    }
  }, [user, loading, navigate])

  // 显示loading状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
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
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(221.2 83.2% 53.3%)',
                    brandAccent: 'hsl(221.2 83.2% 53.3%)',
                  },
                },
              },
              className: {
                container: 'auth-container',
                label: 'auth-label',
                input: 'auth-input',
                button: 'auth-button',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/#/admin`}
            onlyThirdPartyProviders={false}
            magicLink={true}
            view="magic_link"
            theme="light"
          />
        </div>
      </div>
    </div>
  )
}
