export interface MemoryMarker {
  id: string
  position: [number, number]
  icon: 'heart' | 'users' | 'mappin'
  color: string
  location: string
  description: string
  title: string
  date: string
  created_by: string
  images?: string[]
  videos?: string[]
  files?: string[]
  connection_id?: string
  connection_type?: 'couple' | 'friend' | 'group'
  is_personal?: boolean
  connection?: {
    user1: { name: string; email: string }
    user2: { name: string; email: string }
    connection_type: 'couple' | 'friend' | 'group'
  }
}
