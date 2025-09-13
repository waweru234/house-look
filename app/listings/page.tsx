"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HouseCard } from "@/components/house-card"
import { ListingsSearchBar } from "@/components/listings-search-bar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Grid, List, MapPin, Sparkles, TrendingUp, Filter, SortAsc, Home } from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "@/lib/firebase"

// Add House and Filters interfaces
interface House {
  id: string
  name: string
  city: string
  rent: number
  bedroom: string
  image1Url: string
  image2Url?: string
  amenities: string[]
  vacancies: string
  available: boolean
}

interface Filters {
  location?: string
  priceRange?: [number, number]
  roomType?: string
  bedrooms?: string
  amenities?: string[]
}

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [allHouses, setAllHouses] = useState<House[]>([])
  const [filteredHouses, setFilteredHouses] = useState<House[]>([])
  const [viewMode, setViewMode] = useState<string>("grid")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAnimated, setIsAnimated] = useState<boolean>(false)
  const [visibleCount, setVisibleCount] = useState<number>(12)

  // Availability statistics
  const totalAvailable = allHouses.reduce((n, h) => n + (h.available ? 1 : 0), 0)
  const totalFull = allHouses.length - totalAvailable

  useEffect(() => {
    const db = getDatabase(app)
    const propertiesRef = ref(db, "property")

    onValue(propertiesRef, (snapshot) => {
      const data = snapshot.val()
      const houses = []
      for (const id in data) {
        const house = data[id]
        houses.push({
          id,
          name: house.name || "Untitled Property",
          city: house.town || "Unknown",
          rent: house.rent || 0,
          bedroom: house.bedroom || "Unknown",
          image1Url: house.image1Url || "/placeholder.svg",
          image2Url: house.image2Url || house.image2url || house.image2 || "/placeholder.svg",
          amenities: [house.furnished, ...(house.amenities || [])].filter(Boolean),
          vacancies: house.vacancies || "0",
          available: !!house.available,
        })
      }
      // Rank: available first
      houses.sort((a, b) => Number(b.available) - Number(a.available))
      setAllHouses(houses)
      setFilteredHouses(houses)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const applyFilters = (filters: Filters) => {
    setIsLoading(true)
    setVisibleCount(12) // Reset visible count on new filter

    // Remove artificial delay for instant filtering
    let filtered = allHouses

    if (filters.location !== undefined && filters.location !== "") {
      filtered = filtered.filter((house) =>
        house.city.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter((house) => house.rent >= min && house.rent <= max)
    }

    if (filters.roomType !== undefined && filters.roomType !== "") {
      filtered = filtered.filter((house) =>
        house.bedroom.toLowerCase().includes(filters.roomType!.toLowerCase())
      )
    }

    // Add bedrooms filter if present
    if (filters.bedrooms !== undefined && filters.bedrooms !== "") {
      filtered = filtered.filter((house) => {
        if (filters.bedrooms === "studio") return house.bedroom.toLowerCase().includes("studio")
        if (filters.bedrooms === "4+") return house.bedroom.replace(/\D/g, "") && Number(house.bedroom.replace(/\D/g, "")) >= 4
        return house.bedroom.replace(/\D/g, "") === filters.bedrooms!.replace(/\D/g, "")
      })
    }

    if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
      filtered = filtered.filter((house) =>
        filters.amenities!.every((amenity) => house.amenities.includes(amenity))
      )
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.rent - b.rent)
        break
      case "price-high":
        filtered.sort((a, b) => b.rent - a.rent)
        break
    }

    // Rank: available first after other sorts
    filtered.sort((a, b) => Number(b.available) - Number(a.available))

    setFilteredHouses(filtered)
    setIsLoading(false)
  }

  useEffect(() => {
    const location = searchParams.get("location")
    const price = searchParams.get("price")
    const type = searchParams.get("type")
    const amenities = searchParams.get("amenities")
    const bedrooms = searchParams.get("bedrooms")

    const filters: Filters = {}
    if (location) filters.location = location
    if (price) {
      const [min, max] = price.split("-").map(Number)
      filters.priceRange = [min, max]
    }
    if (type) filters.roomType = type
    if (amenities) filters.amenities = amenities.split(",")
    if (bedrooms) filters.bedrooms = bedrooms

    if (Object.keys(filters).length > 0) {
      applyFilters(filters)
    }
  }, [searchParams, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue/30 via-white to-houselook-whitesmoke/50">
      {/* Stunning Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-houselook-cyan/8 via-houselook-blue/5 to-transparent"></div>
        <div className="absolute top-32 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-houselook-cyan/10 to-houselook-blue/5 blur-3xl animate-pulse"></div>
        <div
          className="absolute top-64 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-houselook-blue/8 to-houselook-cyan/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-96 left-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-houselook-cyan/6 to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-40 right-1/4 animate-bounce opacity-20" style={{ animationDelay: "0.5s" }}>
          <Sparkles className="w-8 h-8 text-houselook-cyan" />
        </div>
        <div className="absolute top-80 left-1/4 animate-bounce opacity-15" style={{ animationDelay: "1.5s" }}>
          <TrendingUp className="w-6 h-6 text-houselook-blue" />
        </div>

        {/* Sophisticated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00ffff 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Animated Page Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-houselook-cyan/10 to-houselook-blue/10 backdrop-blur-sm border border-houselook-cyan/20 rounded-full shadow-lg mb-6">
              <Sparkles className="w-4 h-4 text-houselook-cyan mr-2" />
              <span className="text-houselook-blue font-semibold text-sm">Premium Property Listings</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-black via-houselook-blue to-houselook-cyan bg-clip-text text-transparent">
                Browse Houses
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover Kenya's most <span className="text-houselook-cyan font-semibold">stylish rentals</span> curated
              for your lifestyle
            </p>

            {/* Animated Stats Row */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-houselook-cyan to-houselook-blue bg-clip-text text-transparent">
                  {allHouses.length}+
                </div>
                <div className="text-sm text-gray-500 font-medium">Properties</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {totalAvailable}
                </div>
                <div className="text-sm text-gray-500 font-medium">Available</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {totalFull}
                </div>
                <div className="text-sm text-gray-500 font-medium">Full</div>
              </div>
            </div>
          </div>

          {/* Animated Search Bar */}
          <div
            className={`mb-12 transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <ListingsSearchBar onFilterChange={applyFilters} />
          </div>

          {/* Animated Results Header */}
          <div
            className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6 mb-8 transition-all duration-1000 delay-500 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-black">
                    {isLoading ? (
                      <span className="animate-pulse">Searching...</span>
                    ) : (
                      <>
                        {filteredHouses.length} {filteredHouses.length === 1 ? "Property" : "Properties"} Found
                      </>
                    )}
                  </h2>
                  {!isLoading && filteredHouses.length > 0 && (
                    <Badge className="bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white">
                      Available Now
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Showing rental properties across Kenya
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Enhanced Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-houselook-aliceblue shadow-sm hover:shadow-md transition-all">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">✨ Newest First</SelectItem>
                      <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                      <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center bg-white/80 backdrop-blur-sm border border-houselook-aliceblue rounded-xl p-1 shadow-sm">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`h-9 w-9 p-0 transition-all ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white shadow-md"
                          : "hover:bg-houselook-cyan/10"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`h-9 w-9 p-0 transition-all ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white shadow-md"
                          : "hover:bg-houselook-cyan/10"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State with Animation */}
          {isLoading && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Results Grid with Staggered Animation */}
          {!isLoading && (
            <div className="mb-16">
              {filteredHouses.length > 0 ? (
                <div
                  className={`grid gap-8 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 max-w-4xl mx-auto"
                  }`}
                >
                  {filteredHouses.slice(0, visibleCount).map((house, index) => (
                    <div
                      key={house.id}
                      className="animate-in fade-in duration-700 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <HouseCard house={house} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl animate-in fade-in duration-1000">
                  <div className="w-24 h-24 bg-gradient-to-br from-houselook-cyan/20 to-houselook-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="w-12 h-12 text-houselook-cyan" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No Properties Found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    We couldn't find any properties matching your criteria. Try adjusting your filters to discover more
                    amazing homes.
                  </p>
                  <Button
                    onClick={() => {
                      setFilteredHouses(allHouses)
                      window.history.pushState({}, "", "/listings")
                    }}
                    className="bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    View All Properties
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Load More Button */}
          {!isLoading && filteredHouses.length > visibleCount && (
            <div className="text-center mb-20 animate-in fade-in duration-1000 delay-1000">
              <div className="inline-flex flex-col items-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-12 py-4 text-lg border-2 border-houselook-cyan/30 text-houselook-blue hover:bg-gradient-to-r hover:from-houselook-cyan hover:to-houselook-blue hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Load More Properties
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Showing {visibleCount} of {filteredHouses.length} properties
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
