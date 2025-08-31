import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})



export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          gender?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          gender?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          gender?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          connection_type: 'couple' | 'friend' | 'group'
          status: 'pending' | 'accepted' | 'rejected'
          message?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          connection_type: 'couple' | 'friend' | 'group'
          status?: 'pending' | 'accepted' | 'rejected'
          message?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          connection_type?: 'couple' | 'friend' | 'group'
          status?: 'pending' | 'accepted' | 'rejected'
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          connection_id: string
          title: string
          description?: string
          location_name: string
          latitude: number
          longitude: number
          memory_type: 'photo' | 'video' | 'note'
          file_url?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          title: string
          description?: string
          location_name: string
          latitude: number
          longitude: number
          memory_type: 'photo' | 'video' | 'note'
          file_url?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          title?: string
          description?: string
          location_name?: string
          latitude?: number
          longitude?: number
          memory_type?: 'photo' | 'video' | 'note'
          file_url?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
