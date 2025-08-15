"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"
import { FeaturedHouses } from "@/components/featured-houses"
import { Footer } from "@/components/footer"
import { HouseCard } from "@/components/house-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null)
  const [searchFilters, setSearchFilters] = useState(null)
  const [showCount, setShowCount] = useState(4)
  const router = useRouter()

  const handleSearch = (results, filters) => {
    setSearchResults(results)
    setSearchFilters(filters)
    setShowCount(4)
  }

  const handleShowMore = () => {
    setShowCount((prev) => prev + 4)
  }

  const handleSeeAll = () => {
    if (!searchFilters) return router.push("/listings")
    const params = new URLSearchParams()
    if (searchFilters.location) params.set("location", searchFilters.location)
    if (searchFilters.priceRange) params.set("price", `${searchFilters.priceRange[0]}-${searchFilters.priceRange[1]}`)
    if (searchFilters.roomType) params.set("type", searchFilters.roomType)
    if (searchFilters.selectedAmenities && searchFilters.selectedAmenities.length > 0) params.set("amenities", searchFilters.selectedAmenities.join(","))
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div>
      <HeroSection />
      <SearchSection onSearch={handleSearch} />
      {searchResults ? (
        <div className="bg-houselook-whitesmoke pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                {searchResults.length > 0 ? `${searchResults.length} Properties Found` : "No Properties Found"}
              </h2>
              <p className="text-lg text-gray-600">
                {searchResults.length > 0
                  ? "Here are the best matches for your search."
                  : "Try adjusting your filters or view all available properties."}
              </p>
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {searchResults.slice(0, showCount).map((house) => (
                  <HouseCard key={house.id} house={house} />
                ))}
              </div>
            ) : (
              <div className="bg-white/80 rounded-2xl shadow-xl p-10 text-center">
                <p className="text-lg text-houselook-darkGray font-semibold mb-2">We couldn't find any properties matching your search.</p>
                <Button
                  variant="outline"
                  className="border-houselook-cyan text-houselook-blue font-bold px-6 py-2 rounded-lg shadow-soft hover:bg-houselook-cyan/10 transition-all duration-300"
                  onClick={() => router.push("/listings")}
                >
                  View All Properties
                </Button>
              </div>
            )}
            {searchResults.length > showCount && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  className="border-houselook-cyan text-houselook-blue font-bold px-6 py-2 rounded-lg shadow-soft hover:bg-houselook-cyan/10 transition-all duration-300 mr-4"
                  onClick={handleShowMore}
                >
                  Show More
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-houselook-cyan to-houselook-blue text-white font-bold px-6 py-2 rounded-lg shadow-soft hover:shadow-cyan-glow transition-all duration-300"
                  onClick={handleSeeAll}
                >
                  See All Search Results
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-houselook-whitesmoke pt-24 pb-16">
          <FeaturedHouses />
        </div>
      )}
      <Footer />
    </div>
  )
}
