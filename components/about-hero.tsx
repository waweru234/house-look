"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Users, MapPin, Sparkles } from "lucide-react"

const heroImages = [
  "/images/modern-apartments-1.jpeg",
  "/images/elegant-living-room.jpeg",
  "/images/contemporary-apartments.jpeg",
]

export function AboutHero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="HouseLook About"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Professional overlay */}
        <div className="absolute inset-0 bg-houselook-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-houselook-indigo/30 via-houselook-black/40 to-houselook-cyan/20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-8 animate-professional-float opacity-60">
        <div className="w-12 h-12 bg-houselook-cyan/30 rounded-full flex items-center justify-center shadow-professional">
          <Heart className="w-6 h-6 text-houselook-cyan" />
        </div>
      </div>

      <div className="absolute bottom-32 right-12 animate-professional-pulse opacity-50">
        <div className="w-10 h-10 bg-houselook-indigo/40 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-houselook-indigo" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-houselook-white/10 backdrop-blur-md border border-houselook-cyan/30 rounded-full shadow-professional mb-8">
          <Sparkles className="w-5 h-5 text-houselook-cyan mr-2" />
          <span className="text-houselook-white font-semibold font-heading">About HouseLook</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-6">
          <span className="text-houselook-white">Meet </span>
          <span className="bg-gradient-primary bg-clip-text text-transparent font-display">HouseLook</span>
        </h1>

        <p className="text-lg md:text-xl text-houselook-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Your <span className="text-houselook-cyan font-semibold">home-hunting partner</span> designed by students, for{" "}
          <span className="text-houselook-indigo font-semibold">young Kenyans</span> who deserve better.
        </p>

        <div className="flex items-center justify-center text-houselook-white/80 text-lg">
          <MapPin className="w-5 h-5 mr-2 text-houselook-cyan" />
          <span className="font-medium">Built in Kenya, for Kenyans 🇰🇪</span>
        </div>
      </div>
    </section>
  )
}
