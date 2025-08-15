"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MessageCircle, CheckCircle, Send } from "lucide-react"
import { getDatabase, ref, push, set } from "firebase/database"
import { getCurrentUser } from "@/lib/auth"

export function ListPropertyContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const user = getCurrentUser()
      const db = getDatabase()
      
      // Create a unique ID for the listing request
      const listingRef = ref(db, 'propertyRequests')
      const newListingRef = push(listingRef)
      
      // Prepare the listing data
      const listingData = {
        id: newListingRef.key,
        fullName: formData.fullName,
        contact: formData.contact,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        contacted: false,
        notes: '',
        propertyDetails: {
          title: '',
          location: '',
          price: 0,
          type: '',
          bedrooms: '',
          description: ''
        }
      }

      // Save to Firebase
      await set(newListingRef, listingData)

      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          fullName: "",
          contact: "",
        })
      }, 4000)
    } catch (error) {
      console.error('Error submitting listing request:', error)
      setIsSubmitting(false)
      alert('Failed to submit your request. Please try again.')
    }
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
              <h1 className="text-3xl font-black text-houselook-black mb-4 font-heading">Thank You! 🎉</h1>
              <p className="text-lg text-houselook-darkGray mb-6">
                We've received your property listing request. Our team will contact you within one hour!
              </p>
              <div className="bg-houselook-success/5 border border-houselook-success/20 rounded-xl p-4 mb-6">
                <p className="text-houselook-success font-semibold text-sm">
                  ✅ Your details have been submitted successfully
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-houselook-cyan hover:bg-houselook-teal text-houselook-black font-bold px-8 py-3 rounded-lg shadow-soft hover:shadow-cyan-glow transition-all duration-300"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-houselook-white to-houselook-whitesmoke pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-houselook-black mb-6 font-heading">
            List Your Property on <span className="text-houselook-cyan">HouseLook</span>
          </h1>
          <p className="text-xl text-houselook-darkGray max-w-2xl mx-auto font-medium">
            Join thousands of property owners who trust HouseLook to showcase their properties
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Instructions Section */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-soft-lg bg-houselook-white rounded-2xl mb-6">
              <CardHeader className="bg-gradient-to-r from-houselook-cyan to-houselook-teal text-houselook-black rounded-t-2xl">
                <CardTitle className="text-xl font-black font-heading">📋 How It Works</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-houselook-darkGray font-medium leading-relaxed">
                    To list your property on HouseLook, please provide your full name and an active phone number or
                    email address. We will contact you within <strong className="text-houselook-black">one hour</strong>{" "}
                    after receiving your details.
                  </p>

                  <div className="bg-houselook-aliceblue rounded-xl p-4">
                    <h3 className="font-bold text-houselook-black mb-3">📞 Contact Us Directly:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-houselook-info/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-houselook-info" />
                        </div>
                        <div>
                          <p className="font-semibold text-houselook-black text-sm">Email</p>
                          <p className="text-houselook-darkGray text-sm">info@houselook.co.ke</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-houselook-success/10 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-houselook-success" />
                        </div>
                        <div>
                          <p className="font-semibold text-houselook-black text-sm">Phone & WhatsApp</p>
                          <p className="text-houselook-darkGray text-sm">0793779647</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      window.open(
                        "https://wa.me/254793779647?text=Hi, I want to list my property on HouseLook",
                        "_blank",
                      )
                    }
                    className="w-full bg-houselook-success hover:bg-houselook-success/90 text-houselook-white font-bold py-3 rounded-lg shadow-soft transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-0 shadow-soft-lg bg-houselook-white rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-houselook-indigo to-houselook-cyan text-houselook-white rounded-t-2xl">
                <CardTitle className="text-lg font-black font-heading">✨ Why Choose HouseLook?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-houselook-cyan rounded-full"></div>
                    <span className="text-houselook-darkGray font-medium text-sm">Fast response within 1 hour</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-houselook-teal rounded-full"></div>
                    <span className="text-houselook-darkGray font-medium text-sm">Professional property photos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-houselook-indigo rounded-full"></div>
                    <span className="text-houselook-darkGray font-medium text-sm">Large audience reach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-houselook-success rounded-full"></div>
                    <span className="text-houselook-darkGray font-medium text-sm">Verified listings only</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-soft-xl bg-houselook-white rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-houselook-black to-houselook-darkGray text-houselook-white rounded-t-2xl">
                <CardTitle className="text-2xl font-black font-heading"> Quick Property Listing Form</CardTitle>
                <p className="text-houselook-white/80 font-medium">
                  Fill out your details and we'll contact you within one hour
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-bold text-houselook-black">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      className="border-2 border-houselook-coolGray/30 focus:border-houselook-cyan rounded-lg p-4 font-medium text-houselook-black placeholder:text-houselook-coolGray"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-base font-bold text-houselook-black">
                      Active Phone Number or Email Address *
                    </Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                      placeholder="0700123456 or your.email@example.com"
                      required
                      className="border-2 border-houselook-coolGray/30 focus:border-houselook-cyan rounded-lg p-4 font-medium text-houselook-black placeholder:text-houselook-coolGray"
                    />
                    <p className="text-sm text-houselook-coolGray">We'll use this to contact you within one hour</p>
                  </div>

                  <div className="bg-houselook-aliceblue rounded-xl p-6">
                    <h3 className="font-bold text-houselook-black mb-3">📞 What happens next?</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-houselook-cyan text-houselook-black rounded-full flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <span className="text-houselook-darkGray font-medium text-sm">
                          We contact you within 1 hour
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-houselook-teal text-houselook-white rounded-full flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <span className="text-houselook-darkGray font-medium text-sm">
                          Schedule property visit & photos
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-houselook-indigo text-houselook-white rounded-full flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <span className="text-houselook-darkGray font-medium text-sm">Your property goes live</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-houselook-cyan hover:bg-houselook-teal text-houselook-black font-black text-lg py-4 rounded-lg shadow-soft hover:shadow-cyan-glow transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-houselook-black mr-3"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-3" />
                        Submit My Details - FREE
                      </div>
                    )}
                  </Button>

                  <p className="text-center text-sm text-houselook-coolGray">
                    By submitting, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
