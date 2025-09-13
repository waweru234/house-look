"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Wifi,
  Car,
  Shield,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ListingsSearchBarProps {
  onFilterChange?: (filters: any) => void
}

export function ListingsSearchBar({ onFilterChange }: ListingsSearchBarProps) {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [roomType, setRoomType] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const popularLocations = ["Kahawa Wendani", "Kahawa Sukari", "Kenyatta Market","Kiwanja"]

  // Initialize from URL params
  useEffect(() => {
    const locationParam = searchParams.get("location")
    const priceParam = searchParams.get("price")
    const typeParam = searchParams.get("type")

    if (locationParam) setLocation(locationParam)
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number)
      setPriceRange([min || 0, max || 30000])
    }
    if (typeParam) setRoomType(typeParam)
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (priceRange[0] > 0 || priceRange[1] < 30000) params.set("price", `${priceRange[0]}-${priceRange[1]}`)
    if (roomType) params.set("type", roomType)

    const newUrl = `/listings?${params.toString()}`
    router.push(newUrl)

    // Call the filter change callback if provided
    if (onFilterChange) {
      onFilterChange({
        location,
        priceRange,
        roomType,
      })
    }
  }

  const clearFilters = () => {
    setLocation("")
    setPriceRange([0, 30000])
    setRoomType("")
    router.push("/listings")
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const hasActiveFilters =
    location || roomType || priceRange[0] > 0 || priceRange[1] < 30000

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-houselook-aliceblue/50 overflow-hidden">
      <div className="p-6">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Location */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="w-5 h-5" />
            </div>
            <Input
              placeholder="Search location..."
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
                  <SelectValue placeholder="Price" />
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

          {/* Property Type */}
          <div className="relative">
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="h-12 border-houselook-aliceblue">
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Type" />
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

          {/* Advanced Toggle */}
          <div className="hidden lg:block">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-12 w-full border-houselook-aliceblue hover:bg-houselook-cyan/5"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Search Button */}
          <div className="col-span-1 md:col-span-4 lg:col-span-1">
            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Mobile Advanced Toggle */}
        <div className="lg:hidden mt-4">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full h-10 border-houselook-aliceblue hover:bg-houselook-cyan/5"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="bg-houselook-aliceblue/30 rounded-xl p-5 mt-4 border border-houselook-aliceblue/50 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 gap-6">
              {/* Price Range Slider */}
              <div>
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

        {/* Active Filters & Popular Searches */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-5 border-t border-houselook-aliceblue/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Popular:</span>
            {popularLocations.map((area) => (
              <Badge
                key={area}
                variant="outline"
                className="cursor-pointer bg-white hover:bg-houselook-cyan/10 hover:border-houselook-cyan/30 transition-all duration-200 text-xs"
                onClick={() => {
                  setLocation(area)
                  handleSearch()
                }}
              >
                {area}
              </Badge>
            ))}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
