"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getDatabase, ref, get } from "firebase/database"
import { initializeApp } from "firebase/app"
import { HouseDetails } from "@/components/house-details"
import { app,db } from "@/lib/firebase"
import { getCurrentUser } from "@/lib/auth"

export default function HousePage() {
  const { id } = useParams()
  const router = useRouter()
  const [house, setHouse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Check authentication first with better handling
  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking authentication...")
      // Check if user is authenticated via localStorage
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("userData")
      
      console.log("Auth status:", isAuthenticated)
      console.log("User data exists:", !!userData)
      
      if (isAuthenticated === "true" && userData) {
        try {
          const user = JSON.parse(userData)
          console.log("Parsed user:", user)
          if (user && user.uid) {
            console.log("User authenticated, setting authChecked to true")
            setAuthChecked(true)
            return
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
      
      console.log("User not authenticated, redirecting to login")
      // If not authenticated, redirect to login
      localStorage.setItem("redirectAfterLogin", `/house/${id}`)
      router.push("/login?message=house-details")
    }

    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timer)
  }, [id, router])

  useEffect(() => {
    console.log("Data fetch effect triggered - id:", id, "authChecked:", authChecked)
    if (!id || !authChecked) {
      console.log("Skipping data fetch - missing id or auth not checked")
      return
    }

    const fetchData = async () => {
      try {
        console.log("Fetching house data for ID:", id)
        const snapshot = await get(ref(db, `property/${id}`))

        if (!snapshot.exists()) {
          console.log("House not found in database")
          router.push("/not-found")
          return
        }

        const data = snapshot.val()
        console.log("House data received:", data)

        // Build images array from multiple possible shapes
        type IndexedUrl = { idx: number; url: string }
        const indexed: IndexedUrl[] = []
        const addIfValidIndexed = (idx: number, val: any) => {
          if (idx >= 2 && typeof val === 'string' && val.trim().length > 0) {
            indexed.push({ idx, url: val })
          }
        }

        // If array provided directly
        if (Array.isArray(data.images)) {
          data.images.forEach((val: any, i: number) => {
            // When provided as array, keep order; no image1Url key involved
            if (typeof val === 'string' && val.trim().length > 0) indexed.push({ idx: i + 1, url: val })
          })
        }

        // Top-level conventional keys image1Url..image10Url (and beyond)
        Object.keys(data).forEach((key) => {
          const match = key.match(/^image\s*(\d+)\s*(?:url)?$/i)
          if (match) addIfValidIndexed(Number(match[1]), data[key])
        })

        // Nested images object with numbered keys
        if (data.images && typeof data.images === 'object' && !Array.isArray(data.images)) {
          Object.keys(data.images).forEach((key) => {
            const match = key.match(/^image\s*(\d+)\s*(?:url)?$/i)
            if (match) addIfValidIndexed(Number(match[1]), data.images[key])
          })
        }

        // Sort by the numeric suffix and map to URLs. This excludes index 1.
        indexed.sort((a, b) => a.idx - b.idx)
        const images = indexed.map((x) => x.url)

        const formatted = {
          id,
          title: data.name || "Untitled House",
          location: `${data.city || ""}, ${data.town || ""}`,
          price: parseInt(data.rent) || 0,
          type: data.type || "",
          images,
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          available: data.status?.toLowerCase() === "available",
          description: data.description || "",
          features: [
            `Bedrooms: ${data.bedroom}`,
            `Balconies: ${data.balcony}`,
            `Furnished: ${data.furnished}`,
            `Vacancies: ${data.vacancies}`,
            `Direction: ${data.direction}`,
          ],
          agent: {
            name: data.names,
            phone: data.phone,
            whatsapp: data.phone,
          },
          coordinates: {
            lat: parseFloat(data.lat || "0"),
            lng: parseFloat(data.lng || "0"),
          },
        }

        console.log("Formatted house data:", formatted)
        setHouse(formatted)
      } catch (error) {
        console.error("Error fetching house:", error)
        // Show error to user
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, authChecked, router])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-houselook-cyan mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-houselook-cyan mx-auto mb-4"></div>
          <p className="text-gray-600">Loading house details...</p>
        </div>
      </div>
    )
  }

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">House not found</p>
          <p className="text-gray-600 mt-2">The house details could not be loaded.</p>
        </div>
      </div>
    )
  }

  return <HouseDetails house={house} />
}

