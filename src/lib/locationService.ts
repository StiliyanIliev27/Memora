interface LocationSuggestion {
  id: string
  name: string
  full_name: string
  place_type: string[]
  center: [number, number] // [longitude, latitude]
  context?: Array<{
    id: string
    text: string
    short_code?: string
  }>
}

interface LocationDetails {
  place_id: string
  name: string
  full_name: string
  latitude: number
  longitude: number
  address?: string
  city?: string
  country?: string
  state?: string
  place_type?: string[]
}

export const locationService = {
  // Test function to verify Mapbox token
  async testMapboxToken(): Promise<boolean> {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    
    if (!mapboxToken) {
      return false
    }

    try {
      // Test with a simple reverse geocoding request (New York coordinates)
      const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/-74.006,40.7128.json?` +
        `access_token=${mapboxToken}&` +
        `limit=1`

      const response = await fetch(testUrl)

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return true
    } catch (error) {
      return false
    }
  },

  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) return []

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&` +
        `types=place,poi,address&` +
        `limit=10&` +
        `language=en`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions')
      }

      const data = await response.json()
      
      return data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        full_name: feature.place_name,
        place_type: feature.place_type,
        center: feature.center,
        context: feature.context
      }))
    } catch (error) {
      return []
    }
  },

  async getLocationDetails(placeId: string): Promise<LocationDetails | null> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeId}.json?` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&` +
        `language=en`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch location details')
      }

      const data = await response.json()
      
      if (!data.features || data.features.length === 0) {
        return null
      }

      const feature = data.features[0]
      const context = feature.context || []

      return {
        place_id: feature.id,
        name: feature.text,
        full_name: feature.place_name,
        latitude: feature.center[1],
        longitude: feature.center[0],
        address: feature.place_name
      }
    } catch (error) {
      return null
    }
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<LocationDetails | null> {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    
    if (!mapboxToken) {
      throw new Error('Mapbox token is not configured. Please check your environment variables.')
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude. Must be between -90 and 90.')
    }
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude. Must be between -180 and 180.')
    }

    try {
      // Ensure coordinates are properly formatted (6 decimal places max)
      const formattedLng = parseFloat(longitude.toFixed(6))
      const formattedLat = parseFloat(latitude.toFixed(6))
      
      // First, try to get POI (points of interest) - most specific
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?` +
        `access_token=${mapboxToken}&` +
        `types=poi&` +
        `language=en&` +
        `limit=1`

      let response = await fetch(url)
      let data = await response.json()

      // If no POI found, try address
      if (!data.features || data.features.length === 0) {
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?` +
          `access_token=${mapboxToken}&` +
          `types=address&` +
          `language=en&` +
          `limit=1`
        
        response = await fetch(url)
        data = await response.json()
      }

      // If still no results, try place
      if (!data.features || data.features.length === 0) {
        url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?` +
          `access_token=${mapboxToken}&` +
          `types=place&` +
          `language=en&` +
          `limit=1`
        
        response = await fetch(url)
        data = await response.json()
      }

      if (!response.ok) {
        const errorText = await response.text()
        
        // Handle specific error cases
        if (response.status === 422) {
          throw new Error(`Invalid coordinates: ${formattedLat}, ${formattedLng}. Please try a different location.`)
        } else if (response.status === 401) {
          throw new Error('Invalid Mapbox token. Please check your configuration.')
        } else {
          throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
        }
      }

      if (!data.features || data.features.length === 0) {
        return null
      }

      // Use the first (and only) feature
      const bestFeature = data.features[0]
      const context = bestFeature.context || []
      
      // Extract city and country from context
      const city = context.find((c: any) => c.id.startsWith('place.'))?.text
      const country = context.find((c: any) => c.id.startsWith('country.'))?.text
      const state = context.find((c: any) => c.id.startsWith('region.'))?.text

      // Create a smart location name
      let smartName = bestFeature.text // Default to the feature name
      
      if (bestFeature.place_type && bestFeature.place_type.includes('poi')) {
        // For POIs (restaurants, hotels, landmarks), use just the name
        smartName = bestFeature.text
      } else if (bestFeature.place_type && bestFeature.place_type.includes('address')) {
        // For addresses, use street name + city + country
        const streetName = bestFeature.text
        const locationParts = [streetName]
        if (city) locationParts.push(city)
        if (country) locationParts.push(country)
        smartName = locationParts.join(', ')
      } else if (bestFeature.place_type && bestFeature.place_type.includes('place')) {
        // For places (cities, neighborhoods), use the place name
        smartName = bestFeature.text
      }

      const result = {
        place_id: bestFeature.id,
        name: bestFeature.text,
        full_name: smartName,
        latitude: bestFeature.center[1],
        longitude: bestFeature.center[0],
        address: bestFeature.place_name,
        city,
        country,
        state,
        place_type: bestFeature.place_type
      }

      return result
    } catch (error) {
      throw new Error(`Failed to reverse geocode: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
