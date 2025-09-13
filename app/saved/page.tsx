"use client"

import { useState, useEffect } from "react"
import { getSavedHouses } from "@/lib/houses"
import { getCurrentUser } from "@/lib/auth"
import { HouseCard } from "@/components/house-card"
import { getDatabase, ref, get } from "firebase/database"

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

export default function SavedHousesPage() {
  const [savedHouses, setSavedHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    async function fetchSavedHouses() {
      if (!user) {
        setLoading(false)
        return
      }

      const savedHouseIds = await getSavedHouses(user.uid)
      const db = getDatabase()
      const houses: House[] = []

      for (const id of savedHouseIds) {
        const houseSnapshot = await get(ref(db, `property/${id}`))
        if (houseSnapshot.exists()) {
          houses.push({ id, ...houseSnapshot.val() })
        }
      }

      setSavedHouses(houses)
      setLoading(false)
    }

    fetchSavedHouses()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Your Saved Houses</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : savedHouses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedHouses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">You haven't saved any houses yet.</p>
        )}
      </main>
    </div>
  )
}
