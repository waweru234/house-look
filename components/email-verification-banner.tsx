"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, AlertCircle, X } from "lucide-react"
import { getCurrentUser, resendEmailVerification } from "@/lib/auth"

export function EmailVerificationBanner() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleResendVerification = async () => {
    setIsLoading(true)
    setMessage("")
    try {
      await resendEmailVerification()
      setMessage("Verification email sent! Please check your inbox.")
    } catch (error: any) {
      setMessage(error.message || "Failed to resend verification email")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show banner if user is verified, dismissed, or not logged in
  if (!user || user.emailVerified || isDismissed) {
    return null
  }

  return (
    <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-800">
                Email Verification Required
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Please verify your email address to access all features and ensure account security.
              </p>
              {message && (
                <p className={`text-sm mt-2 ${
                  message.includes("sent") ? "text-green-600" : "text-red-600"
                }`}>
                  {message}
                </p>
              )}
              <div className="mt-3 flex space-x-2">
                <Button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Sending..." : "Resend Email"}
                </Button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-orange-400 hover:text-orange-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
