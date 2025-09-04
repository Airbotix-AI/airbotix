import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User as AppUser, AuthState } from '@/types'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthState({ user: null, loading: false, error: error.message })
          return
        }

        if (session?.user) {
          const appUser = mapSupabaseUserToAppUser(session.user)
          setAuthState({ user: appUser, loading: false, error: null })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      } catch (error) {
        setAuthState({ 
          user: null, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const appUser = mapSupabaseUserToAppUser(session.user)
          setAuthState({ user: appUser, loading: false, error: null })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      } else {
        setAuthState({ user: null, loading: false, error: null })
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }

  return {
    ...authState,
    signOut,
  }
}

// Helper function to map Supabase User to our App User type
const mapSupabaseUserToAppUser = (user: User): AppUser => ({
  id: user.id,
  email: user.email || '',
  name: user.user_metadata?.name || user.email || '',
  role: 'super_admin', // Default role for super admin system
  avatar_url: user.user_metadata?.avatar_url,
  created_at: user.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
})
