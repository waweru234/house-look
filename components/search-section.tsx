"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Home, DollarSign, Wifi, Car, Shield, Sparkles, ChevronDown, X, Home as HomeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "@/lib/firebase"
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

export function SearchSection({ onSearch }: { onSearch?: (results: any[], filters: any) => void }) {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [roomType, setRoomType] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchResults, setSearchResults] = useState<House[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const popularLocations = ["Kahawa Wendani", "Kahawa Sukari", "Kenyatta Market","Kiwanja"]

  const handleSearch = () => {
    setIsSearching(true)
    const db = getDatabase(app)
    const propertiesRef = ref(db, "property")
    onValue(
      propertiesRef,
      (snapshot) => {
        const data = snapshot.val()
        let houses: House[] = []
        for (const id in data) {
          const house = data[id]
          houses.push({
            id,
            name: house.name || "Untitled Property",
            city: house.town || "Unknown",
            rent: house.rent || 0,
            bedroom: house.bedroom || "Unknown",
            image1Url: house.image1Url || "/placeholder.svg",
            amenities: [house.furnished, ...(house.amenities || [])].filter(Boolean),
            vacancies: house.vacancies || "0",
          })
        }
        // Apply filters
        if (location) {
          houses = houses.filter((h) => h.city.toLowerCase().includes(location.toLowerCase()))
        }
        if (priceRange) {
          houses = houses.filter((h) => h.rent >= priceRange[0] && h.rent <= priceRange[1])
        }
        if (roomType) {
          houses = houses.filter((h) => h.bedroom.toLowerCase().includes(roomType.toLowerCase()))
        }
        setIsSearching(false)
        if (onSearch) {
          onSearch(houses, {
            location,
            priceRange,
            roomType,
          })
        }
      },
      {
        onlyOnce: true,
      },
    )
  }

  const clearFilters = () => {
    setLocation("")
    setPriceRange([0, 30000])
    setRoomType("")
    setSearchResults(null)
  }

  return (
    <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-houselook-aliceblue">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {/* Location */}
            <div className="relative col-span-1 md:col-span-1 lg:col-span-2">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <Input
                placeholder="Location (e.g., Kenyatta Market, Kiwanja)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 border-houselook-aliceblue focus:border-houselook-cyan"
              />
              {location && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setLocation("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="relative">
              <Select
                value={priceRange.join("-")}
                onValueChange={(val) => {
                  const [min, max] = val.split("-").map(Number)
                  setPriceRange([min, max])
                }}
              >
                <SelectTrigger className="h-12 border-houselook-aliceblue">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    <SelectValue placeholder="Price Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-5000">Under KSh 5,000</SelectItem>
                  <SelectItem value="5000-10000">KSh 5,000 - 10,000</SelectItem>
                  <SelectItem value="10000-20000">KSh 10,000 - 20,000</SelectItem>
                  <SelectItem value="20000-30000">KSh 20,000 - 30,000</SelectItem>
                  <SelectItem value="30000-50000">Above KSh 30,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Type */}
            <div className="relative">
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="h-12 border-houselook-aliceblue">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-400 mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="bedsitter">Bedsitter</SelectItem>
                  <SelectItem value="1 bedroom">1 Bedroom</SelectItem>
                  <SelectItem value="2 bedroom">2 Bedroom</SelectItem>
                  <SelectItem value="3 bedroom">3 Bedroom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1">
              <Button
                onClick={handleSearch}
                className="w-full h-12 bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-semibold text-base"
                disabled={isSearching}
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Advanced Search Toggle */}
          <div className="flex justify-between items-center mb-4 mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-houselook-blue hover:text-houselook-cyan transition-colors text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {showAdvanced ? "Hide" : "Show"} Advanced Search
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            {(location ||
              roomType ||
              priceRange[0] > 0 ||
              priceRange[1] < 30000) && (
              <button onClick={clearFilters} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Clear All Filters
              </button>
            )}
          </div>

          {/* Advanced Search Options */}
          {showAdvanced && (
            <div className="bg-houselook-aliceblue/30 rounded-xl p-5 mb-6 border border-houselook-aliceblue/50 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Slider */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-gray-700">Price Range</Label>
                    <span className="text-sm font-medium text-houselook-blue">
                      KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={50000}
                    step={1000}
                    className="py-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Popular:</span>
            {popularLocations.map((area) => (
              <Badge
                key={area}
                variant="outline"
                className="cursor-pointer bg-white hover:bg-houselook-cyan/10 hover:border-houselook-cyan/30 transition-all duration-200"
                onClick={() => {
                  setLocation(area)
                  setTimeout(() => handleSearch(), 0)
                }}
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
