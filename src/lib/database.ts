import { supabase } from './supabase'
import type { User, Connection, Memory, ConnectionWithUsers, MemoryWithConnection } from '@/types/database'

export const databaseService = {
  // User management
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching current user:', error)
      return null
    }

    return data
  },

  async updateUserProfile(updates: Partial<User>): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  },

  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  },

  // Connection management
  async createConnection(user2Id: string, connectionType: 'couple' | 'friend' | 'group'): Promise<Connection | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('connections')
      .insert({
        user1_id: user.id,
        user2_id: user2Id,
        connection_type: connectionType,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating connection:', error)
      return null
    }

    return data
  },

  async getConnections(): Promise<ConnectionWithUsers[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        user1:users!connections_user1_id_fkey(*),
        user2:users!connections_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

    if (error) {
      console.error('Error fetching connections:', error)
      return []
    }

    return data || []
  },

  async updateConnectionStatus(connectionId: string, status: 'accepted' | 'rejected'): Promise<Connection | null> {
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating connection status:', error)
      return null
    }

    return data
  },

  async deleteConnection(connectionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId)

    if (error) {
      console.error('Error deleting connection:', error)
      return false
    }

    return true
  },

  // Memory management
  async createMemory(memoryData: Omit<Memory, 'id' | 'created_at' | 'updated_at'>): Promise<Memory | null> {
    const { data, error } = await supabase
      .from('memories')
      .insert(memoryData)
      .select()
      .single()

    if (error) {
      console.error('Error creating memory:', error)
      return null
    }

    return data
  },

  async getMemories(): Promise<MemoryWithConnection[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('memories')
      .select(`
        *,
        connection:connections!memories_connection_id_fkey(
          *,
          user1:users!connections_user1_id_fkey(*),
          user2:users!connections_user2_id_fkey(*)
        ),
        created_by_user:users!memories_created_by_fkey(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memories:', error)
      return []
    }

    return data || []
  },

  async getMemoriesByConnection(connectionId: string): Promise<MemoryWithConnection[]> {
    const { data, error } = await supabase
      .from('memories')
      .select(`
        *,
        connection:connections!memories_connection_id_fkey(
          *,
          user1:users!connections_user1_id_fkey(*),
          user2:users!connections_user2_id_fkey(*)
        ),
        created_by_user:users!memories_created_by_fkey(*)
      `)
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memories by connection:', error)
      return []
    }

    return data || []
  },

  async updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory | null> {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', memoryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating memory:', error)
      return null
    }

    return data
  },

  async deleteMemory(memoryId: string): Promise<boolean> {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)

    if (error) {
      console.error('Error deleting memory:', error)
      return false
    }

    return true
  }
}
