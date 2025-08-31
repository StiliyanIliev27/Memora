'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Camera, FileText, Video, Upload, MapPin, X, Users, Heart, Star, File, Image, Play } from 'lucide-react'
import { LocationAutocomplete } from '@/components/ui/location-autocomplete'
import { databaseService } from '@/lib/database'
import { useAuthContext } from '@/stores/AuthContext'
import { ConnectionWithUsers } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AddMemoryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedLocation?: { lat: number; lng: number } | null
  selectedLocationDetails?: any
}


const CONNECTION_ICONS = {
  couple: { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  friend: { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  group: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
}

export function AddMemoryModal({ isOpen, onClose, selectedLocation, selectedLocationDetails }: AddMemoryModalProps) {
  const { user } = useAuthContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [memoryType, setMemoryType] = useState('')
  const [connectionId, setConnectionId] = useState<string>('personal')
  const [connections, setConnections] = useState<ConnectionWithUsers[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [locationDetails, setLocationDetails] = useState<any>(null)

  // Load connections when modal opens
  useEffect(() => {
    if (isOpen) {
      loadConnections()
    }
  }, [isOpen])

  // Auto-populate coordinates and location details when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation.lat.toString())
      setLongitude(selectedLocation.lng.toString())
      
      // If we have location details from reverse geocoding, auto-fill the location name
      if (selectedLocationDetails) {
        setLocationName(selectedLocationDetails.full_name)
        setLocationDetails({
          place_id: selectedLocationDetails.place_id,
          city: selectedLocationDetails.city,
          country: selectedLocationDetails.country,
          state: selectedLocationDetails.state
        })
      }
    }
  }, [selectedLocation, selectedLocationDetails])

  const loadConnections = async () => {
    try {
      const data = await databaseService.getConnections()
      const activeConnections = data.filter(c => c.status === 'accepted')
      setConnections(activeConnections)
      // Don't auto-select connection - let user choose personal or connection
    } catch (error) {
      // Error loading connections
    }
  }

  const getOtherUser = (connection: ConnectionWithUsers) => {
    return connection.user1?.id === user?.id ? connection.user2 : connection.user1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(0)

    try {
      // Connection is optional now - can be personal memory

      // Determine memory type based on first file or default to 'note'
      let memoryType = 'note'
      if (files.length > 0) {
        const fileType = files[0].type
        if (fileType.startsWith('image/')) {
          memoryType = 'photo'
        } else if (fileType.startsWith('video/')) {
          memoryType = 'video'
        }
      }

      const memoryData = {
        connection_id: connectionId === 'personal' ? undefined : connectionId,
        title,
        description: description || undefined,
        location_name: locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        memory_type: memoryType as 'photo' | 'video' | 'note',
        place_id: locationDetails?.place_id,
        city: locationDetails?.city,
        country: locationDetails?.country,
        state: locationDetails?.state
      }

      const result = await databaseService.createMemoryWithLocation(memoryData)

      if (result && files.length > 0) {
        // Upload files to the memory
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          try {
            await databaseService.addFileToMemory(result.id, file)
            setUploadProgress(((i + 1) / files.length) * 100)
          } catch (error) {
            toast.error(`Error uploading ${file.name}`)
          }
        }
      }
      
      if (result) {
        toast.success('Memory created successfully!')
        // Reset form
        setTitle('')
        setDescription('')
        setLocationName('')
        setLatitude('')
        setLongitude('')
        setMemoryType('')
        setConnectionId('personal')
        setFiles([])
        setFilePreviews({})
        setLocationDetails(null)
        
        onClose()
      } else {
        toast.error('Failed to create memory')
      }
    } catch (error) {
      toast.error('Error creating memory')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)
      
      // Create previews for images and videos
      const newPreviews: { [key: string]: string } = {}
      selectedFiles.forEach((file) => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newPreviews[file.name] = e.target?.result as string
            setFilePreviews(prev => ({ ...prev, ...newPreviews }))
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return Play
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Add New Memory</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connection">Connection (Optional)</Label>
            <Select value={connectionId} onValueChange={setConnectionId}>
              <SelectTrigger>
                <SelectValue placeholder="Personal memory or select a connection" />
              </SelectTrigger>
              <SelectContent>
                                 <SelectItem value="personal">
                   <div className="flex items-center space-x-2">
                     <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                       <MapPin className="h-3 w-3 text-gray-600" />
                     </div>
                     <span>Personal Memory</span>
                     <span className="text-gray-500">(Just for me)</span>
                   </div>
                 </SelectItem>
                {connections.map((connection) => {
                  const otherUser = getOtherUser(connection)
                  const relationshipConfig = CONNECTION_ICONS[connection.connection_type]
                  const Icon = relationshipConfig.icon
                  
                  return (
                    <SelectItem key={connection.id} value={connection.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${relationshipConfig.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-3 w-3 ${relationshipConfig.color}`} />
                        </div>
                        <span>{otherUser?.name || 'Unknown User'}</span>
                        <span className="text-gray-500 capitalize">({connection.connection_type})</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationName">Location</Label>
                             <LocationAutocomplete
                   value={locationName}
                   onChange={setLocationName}
                   onLocationSelect={(location) => {
                     setLocationDetails({
                       place_id: location.place_id,
                     })
                     // Update coordinates if they're not already set
                     if (!latitude || !longitude) {
                       setLatitude(location.latitude.toString())
                       setLongitude(location.longitude.toString())
                     }
                   }}
                   placeholder="Search for a location..."
                 />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Auto-populated from map"
                required
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Auto-populated from map"
                required
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story behind this memory..."
              rows={3}
            />
          </div>

                     <div className="space-y-2">
             <Label htmlFor="files">Upload Files (Optional)</Label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
               <input
                 type="file"
                 id="files"
                 accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                 onChange={handleFileChange}
                 multiple
                 className="hidden"
               />
               <label htmlFor="files" className="cursor-pointer">
                 <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                 <p className="text-sm text-gray-600">
                   Click to upload or drag and drop
                 </p>
                 <p className="text-xs text-gray-500 mt-1">
                   Up to 10 photos, 5 videos, unlimited notes
                 </p>
               </label>
             </div>
             {files.length > 0 && (
               <div className="mt-4 space-y-2">
                 {files.map((file, index) => (
                   <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         {filePreviews[file.name] && file.type.startsWith('image/') ? (
                           <img 
                             src={filePreviews[file.name]} 
                             alt="Preview" 
                             className="w-12 h-12 object-cover rounded"
                           />
                         ) : filePreviews[file.name] && file.type.startsWith('video/') ? (
                           <video 
                             src={filePreviews[file.name]} 
                             className="w-12 h-12 object-cover rounded"
                             muted
                           />
                         ) : (
                           <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                             <FileText className="h-6 w-6 text-gray-500" />
                           </div>
                         )}
                         <div>
                           <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                             {file.name}
                           </p>
                           <p className="text-xs text-gray-500">
                             {formatFileSize(file.size)} • {file.type}
                           </p>
                         </div>
                       </div>
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           setFiles(files.filter((_, i) => i !== index))
                           const newPreviews = { ...filePreviews }
                           delete newPreviews[file.name]
                           setFilePreviews(newPreviews)
                         }}
                         className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
             {loading && uploadProgress > 0 && (
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                   style={{ width: `${uploadProgress}%` }}
                 ></div>
               </div>
             )}
           </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Memory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
