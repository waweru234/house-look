"use client"

import { useEffect, useState } from "react"
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "@/lib/firebase" // <-- Make sure this is your Firebase initialized app
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Heart, Play, Sparkles, Search } from "lucide-react"

interface Property {
  id: string
  image2Url: string
  furnished: string
  rent: number
  town: string
}

// Static background hero section images
const backgroundImages = [
  "/images/luxury-complex-aerial.webp",
  "/images/modern-apartments-1.jpeg",
  "/images/contemporary-apartments.jpeg",
  "/images/luxury-balcony.jpeg",
]

export function HeroSection() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [properties, setProperties] = useState<Property[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotate background images
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(bgTimer)
  }, [])

  // Fetch properties from Firebase
  useEffect(() => {
    const db = getDatabase(app)
    const refPath = ref(db, "property")
    const unsubscribe = onValue(refPath, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list: Property[] = Object.entries(data).map(([id, prop]: any) => ({
          id,
          image2Url: prop.image2Url || "",
          furnished: prop.furnished || "Not specified",
          rent: prop.rent || 0,
          town: prop.town || "Unknown",
        }))
        setProperties(list)
      }
    })
    return () => unsubscribe()
  }, [])

  // Rotate interior property showcase
  useEffect(() => {
    if (properties.length < 2) return
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % properties.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [properties])

  const current = properties[currentIndex]

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden" style={{ fontFamily: 'Perpetua, serif' }}>
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-houselook-indigo/60 to-houselook-cyan/40 animate-gradient-move" />
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBgIndex ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover object-center scale-105"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/70" />
        {/* Subtle animated shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-houselook-cyan/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-houselook-indigo/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center space-y-12">
        <div className="inline-flex items-center px-4 py-2 bg-houselook-white/10 border border-houselook-cyan/30 rounded-full shadow-lg mb-2">
          <Sparkles className="w-5 h-5 text-houselook-cyan mr-2 animate-bounce" />
          <span className="text-houselook-cyan font-bold text-base font-heading tracking-wide" style={{ fontFamily: 'Brush Script MT, cursive' }}>
            Kenya's Premier Housing Platform
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white drop-shadow-2xl" style={{ fontFamily: 'Perpetua, serif', textShadow: '0 4px 32px rgba(0,255,255,0.15)' }}>
          Find Your <span className="bg-gradient-to-r from-houselook-cyan to-houselook-indigo bg-clip-text text-transparent" style={{ fontFamily: 'Brush Script MT, cursive' }}>Dream Home</span>
        </h1>
        <p className="text-lg md:text-2xl text-houselook-white/90 font-medium max-w-2xl mx-auto mb-4" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}>
          Discover the most stylish rentals in Kenya, curated for modern living. Your perfect home is just a search away.
        </p>
        <Link href="/listings">
          <Button size="lg" className="bg-gradient-to-r from-houselook-cyan to-houselook-indigo text-white text-lg font-bold px-10 py-5 rounded-full shadow-xl hover:scale-105 transition-all duration-300 relative" style={{ fontFamily: 'Perpetua, serif' }}>
            <span className="absolute -inset-2 rounded-full bg-houselook-cyan/20 blur-2xl opacity-60 -z-10" />
            <Search className="mr-3 w-6 h-6" /> Start Searching
          </Button>
        </Link>
      </div>
      {/* Property Showcase Card */}
      {current && (
        <div className="relative z-10 mt-4 w-full max-w-lg mx-auto">
          <div className="bg-white/90 rounded-3xl shadow-2xl border-2 border-houselook-cyan/40 overflow-hidden flex flex-col md:flex-row items-center ring-4 ring-houselook-cyan/10">
            <div className="relative w-full h-72 md:w-72 md:h-72 flex-shrink-0">
              <Image
                src={current.image2Url}
                alt="Property Interior"
                fill
                className="object-cover object-center rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 rounded-3xl" />
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <p className="text-houselook-cyan font-bold text-lg mb-2">{current.furnished}</p>
                <p className="text-houselook-darkGray text-xl font-semibold flex items-center mb-3">
                  <MapPin className="w-5 h-5 mr-2" /> {current.town}
                </p>
              </div>
              <div className="text-right mt-4">
                <p className="text-3xl font-extrabold text-houselook-indigo font-heading">KSh {current.rent.toLocaleString()}</p>
                <p className="text-base text-houselook-coolGray">per month</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
