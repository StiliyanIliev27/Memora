import { supabase } from './supabase'
import type { User, Connection, Memory, ConnectionWithUsers, MemoryWithConnection, MemoryFile, DeletionRequest } from '@/types/database'

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
      return null
    }

    return data
  },

  async createConnectionByEmail(connectionData: {
    recipientEmail: string
    relationshipType: 'couple' | 'friend' | 'group'
    message?: string
    senderId: string
  }): Promise<{ data: Connection | null; error: Error | null }> {
    try {
      // First, find the recipient user by email
      const { data: recipientUser, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', connectionData.recipientEmail)
        .single()

      if (userError || !recipientUser) {
        return {
          data: null,
          error: new Error('User not found with this email address')
        }
      }

      // Check if connection already exists
      const { data: existingConnections } = await supabase
        .from('connections')
        .select('*')
        .or(`user1_id.eq.${connectionData.senderId},user2_id.eq.${connectionData.senderId}`)

      const existingConnection = existingConnections?.find(conn => 
        (conn.user1_id === connectionData.senderId && conn.user2_id === recipientUser.id) ||
        (conn.user1_id === recipientUser.id && conn.user2_id === connectionData.senderId)
      )

      if (existingConnection) {
        return {
          data: null,
          error: new Error('Connection already exists between these users')
        }
      }

      // Create the connection
      const { data, error } = await supabase
        .from('connections')
        .insert({
          user1_id: connectionData.senderId,
          user2_id: recipientUser.id,
          connection_type: connectionData.relationshipType,
          status: 'pending',
          message: connectionData.message
        })
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: new Error(error.message)
        }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('An unexpected error occurred')
      }
    }
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
      return []
    }

    return data || []
  },

  async getMemoriesForConnection(connectionId: string): Promise<MemoryWithConnection[]> {
    return this.getMemoriesByConnection(connectionId)
  },

  // Memory Files Functions
  async getMemoryFiles(memoryId: string): Promise<MemoryFile[]> {
    const { data, error } = await supabase
      .rpc('get_memory_files', { memory_uuid: memoryId })

    if (error) {
      return []
    }

    return data || []
  },

  async addFileToMemory(memoryId: string, file: File): Promise<MemoryFile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Check file size limits
    const maxPhotoSize = 5 * 1024 * 1024 // 5MB
    const maxVideoSize = 50 * 1024 * 1024 // 50MB
    const maxNoteSize = 1 * 1024 * 1024 // 1MB

    let fileType: 'photo' | 'video' | 'note' = 'note'
    if (file.type.startsWith('image/')) {
      fileType = 'photo'
      if (file.size > maxPhotoSize) {
        throw new Error('Photo size must be less than 5MB')
      }
    } else if (file.type.startsWith('video/')) {
      fileType = 'video'
      if (file.size > maxVideoSize) {
        throw new Error('Video size must be less than 50MB')
      }
    } else {
      if (file.size > maxNoteSize) {
        throw new Error('File size must be less than 1MB')
      }
    }

    // Check file count limits
    const existingFiles = await this.getMemoryFiles(memoryId)
    const photoCount = existingFiles.filter(f => f.file_type === 'photo').length
    const videoCount = existingFiles.filter(f => f.file_type === 'video').length

    if (fileType === 'photo' && photoCount >= 10) {
      throw new Error('Maximum 10 photos allowed per memory')
    }
    if (fileType === 'video' && videoCount >= 5) {
      throw new Error('Maximum 5 videos allowed per memory')
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${memoryId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('memories')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error('Error uploading file')
    }

    const { data: urlData } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath)

    // Save file record to database
    const { data, error } = await supabase
      .from('memory_files')
      .insert({
        memory_id: memoryId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      throw new Error('Error saving file record')
    }

    return data
  },

  async deleteMemoryFile(fileId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Get file info first
    const { data: fileData, error: fileError } = await supabase
      .from('memory_files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !fileData) {
      return false
    }

    // Delete from storage
    const filePath = fileData.file_url.split('/').slice(-3).join('/')
    const { error: storageError } = await supabase.storage
      .from('memories')
      .remove([filePath])

    if (storageError) {
      // Storage error occurred
    }

    // Delete from database
    const { error } = await supabase
      .from('memory_files')
      .delete()
      .eq('id', fileId)

    return !error
  },

  // Deletion Request Functions
  async createDeletionRequest(
    memoryId?: string,
    fileId?: string,
    message?: string
  ): Promise<DeletionRequest | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const requestType = memoryId ? 'memory' : 'file'

    const { data, error } = await supabase
      .from('deletion_requests')
      .insert({
        memory_id: memoryId,
        file_id: fileId,
        requester_id: user.id,
        request_type: requestType,
        message
      })
      .select()
      .single()

    if (error) {
      return null
    }

    return data
  },

  async getDeletionRequestsForConnection(connectionId: string): Promise<DeletionRequest[]> {
    try {
      const { data, error } = await supabase.rpc('get_deletion_requests_for_connection', {
        connection_uuid: connectionId
      })

      if (error) {
        return []
      }

      // Filter to only show requests where current user is NOT the requester
      // (i.e., only show requests they need to respond to)
      const currentUser = (await supabase.auth.getUser()).data.user
      if (!currentUser) return []

      return (data || []).filter((request: DeletionRequest) => request.requester_id !== currentUser.id)
    } catch (error) {
      return []
    }
  },

  async getUserDeletionRequests(connectionId: string): Promise<DeletionRequest[]> {
    try {
      const { data, error } = await supabase.rpc('get_deletion_requests_for_connection', {
        connection_uuid: connectionId
      })

      if (error) {
        return []
      }

      // Filter to only show requests where current user IS the requester
      // (i.e., only show their own pending requests)
      const currentUser = (await supabase.auth.getUser()).data.user
      if (!currentUser) return []

      return (data || []).filter((request: DeletionRequest) => request.requester_id === currentUser.id)
    } catch (error) {
      return []
    }
  },

  async respondToDeletionRequest(
    requestId: string,
    status: 'approved' | 'rejected'
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
      .from('deletion_requests')
      .update({
        status,
        responded_at: new Date().toISOString(),
        responder_id: user.id
      })
      .eq('id', requestId)

    if (error) {
      return false
    }

    // If approved, delete the memory or file
    if (status === 'approved') {
      const { data: request } = await supabase
        .from('deletion_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (request) {
        if (request.request_type === 'memory' && request.memory_id) {
          return await this.deleteMemory(request.memory_id)
        } else if (request.request_type === 'file' && request.file_id) {
          return await this.deleteMemoryFile(request.file_id)
        }
      }
    }

    return true
  },

  async updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory | null> {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', memoryId)
      .select()
      .single()

    if (error) {
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
      return false
    }

    return true
  },

  // Enhanced memory functions
  async getUserMemories(): Promise<MemoryWithConnection[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Use the database function we created
    const { data, error } = await supabase
      .rpc('get_memories_for_user', { user_uuid: user.id })

    if (error) {
      return []
    }

    return data || []
  },

  async getConnectionDetails(connectionId: string): Promise<ConnectionWithUsers | null> {
    if (!connectionId) return null

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        user1:users!connections_user1_id_fkey(*),
        user2:users!connections_user2_id_fkey(*)
      `)
      .eq('id', connectionId)
      .single()

    if (error) {
      return null
    }

    return data
  },

  async createMemoryWithLocation(memoryData: {
    connection_id?: string
    title: string
    description?: string
    location_name: string
    latitude: number
    longitude: number
    memory_type: 'photo' | 'video' | 'note'
    file_url?: string
    place_id?: string
    city?: string
    country?: string
    state?: string
  }): Promise<Memory | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('memories')
      .insert({
        ...memoryData,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      return null
    }

    return data
  }
}
