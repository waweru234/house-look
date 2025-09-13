import React, { useEffect, useRef } from "react"

interface GoogleMapProps {
  lat: number
  lng: number
  title: string
  location: string
}

export function GoogleMap({ lat, lng, title, location }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    mapInstanceRef.current = map

    // Add marker
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: title,
      animation: google.maps.Animation.DROP
    })

    markerRef.current = marker

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #333;">${title}</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">${location}</p>
        </div>
      `
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [lat, lng, title, location])

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
