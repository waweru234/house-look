"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerWithEmail, loginWithGoogle } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Chrome, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; api?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) {
      newErrors.name = "Name is required."
    }
    if (!email) {
      newErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid."
    }
    if (!password) {
      newErrors.password = "Password is required."
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    }
    return newErrors
  }

  const handleBlur = (field: "name" | "email" | "password") => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]

      switch (field) {
        case "name":
          if (!name.trim()) newErrors.name = "Name is required."
          break
        case "email":
          if (!email) newErrors.email = "Email is required."
          else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email address is invalid."
          break
        case "password":
          if (!password) newErrors.password = "Password is required."
          else if (password.length < 6) newErrors.password = "Password must be at least 6 characters."
          break
      }
      return newErrors
    })
  }

  const handleFocus = (field: "name" | "email" | "password") => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setIsLoading(true)
    try {
      await registerWithEmail(name, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      setErrors({ api: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google Sign-In failed:", error)
      setErrors({ api: error.message || "Google Sign-In failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[0-9]/g, "")
    setName(value)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <Image src="/images/ChatGPT Image Jun 22, 2025, 12_28_16 PM.png" alt="HouseLook Logo" width={72} height={72} className="mx-auto mb-5" />
          <CardTitle className="text-2xl font-bold font-heading">Create an Account</CardTitle>
          <CardDescription>Join HouseLook to find your next home.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={() => handleBlur("name")}
              onFocus={() => handleFocus("name")}
              required
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              onFocus={() => handleFocus("email")}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                onFocus={() => handleFocus("password")}
                required
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {errors.api && <p className="text-red-500 text-sm text-center">{errors.api}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
          <p className="text-center text-sm text-gray-600 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
