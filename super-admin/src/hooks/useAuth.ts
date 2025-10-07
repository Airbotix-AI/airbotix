import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import logger from '@/utils/logger'
import type { User } from '@supabase/supabase-js'

// Constants following AI coding rules
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  TEACHER: 'teacher'
} as const

const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
} as const

interface UseAuthReturn {
  user: User | null
  userRole: string | null
  isLoading: boolean
  signOut: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          logger.error('Error getting session:', error)
          setUser(null)
          setUserRole(null)
          setIsLoading(false)
          return
        }

        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch user role from profiles table
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()
            
            if (profileError) {
              logger.error('Error fetching profile:', profileError)
              // Set default role for super admin system
              setUserRole(USER_ROLES.SUPER_ADMIN)
            } else {
              setUserRole(profile?.role ?? USER_ROLES.SUPER_ADMIN)
            }
          } catch (error) {
            logger.error('Error in profile fetch:', error)
            setUserRole(USER_ROLES.SUPER_ADMIN)
          }
        } else {
          setUserRole(null)
        }
        
        setIsLoading(false)
      } catch (error) {
        logger.error('Error in getInitialSession:', error)
        setUser(null)
        setUserRole(null)
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state change:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()
            
            if (profileError) {
              logger.error('Error fetching profile on auth change:', profileError)
              setUserRole(USER_ROLES.SUPER_ADMIN)
            } else {
              setUserRole(profile?.role ?? USER_ROLES.SUPER_ADMIN)
            }
          } catch (error) {
            logger.error('Error in auth change profile fetch:', error)
            setUserRole(USER_ROLES.SUPER_ADMIN)
          }
        } else {
          setUserRole(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logger.error('Error signing out:', error)
      } else {
        setUser(null)
        setUserRole(null)
      }
    } catch (error) {
      logger.error('Error in signOut:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    userRole,
    isLoading,
    signOut
  }
}

// Export constants for external use
export { USER_ROLES, AUTH_STATES }

// Export types for external use
export type { UseAuthReturn }