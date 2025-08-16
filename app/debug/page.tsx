"use client"

import { useEffect, useState } from "react"
import { getDatabase, ref, get } from "firebase/database"
import { db } from "@/lib/firebase"
import { getCurrentUser } from "@/lib/auth"

export default function DebugPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("userData")
      
      if (isAuthenticated === "true" && userData) {
        try {
          const user = JSON.parse(userData)
          setUser(user)
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching properties from database...")
        const snapshot = await get(ref(db, "property"))
        
        if (snapshot.exists()) {
          const data = snapshot.val()
          console.log("Properties data:", data)
          
          // Convert object to array
          const propertiesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }))
          
          setProperties(propertiesArray)
        } else {
          console.log("No properties found in database")
          setError("No properties found in database")
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
        setError(`Error fetching properties: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debug information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Is Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p className="text-red-500">Not authenticated</p>
          )}
        </div>

        {/* Database Connection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          {error ? (
            <div className="text-red-500">
              <p><strong>Error:</strong> {error}</p>
            </div>
          ) : (
            <div className="text-green-500">
              <p>✅ Database connection successful</p>
              <p><strong>Total Properties:</strong> {properties.length}</p>
            </div>
          )}
        </div>

        {/* Properties List */}
        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Properties in Database</h2>
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">ID: {property.id}</h3>
                  <p><strong>Name:</strong> {property.name || 'N/A'}</p>
                  <p><strong>City:</strong> {property.city || 'N/A'}</p>
                  <p><strong>Town:</strong> {property.town || 'N/A'}</p>
                  <p><strong>Rent:</strong> {property.rent || 'N/A'}</p>
                  <p><strong>Status:</strong> {property.status || 'N/A'}</p>
                  <p><strong>Has Image1:</strong> {property.image1Url ? 'Yes' : 'No'}</p>
                  <a 
                    href={`/house/${property.id}`} 
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 