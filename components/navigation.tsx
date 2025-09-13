"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Search, Info, Plus, User, LogIn, UserPlus, Heart } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; isAdmin?: boolean } | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("userData")

      if (authStatus === "true" && userData) {
        setIsAuthenticated(true)
        try {
          const parsed = JSON.parse(userData)
          setUser(parsed)
        } catch {
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    // Initial check
    checkAuth()

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated" || e.key === "userData") {
        checkAuth()
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuth()
    }

    // Listen for both storage events and custom events
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("authStateChanged", handleAuthChange)

    // Also set up a periodic check for immediate updates
    const interval = setInterval(checkAuth, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authStateChanged", handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-sans pointer-events-none">
      {/* No background, border, or shadow - only floating content */}
      <div className="relative max-w-7xl mx-auto px-4 pointer-events-auto">
        <div className="flex justify-between items-center h-20">
          {/* Beautiful Large Logo */}
          <Link href="/" className="flex items-center space-x-3 group" style={{ pointerEvents: 'auto' }}>
            <div className="w-16 h-16 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/houselooklogo.png"
                alt="HouseLook Logo"
                width={125}
                height={125}
                className="w-16 h-16 object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-houselook-cyan to-houselook-blue bg-clip-text text-transparent group-hover:from-houselook-blue group-hover:to-houselook-cyan transition-all duration-300" style={{ fontFamily: 'Perpetua, serif' }}>
                HouseLook
              </span>
              
            </div>
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6" style={{ pointerEvents: 'auto' }}>
            <Link href="/" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }}>Home</Link>
            <Link href="/listings" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/listings") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }}>Browse</Link>
            <Link href="/saved" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/saved") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif', background: 'none', boxShadow: 'none' }}>Saved</Link>
            <Link href="/about" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/about") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif', background: 'none', boxShadow: 'none' }}>About</Link>
            {isAuthenticated ? (
              user && user.isAdmin ? (
                <Link href="/admin" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/admin") ? "text-houselook-indigo" : "text-houselook-darkGray hover:text-houselook-indigo"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }}>Admin</Link>
              ) : (
                <Link href="/dashboard" className={`font-bold px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/dashboard") ? "text-houselook-indigo" : "text-houselook-darkGray hover:text-houselook-indigo"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }}>Dashboard</Link>
              )
            ) : null}
          </div>
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3" style={{ pointerEvents: 'auto' }}>
            {isAuthenticated ? (
              user && user.isAdmin ? (
                <Link href="/list-property">
                  <Button className="bg-transparent text-houselook-indigo font-bold px-5 py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Brush Script MT, cursive', boxShadow: 'none' }}>List Property</Button>
                </Link>
              ) : null
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-houselook-cyan font-bold px-5 py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Perpetua, serif', boxShadow: 'none' }}>Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-transparent text-houselook-cyan font-bold px-5 py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Brush Script MT, cursive', boxShadow: 'none' }}>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center" style={{ pointerEvents: 'auto' }}>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-blue-600">
              {isOpen ? <X className="w-6 h-6" color="#2563eb" /> : <Menu className="w-6 h-6" color="#2563eb" />}
            </Button>
          </div>
        </div>
        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 flex flex-col items-center space-y-2 py-6 bg-white border-2 border-houselook-cyan shadow-lg rounded-lg mx-4" style={{ pointerEvents: 'auto' }}>
            <Link href="/" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/listings" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/listings") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>Browse</Link>
            <Link href="/saved" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/saved") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>Saved</Link>
            <Link href="/about" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/about") ? "text-houselook-cyan" : "text-houselook-blue hover:text-houselook-cyan"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>About</Link>
            {isAuthenticated ? (
              user && user.isAdmin ? (
                <Link href="/admin" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/admin") ? "text-houselook-indigo" : "text-houselook-darkGray hover:text-houselook-indigo"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>Admin</Link>
              ) : (
                <Link href="/dashboard" className={`font-bold px-4 py-2 rounded-lg w-full text-center ${isActive("/dashboard") ? "text-houselook-indigo" : "text-houselook-darkGray hover:text-houselook-indigo"}`} style={{ fontFamily: 'Perpetua, serif', background: 'none', boxShadow: 'none' }} onClick={() => setIsOpen(false)}>Dashboard</Link>
              )
            ) : null}
            {isAuthenticated ? (
              user && user.isAdmin ? (
                <Link href="/list-property" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-transparent text-houselook-indigo font-bold py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Brush Script MT, cursive', boxShadow: 'none' }}>List Property</Button>
                </Link>
              ) : null
            ) : (
              <>
                <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-houselook-cyan font-bold py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Perpetua, serif', boxShadow: 'none' }}>Login</Button>
                </Link>
                <Link href="/signup" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-transparent text-houselook-cyan font-bold py-2 rounded-lg transition-all duration-200" style={{ fontFamily: 'Brush Script MT, cursive', boxShadow: 'none' }}>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {/* Bottom nav for mobile - with platform background */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around py-3 bg-white border-t-2 border-houselook-cyan shadow-lg" style={{ pointerEvents: 'auto' }}>
        <Link href="/" className={`flex flex-col items-center ${isActive("/") ? "text-houselook-cyan" : "text-houselook-blue"}`} style={{ fontFamily: 'Perpetua, serif' }}><Home className="w-6 h-6" /></Link>
        <Link href="/listings" className={`flex flex-col items-center ${isActive("/listings") ? "text-houselook-cyan" : "text-houselook-blue"}`} style={{ fontFamily: 'Perpetua, serif' }}><Search className="w-6 h-6" /></Link>
        <Link href="/saved" className={`flex flex-col items-center ${isActive("/saved") ? "text-houselook-cyan" : "text-houselook-blue"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}><Heart className="w-6 h-6" /></Link>
        <Link href="/about" className={`flex flex-col items-center ${isActive("/about") ? "text-houselook-cyan" : "text-houselook-blue"}`} style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}><Info className="w-6 h-6" /></Link>
      </div>
    </nav>
  )
}
