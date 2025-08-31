'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { MapPin, Heart, Users, Star, Plus, Search, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { databaseService } from '@/lib/database'
import { MemoryWithConnection } from '@/types/database'
import { MemoryModal } from '@/components/memories/MemoryModal'
import { MemoryMarker } from '@/types/map'
import { locationService } from '@/lib/locationService'

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''



const RELATIONSHIP_ICONS = {
  couple: { icon: Heart, color: '#ef4444' },
  friend: { icon: Star, color: '#f59e0b' },
  group: { icon: Users, color: '#3b82f6' },
}

interface InteractiveMapProps {
  onLocationSelected?: (location: { lat: number; lng: number }, locationDetails?: any) => void
  onStartAddMemory?: () => void
}

export interface InteractiveMapRef {
  startAddMemory: () => void
  loadMemories: () => void
}

const InteractiveMap = forwardRef<InteractiveMapRef, InteractiveMapProps>(
  ({ onLocationSelected }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [memories, setMemories] = useState<MemoryMarker[]>([])
  const [selectedMemory, setSelectedMemory] = useState<MemoryMarker | null>(null)
  const [showMemoryModal, setShowMemoryModal] = useState(false)
  const [hoveredMemory, setHoveredMemory] = useState<MemoryMarker | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    })

    // Note: We're using custom controls instead of Mapbox defaults
    // to avoid conflicts with the sidebar layout

    // Add memory markers only once
    addMemoryMarkers()

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Separate useEffect for map click handler that depends on isAddingMemory
  useEffect(() => {
    if (!map.current) return

    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      if (isAddingMemory) {
        const { lng, lat } = e.lngLat
        const location = { lat, lng }
        
        // Use reverse geocoding to get location details
        try {
          const locationDetails = await locationService.reverseGeocode(lat, lng)
          if (locationDetails) {
            // Pass both coordinates and location details
            onLocationSelected?.(location, locationDetails)
          } else {
            // Fallback to just coordinates
            onLocationSelected?.(location)
          }
        } catch (error) {
          // Show user-friendly error message
          alert(`Unable to get location details: ${error instanceof Error ? error.message : 'Unknown error'}. You can still create a memory with just coordinates.`)
          // Fallback to just coordinates
          onLocationSelected?.(location)
        }
        
        setSelectedLocation(location)
        setIsAddingMemory(false)
        resetCursor()
      }
    }

    map.current.on('click', handleMapClick)

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick)
      }
    }
  }, [isAddingMemory, onLocationSelected])

  // Load memories when component mounts
  useEffect(() => {
    loadMemories()
    
    // Test Mapbox token
    locationService.testMapboxToken().then(isValid => {
      if (!isValid) {
        // Token test failed silently
      }
    })
  }, [])

  // Update markers when memories change
  useEffect(() => {
    if (map.current && memories.length > 0) {
      addMemoryMarkers()
    }
  }, [memories])

  const loadMemories = async () => {
    try {
      const userMemories = await databaseService.getUserMemories()

      setMemories(userMemories.map(memory => ({
        id: memory.id,
        position: [memory.longitude, memory.latitude] as [number, number],
        icon: memory.is_personal ? 'mappin' :
              memory.connection_type === 'couple' ? 'heart' : 
              memory.connection_type === 'group' ? 'users' : 'mappin',
        color: memory.is_personal ? '#6b7280' :
               memory.connection_type === 'couple' ? '#ef4444' :
               memory.connection_type === 'friend' ? '#f59e0b' : '#3b82f6',
        location: memory.location_name,
        description: memory.description || '',
        title: memory.title || 'Untitled Memory',
        date: memory.created_at,
        created_by: memory.created_by,
        images: memory.memory_type === 'photo' && memory.file_url ? [memory.file_url] : undefined,
        videos: memory.memory_type === 'video' && memory.file_url ? [memory.file_url] : undefined,
        files: memory.memory_type === 'note' ? ['Note'] : undefined,
        connection_id: memory.connection_id,
        connection_type: memory.connection_type as 'couple' | 'friend' | 'group' | undefined,
        is_personal: memory.is_personal,
        connection: memory.connection
      })))
    } catch (error) {
      // Error loading memories
    }
  }

  const addMemoryMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers for each memory
    memories.forEach((memory) => {
      const markerEl = document.createElement('div')
      markerEl.className = 'memory-marker'
      markerEl.style.width = '24px'
      markerEl.style.height = '24px'
      markerEl.style.borderRadius = '50%'
      markerEl.style.backgroundColor = memory.color
      markerEl.style.border = '2px solid white'
      markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
      markerEl.style.cursor = 'pointer'
      markerEl.style.display = 'flex'
      markerEl.style.alignItems = 'center'
      markerEl.style.justifyContent = 'center'
      markerEl.style.color = 'white'
      markerEl.style.fontSize = '12px'

      // Add icon based on memory type
      const iconMap = {
        heart: '❤️',
        users: '👥',
        mappin: '📍'
      }
      markerEl.innerHTML = iconMap[memory.icon as keyof typeof iconMap] || '📍'

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(memory.position)
        .addTo(map.current!)

      // Add event listeners
      markerEl.addEventListener('mouseenter', (e) => {
        setHoveredMemory(memory)
        // Calculate tooltip position based on mouse position
        const rect = mapContainer.current?.getBoundingClientRect()
        if (rect) {
          setTooltipPosition({ 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
          })
        }
      })

      markerEl.addEventListener('mouseleave', () => {
        setHoveredMemory(null)
      })

      markerEl.addEventListener('click', () => {
        setSelectedMemory(memory)
        setShowMemoryModal(true)
      })

      markersRef.current.push(marker)
    })
  }

  const getIconSVG = (iconType: string) => {
    switch (iconType) {
      case 'heart':
        return '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
      case 'users':
        return '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.99 2.5V18h-2v-8.5L9.01 9A2.5 2.5 0 0 0 7 8H5.46c-.8 0-1.54.37-2.01 1L.96 16.63A1.5 1.5 0 0 0 2.5 18H5v6h2v-6h1v6h2v-6h1v6h2v-6h1v6h2z"/></svg>'
      default:
        return '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
    }
  }

  const showMemoryDetails = (memory: MemoryMarker) => {
    setSelectedMemory(memory)
    setShowMemoryModal(true)
  }

  const handleAddMemory = () => {
    setIsAddingMemory(true)
    // Change cursor to indicate selection mode
    if (map.current) {
      map.current.getCanvas().style.cursor = 'crosshair'
    }
  }

  // Expose the startAddMemory function to parent component
  useImperativeHandle(ref, () => ({
    startAddMemory: handleAddMemory,
    loadMemories: loadMemories
  }))

  const resetCursor = () => {
    if (map.current) {
      map.current.getCanvas().style.cursor = 'grab'
    }
  }

  const handleSearch = () => {
    if (!map.current || !searchQuery) return

    // Use Mapbox geocoding API
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          map.current!.flyTo({ center: [lng, lat], zoom: 12 })
        }
      })
      .catch(error => {
        // Search error
      })
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Custom Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Input
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-64 pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Add Memory Mode Indicator */}
      {isAddingMemory && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Click on map to place memory</span>
          </div>
        </div>
      )}

      {/* Custom Zoom Controls - Moved to bottom-right */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex flex-col space-y-1 bg-white rounded-lg shadow-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => map.current?.zoomIn()}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => map.current?.zoomOut()}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>



      {/* Tooltip */}
      {hoveredMemory && (
        <div 
          className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: hoveredMemory.color }}
            >
              {hoveredMemory.icon === 'heart' ? '❤️' : 
               hoveredMemory.icon === 'users' ? '👥' : '📍'}
            </div>
            <span className="font-semibold text-gray-900 text-sm">{hoveredMemory.title || 'Untitled Memory'}</span>
          </div>
          <p className="text-xs text-gray-600">{hoveredMemory.location || 'Unknown Location'}</p>
        </div>
      )}

      {/* Memory Modal */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
        onUpdate={loadMemories}
      />
    </div>
  )
})

export default InteractiveMap

