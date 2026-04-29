import { createClient } from '@supabase/supabase-js'
import type { Analysis, Profile, ResumeFile } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      analyses: {
        Row: Analysis
        Insert: Omit<Analysis, 'id' | 'created_at'>
        Update: Partial<Omit<Analysis, 'id' | 'created_at'>>
      }
      resume_files: {
        Row: ResumeFile
        Insert: Omit<ResumeFile, 'id' | 'created_at'>
        Update: Partial<Omit<ResumeFile, 'id' | 'created_at'>>
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
