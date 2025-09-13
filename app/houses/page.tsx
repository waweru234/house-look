"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"
import { HouseCard } from "@/components/house-card"

interface House {
  id: string
  name: string
  city: string
  rent: number
  bedroom: string
  image1Url: string
  amenities: string[]
  vacancies: string
}

export default function HousePage() {
  const [houses, setHouses] = useState<House[]>([])

  useEffect(() => {
    const houseRef = ref(db, "property")
    onValue(houseRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list: House[] = Object.entries(data).map(([id, val]: any) => ({
          id,
          name: val.name || "Untitled",
          city: val.city || val.town || "Unknown",
          rent: parseInt(val.rent) || 0,
          bedroom: val.bedroom || "Bedsitter",
          image1Url: val.image1Url || val.image2Url || "/placeholder.svg",
          amenities: val.amenities || ["Wi-Fi", "Parking", "Security"],
          vacancies: val.vacancies,
        }))
        setHouses(list)
      }
    })
  }, [])

  return (
    <main className="py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-houselook-black">Explore Houses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
    </main>
  )
} 