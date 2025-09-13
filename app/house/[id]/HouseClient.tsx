
"use client"


export const dynamic = "force-static";
export const dynamicParams = true;
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { get, ref } from "firebase/database"
import { db } from "@/lib/firebase"
import { HouseDetails } from "@/components/house-details"


export default function HouseClient({ id }: { id: string }) {
 
  const router = useRouter()
  const [house, setHouse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if (!id) return

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
          images: [data.image2Url, data.image3Url, data.image4Url].filter(Boolean),
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

  if (loading) {
    return <p className="text-center p-10">Loading...</p>
  }

  if (!house) {
    return <p className="text-center p-10 text-red-500">House not found</p>
  }

  return <HouseDetails house={house} />
}

