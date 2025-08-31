'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { locationService } from '@/lib/locationService'

interface LocationSuggestion {
  id: string
  name: string
  full_name: string
  place_type: string[]
  center: [number, number]
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onLocationSelect?: (location: {
    place_id: string
    name: string
    full_name: string
    latitude: number
    longitude: number
  }) => void
  placeholder?: string
  className?: string
}

export function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Search for a location...",
  className = ""
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (value.length >= 2) {
        setIsLoading(true)
        try {
          const results = await locationService.searchLocations(value)
          setSuggestions(results)
          setShowSuggestions(true)
          setSelectedIndex(-1)
            } catch (error) {
      setSuggestions([])
    } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleLocationSelect(suggestions[selectedIndex])
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, selectedIndex, suggestions])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocationSelect = async (suggestion: LocationSuggestion) => {
    try {
      const locationDetails = await locationService.getLocationDetails(suggestion.id)
      if (locationDetails) {
        onChange(locationDetails.full_name)
        onLocationSelect?.(locationDetails)
      }
    } catch (error) {
      // Fallback to basic info
      onChange(suggestion.full_name)
      onLocationSelect?.({
        place_id: suggestion.id,
        name: suggestion.name,
        full_name: suggestion.full_name,
        latitude: suggestion.center[1],
        longitude: suggestion.center[0]
      })
    }
    
    setShowSuggestions(false)
    setSelectedIndex(-1)
    setSuggestions([])
  }

  const getPlaceTypeIcon = (placeType: string[]) => {
    if (placeType.includes('poi')) return '🏢'
    if (placeType.includes('place')) return '🏙️'
    if (placeType.includes('address')) return '📍'
    return '🌍'
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleLocationSelect(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="text-lg">
                    {getPlaceTypeIcon(suggestion.place_type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.full_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No locations found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  )
}
