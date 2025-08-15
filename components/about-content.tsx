"use client"

import Image from "next/image"
import { Mail, MapPin, Heart, Shield, Zap, Users, Target, Rocket, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function AboutContent() {
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Clean, modern, Gen Z-friendly design",
      description: "Built with the aesthetics and usability that young people love",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real photos of houses",
      description: "No more fake listings or misleading images",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart filters to narrow down your search",
      description: "Find exactly what you're looking for, faster",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Built by students, for students",
      description: "We understand the struggles because we've lived them",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Scam-free listings you can trust",
      description: "Verified properties and legitimate agents only",
    },
  ]

  return (
    <div className="relative py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-houselook-cyan/5 to-houselook-teal/5 blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-houselook-indigo/5 to-houselook-cyan/5 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-6">
                About <span className="font-display bg-gradient-primary bg-clip-text text-transparent">HouseLook</span>
              </h2>
              <div className="prose text-houselook-darkGray leading-relaxed space-y-4">
                <p>Welcome to HouseLook — your home-hunting partner.</p>
                <p>
                  Finding a house in Kenya, especially as a young person, can be stressful. Endless WhatsApp groups,
                  fake agents, outdated listings, and high broker fees — we've all been there.
                </p>
                <p className="text-houselook-cyan font-semibold text-lg">HouseLook was created to change that.</p>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-professional-xl">
                <Image src="/images/scandinavian-living.webp" alt="Modern Living Space" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-houselook-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-houselook-white/95 backdrop-blur-md rounded-xl p-4 shadow-professional">
                    <p className="text-sm font-bold text-houselook-black font-heading">
                      "Making house-hunting easier for young Kenyans"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Built Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-professional-xl">
                <Image
                  src="/images/african-inspired-living.webp"
                  alt="African Inspired Living"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-houselook-indigo/30 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="bg-houselook-white/95 backdrop-blur-md rounded-xl p-3 shadow-professional">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-houselook-cyan mr-2" />
                      <span className="text-sm font-bold text-houselook-black">Student-Friendly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-6">
                 Why We Built <span className="font-display bg-gradient-primary bg-clip-text text-transparent">HouseLook</span>
              </h2>
              <div className="prose text-houselook-darkGray leading-relaxed space-y-4">
                <p>
                  We've both experienced how hard it can be to find a decent place to stay — whether you're moving into
                  campus hostels, looking for a bedsitter near town, or just trying to avoid being scammed by fake
                  agents.
                </p>
                <p>
                  We realized there was a gap in the market for a clean, simple, and youth-focused house-hunting
                  platform that's mobile-first, visual, and genuinely helpful.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-houselook-cyan/5 via-houselook-white to-houselook-indigo/5 border border-houselook-cyan/20 rounded-3xl shadow-professional-xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <Target className="w-10 h-10 text-houselook-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-6">
                Our <span className="font-display bg-gradient-secondary bg-clip-text text-transparent">Mission</span>
              </h2>
              <p className="text-xl text-houselook-darkGray mb-8 max-w-3xl mx-auto leading-relaxed">
                To make house-hunting <span className="text-houselook-cyan font-semibold">easier</span>,{" "}
                <span className="text-houselook-indigo font-semibold">safer</span>, and more{" "}
                <span className="text-houselook-cyan font-semibold">honest</span> for young Kenyans.
              </p>
              <p className="text-lg text-houselook-coolGray">
                Whether you're in Nairobi, Kisumu, Eldoret, or Mombasa — we want HouseLook to be your go-to platform for
                finding the perfect place.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-4">
               What Makes HouseLook{" "}
              <span className="font-display bg-gradient-primary bg-clip-text text-transparent">Different</span>
            </h2>
            <p className="text-lg text-houselook-darkGray max-w-3xl mx-auto">
              We're not just another property platform. We're built by young people, for young people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-houselook-white shadow-professional border border-houselook-coolGray/10 rounded-2xl overflow-hidden group hover:shadow-professional-lg transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-houselook-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-houselook-black mb-3 font-heading">{feature.title}</h3>
                  <p className="text-houselook-darkGray leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Future Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-houselook-indigo/5 via-houselook-white to-houselook-cyan/5 border border-houselook-indigo/20 rounded-3xl shadow-professional-xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                <Rocket className="w-10 h-10 text-houselook-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-6">
               This is Just the <span className="font-display bg-gradient-primary bg-clip-text text-transparent">Beginning</span>
              </h2>
              <p className="text-lg text-houselook-darkGray mb-8 max-w-3xl mx-auto leading-relaxed">
                HouseLook is still growing. We're working hard to bring you better features, more listings, and
                collaborations with trusted landlords and agents.
              </p>
              <p className="text-base text-houselook-coolGray">
                We're excited for what's ahead — and we're glad you're here with us.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Connect Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black font-heading text-houselook-black mb-8">
             Let's <span className="font-display bg-gradient-secondary bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-lg text-houselook-darkGray mb-8 max-w-3xl mx-auto">
            Whether you're a student looking for a place, a landlord wanting to list properties, or a developer who
            wants to collaborate — reach out! We'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button className="bg-gradient-primary text-houselook-white font-bold px-8 py-4 shadow-professional-lg hover:shadow-cyan-glow transition-all duration-300 hover:scale-105 rounded-xl font-heading">
              <Mail className="w-5 h-5 mr-2" />
              houselook254@gmail.com
            </Button>

            <div className="flex items-center text-houselook-darkGray">
              <MapPin className="w-5 h-5 mr-2 text-houselook-cyan" />
              <span className="font-medium">Based in Nairobi, Kenya</span>
            </div>
          </div>

          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-houselook-cyan/10 to-houselook-indigo/10 backdrop-blur-sm border border-houselook-cyan/30 rounded-full shadow-professional">
            <Heart className="w-6 h-6 text-houselook-cyan mr-3" />
            <span className="text-xl font-bold text-houselook-black font-heading">
              Built in Kenya, for Kenyans 🇰🇪
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
