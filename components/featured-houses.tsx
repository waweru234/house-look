"use client"

import { useEffect, useState } from "react"
import { HouseCard } from "@/components/house-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

interface FirebaseHouse {
  id: string
  title: string
  town: string
  rent: number
  type: string
  image2Url: string
  furnished: string
  available: string
  amenities?: string[]
}

export function FeaturedHouses() {
  const [houses, setHouses] = useState<FirebaseHouse[]>([])

  useEffect(() => {
    const housesRef = ref(db, "property")

    const unsubscribe = onValue(housesRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) return setHouses([])

      const loaded: FirebaseHouse[] = []
      Object.entries(data).forEach(([id, house]) => {
        loaded.push({
          id,
          title: (house as any).name || "Untitled House",
          town: (house as any).town || "Unknown Location",
          rent: Number((house as any).rent || 0),
          type: (house as any).bedroom || "Bedsitter",
          image2Url: (house as any).image1Url || "/placeholder.svg",
          furnished: (house as any).furnished || "Unfurnished",
          available: (house as any).vacancies || "0",
          amenities: (house as any).amenities || [],
        })
      })

      setHouses(loaded.slice(0, 4)) // only the first 4 featured
    })

    return () => unsubscribe()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Featured Houses</h2>
        <p className="text-xl text-gray-600">Handpicked properties perfect for young professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {houses.map((house) => (
          <HouseCard
            key={house.id}
            house={{
              id: house.id,
              name: house.title,
              city: house.town,
              rent: house.rent,
              bedroom: house.type === "single" ? "Single" : house.type === "bedsitter" ? "Bedsitter" : house.type === "1 bedroom" ? "1 Bedroom" : house.type === "2 bedroom" ? "2 Bedroom" : house.type === "3 bedroom" ? "3 Bedroom" : house.type,
              image1Url: house.image2Url,
              amenities: house.amenities || [house.furnished],
              vacancies: house.available,
            }}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/listings">
          <Button className="bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white font-semibold px-8 py-6 text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            View All Houses
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
