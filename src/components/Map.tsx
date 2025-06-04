"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  lat: number
  lng: number
  zoom?: number
}

export default function Map({ lat, lng, zoom = 15 }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real app, you would use Google Maps, Mapbox, etc.
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Add a simple placeholder with coordinates
      mapElement.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="text-center">
            <p class="font-medium">Map Preview</p>
            <p class="text-sm text-gray-500">Latitude: ${lat}</p>
            <p class="text-sm text-gray-500">Longitude: ${lng}</p>
          </div>
        </div>
      `
    }
  }, [lat, lng, zoom])

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-lg overflow-hidden"
      aria-label={`Map showing location at latitude ${lat} and longitude ${lng}`}
    />
  )
}
