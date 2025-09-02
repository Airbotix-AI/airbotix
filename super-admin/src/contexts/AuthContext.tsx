import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

import { PERMISSIONS, ROLE_PERMISSIONS, type Permission } from '../constants/permissions'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('👤 User logged in, fetching profile...')
        fetchProfile(session.user.id)
      } else {
        console.log('👋 User logged out')
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('📊 Fetching profile for user:', userId)
      // Firstly, try direct query
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Profile fetch error:', error.message, 'Code:', error.code)
        
        // If it's a permission issue (PGRST301) or not found (PGRST116)
        if (error.code === 'PGRST301') {
          console.log('🔒 RLS policy denied access - this might be normal for new users')
        } else if (error.code === 'PGRST116') {
          console.log('👤 Profile not found in database')
        }
        
        throw error
      }
      
      console.log('✅ Profile fetched successfully:', data)
      setProfile(data)
      
    } catch (error) {
      console.error('💥 Error fetching profile, will use temporary profile')
      
      // Get current user info to create temporary profile
      const currentUser = await supabase.auth.getUser()
      if (currentUser.data.user) {
        const tempProfile = {
          id: userId,
          email: currentUser.data.user.email || '',
          full_name: currentUser.data.user.user_metadata?.full_name || currentUser.data.user.email || '',
          role: 'super_admin', // Temporary setting to super_admin for testing
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        console.log('🚀 Using temporary profile for:', tempProfile.email)
        setProfile(tempProfile)
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const hasRole = (role: string): boolean => {
    return profile?.role === role
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!profile) return false
    
    const userPermissions = ROLE_PERMISSIONS[profile.role] || []
    return userPermissions.includes(PERMISSIONS.ALL) || userPermissions.includes(permission)
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    hasRole,
    hasPermission
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
