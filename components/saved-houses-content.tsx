"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Home, Trash2, Eye, Filter, SortAsc, Coins, AlertCircle, Clock, Info } from "lucide-react"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { getSavedHouses, unsaveHouse } from "@/lib/houses"
import { getDatabase, ref, onValue, remove } from "firebase/database"
import { onValue as onValueProperty } from "firebase/database"

interface SavedHouse {
  id: string
  title: string
  location: string
  price: number
  type: string
  image: string
  amenities: string[]
  available: boolean
  savedDate: string
  savedTimestamp: number
}

export function SavedHousesContent() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [houses, setHouses] = useState<SavedHouse[]>([])
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check authentication
    const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem("isAuthenticated") : null
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load user points
    const savedPoints = typeof window !== 'undefined' ? localStorage.getItem("userPoints") : null
    setUserPoints(savedPoints ? Number.parseInt(savedPoints) : 100)

    // Load saved houses from Firebase
    const db = getDatabase()
    const user = getCurrentUser()
    if (user) {
      const savedHousesRef = ref(db, `users/${user.uid}/savedHouses`)
      onValue(savedHousesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const currentTime = Date.now()
          const twentyFourHoursInMs = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
          
          const houses: SavedHouse[] = Object.entries(data)
            .map(([id, house]: [string, any]) => ({
              id: id,
              ...house,
              savedTimestamp: house.savedTimestamp || Date.now(),
            }))
            .filter((house) => {
              // Remove houses older than 24 hours
              const isExpired = (currentTime - house.savedTimestamp) > twentyFourHoursInMs
              if (isExpired) {
                // Remove expired house from Firebase
                const houseRef = ref(db, `users/${user.uid}/savedHouses/${house.id}`)
                remove(houseRef)
              }
              return !isExpired
            })
          
          setHouses(houses)
        } else {
          setHouses([])
        }
      })
    }

    // Animation
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [router, isClient])

  const handleViewHouse = (houseId: string) => {
    // Set a flag to indicate this is from saved houses (no points deduction)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromSavedHouses', 'true')
    }
    router.push(`/house/${houseId}`)
  }

  const handleRemoveFromSaved = async (houseId: string) => {
    const user = getCurrentUser()
    if (user) {
      await unsaveHouse(user.uid, houseId)
      alert("🗑️ Property removed from saved list")
    }
  }

  const sortedAndFilteredHouses = houses
    .filter((house) => {
      if (filterBy === "available") return house.available
      if (filterBy === "unavailable") return !house.available
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
        default:
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      }
    })

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue/40 via-white to-houselook-whitesmoke/60 pt-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md w-full bg-white shadow-xl border border-gray-200 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
                <p className="text-gray-600">Please wait while we load your saved properties.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue/40 via-white to-houselook-whitesmoke/60 pt-20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-houselook-cyan/12 via-houselook-blue/8 to-transparent"></div>
        <div className="absolute top-32 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-houselook-cyan/15 to-houselook-blue/8 blur-3xl animate-pulse"></div>
        <div
          className="absolute top-64 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-houselook-blue/12 to-houselook-cyan/8 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-houselook-cyan/15 to-houselook-blue/15 backdrop-blur-sm border border-houselook-cyan/25 rounded-full shadow-lg mb-4">
                <Heart className="w-4 h-4 text-houselook-cyan mr-2" />
                <span className="text-houselook-blue font-bold text-sm">Your Saved Properties</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4 text-black">
                <span className="bg-gradient-to-r from-black via-houselook-blue to-houselook-cyan bg-clip-text text-transparent">
                  Saved Houses
                </span>
              </h1>
              <p className="text-xl text-houselook-darkGray leading-relaxed">
                Your favorite properties are saved here. View details for{" "}
                <span className="text-green-600 font-bold">FREE</span> (no points required).
              </p>
              
              {/* Save Info Section */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">How Saving Works</h3>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Save properties you're interested in</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Saved properties last for 24 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-green-500" />
                        <span>View saved properties for FREE - no points needed!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Points Display */}
              <Card className="bg-gradient-to-r from-houselook-cyan/15 to-houselook-blue/15 border-2 border-houselook-cyan/30 shadow-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-houselook-darkGray font-bold">Your Points</p>
                    <p className="text-2xl font-black text-houselook-black">{userPoints}</p>
                    <p className="text-xs text-houselook-coolGray font-medium">≈ KSh {userPoints}</p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="border-2 border-houselook-cyan/40 text-houselook-blue font-bold hover:bg-houselook-cyan/10 hover:border-houselook-cyan/60 transition-all duration-300 px-6 py-3"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div
          className={`mb-8 transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="bg-white/80 backdrop-blur-md shadow-xl border-2 border-houselook-cyan/20 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-houselook-black mb-2">
                    {sortedAndFilteredHouses.length} {sortedAndFilteredHouses.length === 1 ? "Property" : "Properties"}{" "}
                    Saved
                  </h2>
                  <p className="text-houselook-darkGray font-medium">
                    💡 Tip: View house details for FREE - no points required for saved properties
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Enhanced Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-houselook-darkGray" />
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="px-4 py-2 bg-white/90 border-2 border-houselook-aliceblue rounded-xl font-semibold text-houselook-darkGray focus:border-houselook-cyan transition-all"
                    >
                      <option value="all">All Properties</option>
                      <option value="available">✅ Available</option>
                      <option value="unavailable">❌ Unavailable</option>
                    </select>
                  </div>

                  {/* Enhanced Sort */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-houselook-darkGray" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-white/90 border-2 border-houselook-aliceblue rounded-xl font-semibold text-houselook-darkGray focus:border-houselook-cyan transition-all"
                    >
                      <option value="newest">🕒 Recently Saved</option>
                      <option value="price-low">💰 Price: Low to High</option>
                      <option value="price-high">💎 Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Houses Grid */}
        <div
          className={`mb-16 transition-all duration-1000 delay-500 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {sortedAndFilteredHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedAndFilteredHouses.map((house, index) => (
                <div
                  key={house.id}
                  className="animate-in fade-in duration-700 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-houselook-cyan/20 hover:border-houselook-cyan/40 hover:-translate-y-2 backdrop-blur-sm">
                    {/* Enhanced House Card Content */}
                    <div className="relative">
                      <img
                        src={house.image || "/placeholder.svg"}
                        alt={house.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Enhanced Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Enhanced Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <Badge
                          className={`${house.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white font-bold shadow-lg`}
                        >
                          {house.available ? "✅ Available" : "❌ Occupied"}
                        </Badge>
                        <Badge className="bg-houselook-cyan/90 text-white font-bold shadow-lg">💾 Saved</Badge>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewHouse(house.id)}
                            className="flex-1 bg-gradient-primary text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View FREE
                          </Button>
                          <Button
                            onClick={() => handleRemoveFromSaved(house.id)}
                            variant="destructive"
                            size="sm"
                            className="px-3 shadow-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-houselook-black mb-3 line-clamp-2 group-hover:text-houselook-blue transition-colors duration-300">
                        {house.title}
                      </h3>

                      <div className="flex items-center text-houselook-darkGray mb-4">
                        <Home className="w-4 h-4 mr-2 text-houselook-cyan" />
                        <span className="text-sm font-semibold">{house.location}</span>
                      </div>

                      <div className="flex items-center justify-between mb-5">
                        <div className="text-2xl font-black bg-gradient-to-r from-houselook-cyan to-houselook-blue bg-clip-text text-transparent">
                          KSh {house.price.toLocaleString()}
                          <span className="text-sm text-houselook-coolGray font-normal ml-1">/month</span>
                        </div>
                        <Badge variant="outline" className="border-houselook-cyan/40 text-houselook-blue font-semibold">
                          {house.type}
                        </Badge>
                      </div>

                      {/* Enhanced Amenities */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {house.amenities.slice(0, 2).map((amenity) => (
                          <div
                            key={amenity}
                            className="text-xs text-houselook-darkGray bg-gradient-to-r from-houselook-aliceblue to-houselook-whitesmoke px-3 py-2 rounded-full border-2 border-houselook-cyan/25 hover:border-houselook-cyan/50 transition-colors font-semibold"
                          >
                            {amenity}
                          </div>
                        ))}
                        {house.amenities.length > 2 && (
                          <div className="text-xs text-houselook-blue bg-houselook-cyan/15 px-3 py-2 rounded-full border-2 border-houselook-cyan/40 font-bold">
                            +{house.amenities.length - 2} more
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-houselook-coolGray font-medium">
                        💾 Saved on {new Date(house.savedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-2 border-houselook-cyan/20 rounded-3xl">
              <CardContent className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-houselook-cyan/20 to-houselook-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-houselook-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-houselook-darkGray mb-3">No Saved Properties</h3>
                <p className="text-houselook-coolGray mb-8 max-w-md mx-auto font-medium">
                  You haven't saved any properties yet. Start browsing and save your favorite homes!
                </p>
                <Button
                  onClick={() => router.push("/listings")}
                  className="bg-gradient-primary text-white font-bold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Browse Properties
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
