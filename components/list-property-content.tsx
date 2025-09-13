"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Send } from "lucide-react"
import { getDatabase, ref, push, set } from "firebase/database"
import { getCurrentUser } from "@/lib/auth"

export function ListPropertyContent() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  const [geoLoading, setGeoLoading] = useState(false)
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [geocodeMessage, setGeocodeMessage] = useState<string>("")

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyCategory: "flat", // flat | shop | house | office
    unitType: "bedsitter", // bedsitter | single-room | one-bedroom | two-bedroom | three-bedroom | studio | other
    rentAmount: "",
    depositAmount: "",
    furnishedStatus: "unfurnished", // furnished | semi-furnished | unfurnished
    amenitiesCsv: "", // comma separated
    county: "",
    subCounty: "",
    city: "",
    town: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    directions: "",
    agentName: "",
    agentPhone: "",
  })

  // Compute amenities array from CSV
  const amenitiesArray = useMemo(() => {
    return formData.amenitiesCsv
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
  }, [formData.amenitiesCsv])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(!!user.isAdmin)
  }, [])

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!isAdmin) {
      setErrorMessage("Access denied. Admins only.")
      return
    }

    // Basic validation
    if (!formData.propertyName || !formData.rentAmount || !formData.agentPhone || !formData.agentName) {
      setErrorMessage("Please fill in required fields: Property name, Rent, Agent name and phone.")
      return
    }

    setIsSubmitting(true)
    try {
      const db = getDatabase()
      const propertyRef = ref(db, "property")
      const newRef = push(propertyRef)
      const user = getCurrentUser()

      const payload = {
        id: newRef.key,
        name: formData.propertyName,
        propertyCategory: formData.propertyCategory,
        unitType: formData.unitType,
        rent: Number(formData.rentAmount) || 0, // Store in rent node
        deposit: Number(formData.depositAmount) || 0,
        furnishedStatus: formData.furnishedStatus,
        amenities: amenitiesArray,
        location: formData.address, // Store address in location node
        county: formData.county,
        subCounty: formData.subCounty,
        city: formData.city, // Store city in city node
        town: formData.town, // Store town in town node
        coordinates: {
          lat: Number(formData.latitude) || null,
          lng: Number(formData.longitude) || null,
        },
        description: formData.description,
        direction: formData.directions, // Store in direction node
        agent: {
          names: formData.agentName, // Store agent name in names node
          phone: formData.agentPhone,
        },
        available: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid || "admin",
      }

      await set(newRef, payload)

      setShowSuccess(true)
      setIsSubmitting(false)
      // Reset after a short delay
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          propertyName: "",
          propertyCategory: "flat",
          unitType: "bedsitter",
          rentAmount: "",
          depositAmount: "",
          furnishedStatus: "unfurnished",
          amenitiesCsv: "",
          county: "",
          subCounty: "",
          city: "",
          town: "",
          address: "",
          latitude: "",
          longitude: "",
          description: "",
          directions: "",
          agentName: "",
          agentPhone: "",
        })
      }, 2500)
    } catch (err) {
      console.error("Error saving property:", err)
      setIsSubmitting(false)
      setErrorMessage("Failed to save property. Please try again.")
    }
  }

  const useMyLocation = () => {
    setGeocodeMessage("")
    if (!("geolocation" in navigator)) {
      setGeocodeMessage("Geolocation not supported by this browser.")
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setFormData((prev) => ({
          ...prev,
          latitude: String(latitude),
          longitude: String(longitude),
        }))
        setGeoLoading(false)
        setGeocodeMessage("Location detected and applied.")
      },
      (err) => {
        setGeoLoading(false)
        setGeocodeMessage(err.message || "Failed to get device location.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const geocodeAddress = async () => {
    setGeocodeMessage("")
    const parts = [formData.address, formData.town, formData.city, formData.subCounty, formData.county, "Kenya"]
      .map((p) => (p || "").trim())
      .filter(Boolean)
    if (parts.length === 0) {
      setGeocodeMessage("Enter address/town/city/county to geocode.")
      return
    }
    const q = encodeURIComponent(parts.join(", "))
    setGeocodeLoading(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`, {
        headers: { "Accept": "application/json" }
      })
      if (!res.ok) throw new Error("Geocoding request failed")
      const data: Array<{ lat: string; lon: string; display_name?: string }> = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon,
        }))
        setGeocodeMessage("Address geocoded successfully.")
      } else {
        setGeocodeMessage("No results found for the provided address.")
      }
    } catch (e: any) {
      setGeocodeMessage(e?.message || "Failed to geocode address.")
    } finally {
      setGeocodeLoading(false)
    }
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <p className="text-houselook-darkGray">Checking permissions…</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-houselook-white to-houselook-whitesmoke pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-soft-xl bg-houselook-white rounded-2xl">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-black text-houselook-black mb-2">Access Denied</h1>
              <p className="text-houselook-darkGray">Only admins can list properties.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-houselook-white to-houselook-whitesmoke pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-soft-xl bg-houselook-white rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-houselook-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-houselook-success" />
              </div>
              <h1 className="text-3xl font-black text-houselook-black mb-4">Property Listed!</h1>
              <p className="text-lg text-houselook-darkGray mb-6">Your property has been saved successfully.</p>
              <Button onClick={() => (window.location.href = "/listings")} className="bg-houselook-cyan hover:bg-houselook-teal text-houselook-black font-bold px-8 py-3 rounded-lg shadow-soft transition-all duration-300">
                Go to Listings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-houselook-white to-houselook-whitesmoke pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-houselook-black mb-3">Admin: List Property</h1>
          <p className="text-houselook-darkGray">Fill all the details below. Fields marked with * are required.</p>
        </div>

        <Card className="border-0 shadow-soft-xl bg-houselook-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-houselook-black to-houselook-darkGray text-houselook-white rounded-t-2xl">
            <CardTitle className="text-2xl font-black">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyName" className="font-bold">Property Name *</Label>
                  <Input id="propertyName" value={formData.propertyName} onChange={(e) => updateField("propertyName", e.target.value)} placeholder="e.g., Sunrise Apartments" required />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Property Category</Label>
                  <Select value={formData.propertyCategory} onValueChange={(v) => updateField("propertyCategory", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Unit Type</Label>
                  <Select value={formData.unitType} onValueChange={(v) => updateField("unitType", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bedsitter">Bedsitter</SelectItem>
                      <SelectItem value="single-room">Single Room</SelectItem>
                      <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                      <SelectItem value="two-bedroom">Two Bedroom</SelectItem>
                      <SelectItem value="three-bedroom">Three Bedroom</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishedStatus" className="font-bold">Furnished Status</Label>
                  <Select value={formData.furnishedStatus} onValueChange={(v) => updateField("furnishedStatus", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentAmount" className="font-bold">Monthly Rent (KSh) *</Label>
                  <Input id="rentAmount" type="number" inputMode="numeric" value={formData.rentAmount} onChange={(e) => updateField("rentAmount", e.target.value)} placeholder="e.g., 15000" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className="font-bold">Deposit (KSh)</Label>
                  <Input id="depositAmount" type="number" inputMode="numeric" value={formData.depositAmount} onChange={(e) => updateField("depositAmount", e.target.value)} placeholder="e.g., 15000" />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label htmlFor="amenitiesCsv" className="font-bold">Amenities (comma separated)</Label>
                <Input id="amenitiesCsv" value={formData.amenitiesCsv} onChange={(e) => updateField("amenitiesCsv", e.target.value)} placeholder="e.g., Wi-Fi, Parking, Security, Water" />
                {amenitiesArray.length > 0 && (
                  <p className="text-sm text-houselook-darkGray">Parsed: {amenitiesArray.join(", ")}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <h3 className="font-bold mb-3 text-houselook-black">Location</h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Button type="button" onClick={useMyLocation} disabled={geoLoading} className="bg-houselook-cyan hover:bg-houselook-teal text-houselook-black">
                    {geoLoading ? "Detecting..." : "Use My Location"}
                  </Button>
                  <Button type="button" onClick={geocodeAddress} disabled={geocodeLoading} className="bg-houselook-indigo hover:bg-houselook-cyan text-white">
                    {geocodeLoading ? "Geocoding..." : "Geocode Address"}
                  </Button>
                  {geocodeMessage && (
                    <span className="text-sm text-houselook-darkGray">{geocodeMessage}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="county" className="font-bold">County</Label>
                    <Input id="county" value={formData.county} onChange={(e) => updateField("county", e.target.value)} placeholder="e.g., Nairobi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subCounty" className="font-bold">Subcounty</Label>
                    <Input id="subCounty" value={formData.subCounty} onChange={(e) => updateField("subCounty", e.target.value)} placeholder="e.g., Westlands" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-bold">City</Label>
                    <Input id="city" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g., Nairobi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="town" className="font-bold">Town</Label>
                    <Input id="town" value={formData.town} onChange={(e) => updateField("town", e.target.value)} placeholder="e.g., Parklands" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-bold">Place / Address</Label>
                    <Input id="address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street, Building, Landmarks" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="font-bold">Latitude</Label>
                    <Input id="latitude" value={formData.latitude} onChange={(e) => updateField("latitude", e.target.value)} placeholder="-1.2921" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="font-bold">Longitude</Label>
                    <Input id="longitude" value={formData.longitude} onChange={(e) => updateField("longitude", e.target.value)} placeholder="36.8219" />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold">Description</Label>
                  <textarea id="description" value={formData.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", e.target.value)} placeholder="Describe the house, features, terms, etc." className="min-h-[120px] w-full border border-gray-300 rounded-md p-3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="directions" className="font-bold">Directions</Label>
                  <textarea id="directions" value={formData.directions} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("directions", e.target.value)} placeholder="How to get there from a known point" className="min-h-[120px] w-full border border-gray-300 rounded-md p-3" />
                </div>
              </div>

              {/* Agent */}
              <div>
                <h3 className="font-bold mb-3 text-houselook-black">Agent Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="agentName" className="font-bold">Agent Name *</Label>
                    <Input id="agentName" value={formData.agentName} onChange={(e) => updateField("agentName", e.target.value)} placeholder="e.g., Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agentPhone" className="font-bold">Agent Phone *</Label>
                    <Input id="agentPhone" value={formData.agentPhone} onChange={(e) => updateField("agentPhone", e.target.value)} placeholder="e.g., +2547XXXXXXXX" required />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-houselook-cyan hover:bg-houselook-teal text-houselook-black font-black text-lg py-4 rounded-lg shadow-soft transition-all duration-300 hover:scale-105">
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-houselook-black mr-3"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-3" />
                    Save Property
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
