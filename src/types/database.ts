export interface User {
  id: string
  email: string
  name: string
  gender?: 'male' | 'female' | 'non-binary' | 'other'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Connection {
  id: string
  user1_id: string
  user2_id: string
  connection_type: 'couple' | 'friend' | 'group'
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Memory {
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

export interface ConnectionWithUsers extends Connection {
  user1: User
  user2: User
}

export interface MemoryWithConnection extends Memory {
  connection: ConnectionWithUsers
  created_by_user: User
}

export type ConnectionType = 'couple' | 'friend' | 'group'
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected'
export type MemoryType = 'photo' | 'video' | 'note'
export type Gender = 'male' | 'female' | 'non-binary' | 'other'
