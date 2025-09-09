import { locationService } from '../locationService'

const originalEnv = process.env

describe('locationService', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, NEXT_PUBLIC_MAPBOX_TOKEN: 'test-token' }
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = originalEnv
  })

  describe('reverseGeocode', () => {
    it('throws when token is missing', async () => {
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = undefined as any
      await expect(locationService.reverseGeocode(10, 10)).rejects.toThrow('Mapbox token is not configured')
    })

    it('throws on invalid latitude', async () => {
      await expect(locationService.reverseGeocode(100, 10)).rejects.toThrow('Invalid latitude')
    })

    it('throws on invalid longitude', async () => {
      await expect(locationService.reverseGeocode(10, 200)).rejects.toThrow('Invalid longitude')
    })

    it('returns formatted POI when poi result exists', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            {
              id: 'poi.1',
              text: 'Famous Place',
              place_name: 'Famous Place, City, Country',
              center: [12.34, 56.78],
              place_type: ['poi'],
              context: [
                { id: 'place.123', text: 'City' },
                { id: 'country.456', text: 'Country' },
                { id: 'region.789', text: 'State' },
              ],
            },
          ],
        }),
      })

      const res = await locationService.reverseGeocode(56.780001, 12.340001)
      expect(res).toEqual({
        place_id: 'poi.1',
        name: 'Famous Place',
        full_name: 'Famous Place',
        latitude: 56.78,
        longitude: 12.34,
        address: 'Famous Place, City, Country',
        city: 'City',
        country: 'Country',
        state: 'State',
        place_type: ['poi'],
      })
      expect((global.fetch as jest.Mock)).toHaveBeenCalledTimes(1)
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('types=poi')
    })

    it('falls back to address then place when no poi', async () => {
      // first call: no features
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [] }) })
        // second call: no features
        .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [] }) })
        // third call: place found
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            features: [
              {
                id: 'place.2',
                text: 'CityName',
                place_name: 'CityName, Country',
                center: [1.23, 4.56],
                place_type: ['place'],
                context: [
                  { id: 'place.2', text: 'CityName' },
                  { id: 'country.99', text: 'Country' },
                ],
              },
            ],
          }),
        })

      const res = await locationService.reverseGeocode(4.56, 1.23)
      expect(res?.full_name).toBe('CityName')
      expect((global.fetch as jest.Mock)).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('types=poi')
      )
      expect((global.fetch as jest.Mock)).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('types=address')
      )
      expect((global.fetch as jest.Mock)).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('types=place')
      )
    })

    it('throws specific error on 422 response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => 'limit must be combined with a single type parameter',
        json: async () => ({ message: 'err' }),
      })
      await expect(locationService.reverseGeocode(10, 10)).rejects.toThrow('Invalid coordinates')
    })

    it('returns null when no results after all fallbacks', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [] }) })

      const res = await locationService.reverseGeocode(0, 0)
      expect(res).toBeNull()
    })
  })

  describe('searchLocations', () => {
    it('returns empty array for short query', async () => {
      const res = await locationService.searchLocations('a')
      expect(res).toEqual([])
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('maps features to suggestions', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            { id: '1', text: 'Name', place_name: 'Full Name', place_type: ['place'], center: [1, 2] },
          ],
        }),
      })
      const res = await locationService.searchLocations('sofia')
      expect(res).toEqual([
        { id: '1', name: 'Name', full_name: 'Full Name', place_type: ['place'], center: [1, 2], context: undefined },
      ])
    })

    it('returns [] on fetch error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })
      const res = await locationService.searchLocations('berlin')
      expect(res).toEqual([])
    })
  })

  describe('testMapboxToken', () => {
    it('returns false when token missing', async () => {
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = undefined as any
      const res = await locationService.testMapboxToken()
      expect(res).toBe(false)
    })

    it('returns true on ok response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      const res = await locationService.testMapboxToken()
      expect(res).toBe(true)
    })

    it('returns false on non-ok response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })
      const res = await locationService.testMapboxToken()
      expect(res).toBe(false)
    })

    it('returns false on exception', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'))
      const res = await locationService.testMapboxToken()
      expect(res).toBe(false)
    })
  })
})

