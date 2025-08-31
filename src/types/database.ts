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
  message?: string
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  connection_id?: string
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
  place_id?: string
}

export interface ConnectionWithUsers extends Connection {
  user1: User
  user2: User
}

export interface MemoryWithConnection extends Memory {
  connection?: ConnectionWithUsers
  connection_type?: string
  is_personal?: boolean
}

export interface MemoryFile {
  id: string
  memory_id: string
  file_url: string
  file_name: string
  file_type: 'photo' | 'video' | 'note'
  file_size: number
  created_at: string
  created_by: string
}

export interface DeletionRequest {
  id: string
  memory_id?: string
  file_id?: string
  requester_id: string
  request_type: 'memory' | 'file'
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  created_at: string
  responded_at?: string
  responder_id?: string
  memory_title?: string
  file_name?: string
  requester_name?: string
}

export interface MemoryWithFiles extends MemoryWithConnection {
  files?: MemoryFile[]
}

export type ConnectionType = 'couple' | 'friend' | 'group'
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected'
export type MemoryType = 'photo' | 'video' | 'note'
export type Gender = 'male' | 'female' | 'non-binary' | 'other'
