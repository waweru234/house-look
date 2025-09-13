"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Search,
  Plus,
  Bell,
  Eye,
  Trash2,
  AlertTriangle,
  Home,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/auth"
import { getUserProperties, getSavedHouses } from "@/lib/houses"

// Beautiful Notification Component
const Notification = ({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose 
}: { 
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
}) => {
  if (!isVisible) return null

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`max-w-sm w-full p-4 rounded-2xl border shadow-lg ${colors[type]}`}>
        <div className="flex items-start gap-3">
          {icons[type]}
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">{title}</h3>
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardContent() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; uid: string } | null>(null)
  const [userProperties, setUserProperties] = useState<any[]>([])

  const [savedCount, setSavedCount] = useState(0)

  // Notification states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    isVisible: boolean
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  })

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    setNotification({ type, title, message, isVisible: true })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    // Simulate account deletion
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    localStorage.removeItem("userPoints")

    // In real app, this would delete from Firebase Auth and database
    showNotification('success', 'Account Deleted', 'Your account and all data have been permanently deleted.')
    router.push("/")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)

    // Load user data
    const userData = getCurrentUser()
    if (userData) {
      setUser(userData)
      // Fetch properties from Firebase
      getUserProperties(userData.uid).then((props) => {
        setUserProperties(props)
      })
      // Fetch saved houses count
      getSavedHouses(userData.uid).then((ids) => {
        setSavedCount(ids.length)
      })
    }
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-houselook-white to-houselook-whitesmoke pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-houselook-black mb-1 font-heading">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-sm text-houselook-darkGray">Manage your properties and track your success</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-houselook-coolGray/30 text-houselook-darkGray hover:text-houselook-cyan hover:border-houselook-cyan/50 transition-all duration-300 rounded-2xl text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-houselook-cyan to-houselook-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-houselook-black font-heading mb-2">{userProperties.length}</h3>
              <p className="text-houselook-coolGray font-medium text-sm">Properties Listed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-houselook-teal to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-houselook-black font-heading mb-2">{savedCount}</h3>
              <p className="text-houselook-coolGray font-medium text-sm">Houses Saved</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <div
          className={`mb-8 transition-all duration-1000 delay-400 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-houselook-black font-heading flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-houselook-cyan to-houselook-teal rounded-xl flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                Your Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProperties.length > 0 ? (
                <div className="space-y-4">
                  {userProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-houselook-aliceblue/50 to-houselook-whitesmoke/50 rounded-2xl border border-houselook-coolGray/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-houselook-black text-base mb-2 font-heading">{property.title || property.name || 'Untitled Property'}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-houselook-coolGray">
                          {property.dateSubmitted && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Submitted: {property.dateSubmitted}
                            </div>
                          )}
                          {property.views !== undefined && (
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {property.views} views
                            </div>
                          )}
                          {property.inquiries !== undefined && (
                            <div className="flex items-center">
                              <Bell className="w-4 h-4 mr-1" />
                              {property.inquiries} inquiries
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Badge
                          variant={property.status === "Active" ? "default" : "secondary"}
                          className={
                            property.status === "Active"
                              ? "bg-green-100 text-green-800 border-green-200 rounded-xl"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-xl"
                          }
                        >
                          {property.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-houselook-coolGray/10 to-houselook-coolGray/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Home className="w-10 h-10 text-houselook-coolGray" />
                  </div>
                  <h3 className="text-xl font-bold text-houselook-black mb-3">No Properties Listed Yet</h3>
                  <p className="text-houselook-coolGray mb-6">Start by listing your first property</p>
                  <Button
                    onClick={() => router.push("/list-property")}
                    className="bg-gradient-to-r from-houselook-cyan to-houselook-teal hover:from-houselook-cyan/90 hover:to-houselook-teal/90 text-houselook-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    List Your First Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div
          className={`mb-8 transition-all duration-1000 delay-600 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-xl font-bold text-houselook-black mb-6 font-heading">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => router.push("/list-property")}
              className="h-24 bg-gradient-to-r from-houselook-cyan to-houselook-teal hover:from-houselook-cyan/90 hover:to-houselook-teal/90 text-houselook-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl"
            >
              <div className="flex items-center">
                <Plus className="w-7 h-7 mr-3" />
                <span>List New Property</span>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/listings")}
              className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl"
            >
              <div className="flex items-center">
                <Search className="w-7 h-7 mr-3" />
                <span>Browse Properties</span>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/saved")}
              className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl"
            >
              <div className="flex items-center">
                <Heart className="w-7 h-7 mr-3" />
                <span>Saved Properties</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div
          className={`transition-all duration-1000 delay-800 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden border-l-4 border-l-houselook-error">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black text-houselook-black font-heading flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-houselook-black mb-2">Delete My Account</h3>
                  <p className="text-houselook-coolGray text-sm">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-0 shadow-2xl rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-black text-houselook-black font-heading flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        Delete Account Permanently?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-houselook-darkGray">
                        Are you sure you want to permanently delete your account and all data? This action cannot be
                        undone and will:
                        <ul className="list-disc list-inside mt-3 space-y-1">
                          <li>Delete your HouseLook account</li>
                          <li>Remove all your property listings</li>
                          <li>Delete your saved properties</li>
                          <li>Remove all your data from our system</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-houselook-coolGray text-houselook-darkGray hover:bg-houselook-aliceblue rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl"
                      >
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
