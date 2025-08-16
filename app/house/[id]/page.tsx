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

  // Check authentication first
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      // Store the intended destination for after login
      localStorage.setItem("redirectAfterLogin", `/house/${id}`)
      router.push("/login?message=house-details")
      return
    }
    setAuthChecked(true)
  }, [id, router])

  useEffect(() => {
    if (!id || !authChecked) return

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, `property/${id}`))

        if (!snapshot.exists()) {
          router.push("/not-found")
          return
        }

        const data = snapshot.val()

        const formatted = {
          id,
          title: data.name || "Untitled House",
          location: `${data.city || ""}, ${data.town || ""}`,
          price: parseInt(data.rent) || 0,
          type: data.type || "",
          images: [data.image1Url, data.image2Url, data.image3Url, data.image4Url].filter(Boolean),
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

        setHouse(formatted)
      } catch (error) {
        console.error("Error fetching house:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

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
        </div>
      </div>
    )
  }

  return <HouseDetails house={house} />
}

