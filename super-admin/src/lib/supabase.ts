import { createClient } from '@supabase/supabase-js'

// Environment variable validation and security configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Security checks
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please check your .env.local file and ensure it contains VITE_SUPABASE_URL.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please check your .env.local file and ensure it contains VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          date_of_birth: string
          school: string
          grade: string
          parent_email: string
          parent_phone: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          skill_level: string
          status: string
          special_requirements: string
          progress_comments: string
          medical_notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date_of_birth: string
          school: string
          grade: string
          parent_email: string
          parent_phone: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          skill_level: string
          status: string
          special_requirements?: string
          progress_comments?: string
          medical_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date_of_birth?: string
          school?: string
          grade?: string
          parent_email?: string
          parent_phone?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relation?: string
          skill_level?: string
          status?: string
          special_requirements?: string
          progress_comments?: string
          medical_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
