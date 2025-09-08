import { createClient } from '@supabase/supabase-js'

// Environment variable validation and security configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Security checks
if (!supabaseUrl) {
  throw new Error(
    '❌ Missing VITE_SUPABASE_URL environment variable. ' +
    'Please check your .env.local file and ensure it contains VITE_SUPABASE_URL.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    '❌ Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
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
            workshops: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          overview: string
          duration: string
          target_audience: string
          start_date: string
          end_date: string
          status: 'draft' | 'completed' | 'archived'
          highlights: any // JSONB
          syllabus: any // JSONB
          materials: any // JSONB
          assessment: any // JSONB
          learning_outcomes: any // JSONB
          media: any // JSONB
          seo: any // JSONB
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          overview: string
          duration: string
          target_audience: string
          start_date: string
          end_date: string
          status: 'draft' | 'completed' | 'archived'
          highlights: any // JSONB
          syllabus: any // JSONB
          materials: any // JSONB
          assessment: any // JSONB
          learning_outcomes: any // JSONB
          media: any // JSONB
          seo: any // JSONB
          source: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          overview?: string
          duration?: string
          target_audience?: string
          start_date?: string
          end_date?: string
          status?: 'draft' | 'completed' | 'archived'
          highlights?: any // JSONB
          syllabus?: any // JSONB
          materials?: any // JSONB
          assessment?: any // JSONB
          learning_outcomes?: any // JSONB
          media?: any // JSONB
          seo?: any // JSONB
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
