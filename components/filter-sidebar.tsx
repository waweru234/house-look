"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface House {
  id: number
  title: string
  location: string
  price: number
  type: string
  image: string
  amenities: string[]
  available: boolean
}

interface FilterSidebarProps {
  onFilterChange: (houses: House[]) => void
  allHouses: House[]
}

export function FilterSidebar({ onFilterChange, allHouses }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [location, setLocation] = useState("")

  const houseTypes =["Single","Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom"]
  const amenities = ["Wi-Fi", "Parking", "Security", "Water Included", "Furnished", "Garden", "Gym", "Pool"]

  const suggestedLocations = [
    "Kahawa Wendani",
    "Kahawa Sukari",
    "Kenyatta Market"
  ]

  const applyFilters = () => {
    let filtered = allHouses

    // Filter by price range
    filtered = filtered.filter((house) => house.price >= priceRange[0] && house.price <= priceRange[1])

    // Filter by location
    if (location) {
      filtered = filtered.filter((house) => house.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Filter by house type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((house) => selectedTypes.includes(house.type))
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((house) => selectedAmenities.some((amenity) => house.amenities.includes(amenity)))
    }

    onFilterChange(filtered)
  }

  const clearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedTypes([])
    setSelectedAmenities([])
    setLocation("")
    onFilterChange(allHouses)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <select
            id="location-select"
            className="w-full mt-1 mb-2 rounded border border-gray-300 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-houselook-cyan"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {suggestedLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <Input
            id="location"
            placeholder="Or type a location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Price Range */}
        <div>
          <Label>
            Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
          </Label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={50000} min={0} step={1000} className="mt-2" />
        </div>

        {/* House Type */}
        <div>
          <Label className="text-base font-medium">House Type</Label>
          <div className="space-y-2 mt-2">
            {houseTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                    if (checked) {
                      setSelectedTypes([...selectedTypes, type])
                    } else {
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                    }
                  }}
                />
                <Label htmlFor={type} className="text-sm font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-base font-medium">Amenities</Label>
          <div className="space-y-2 mt-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                    if (checked) {
                      setSelectedAmenities([...selectedAmenities, amenity])
                    } else {
                      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
                    }
                  }}
                />
                <Label htmlFor={amenity} className="text-sm font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={applyFilters} className="w-full bg-primary text-black hover:bg-primary/90">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
