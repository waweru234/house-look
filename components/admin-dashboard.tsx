"use client"

import React, { useState, useEffect } from "react"
import {
  Users,
  TrendingUp,
  DollarSign,
  Home,
  Download,
  PieChartIcon as PieIcon,
  Search,
  Coins,
  Activity,
  Star,
  Zap,
  Crown,
  Shield,
  Trophy,
  Target,
  Flame,
  Award,
  Rocket,
  Eye,
  Edit,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
} from "recharts"
import { 
  getAdminStatistics, 
  getUserAnalytics, 
  getPropertyAnalytics, 
  getRevenueAnalytics, 
  getRealTimeStats,
  exportData,
  subscribeToAdminStats,
  subscribeToActiveSessions
} from "@/lib/houses"

// Color schemes for charts
const CHART_COLORS = {
  primary: "#00FFFF",
  secondary: "#008B8B", 
  tertiary: "#6F00FF",
  quaternary: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6"
}

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  
  // Real data states
  const [stats, setStats] = useState<{ totalUsers: number; totalProperties: number; totalRevenue: number; activeUsers: number; averagePrice: number } | null>(null)
  const [userAnalytics, setUserAnalytics] = useState<any>(null)
  const [propertyAnalytics, setPropertyAnalytics] = useState<any>(null)
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null)
  const [realTimeStats, setRealTimeStats] = useState<any>(null)
  const [propertyRequests, setPropertyRequests] = useState<any[]>([])
  // Availability stats
  const [availabilityStats, setAvailabilityStats] = useState<{ available: number; full: number; total: number }>({ available: 0, full: 0, total: 0 })
  // Property growth (last 12 months)
  const [propertyGrowth, setPropertyGrowth] = useState<Array<{ month: string; properties: number }>>([])
  // Price ranges from rent
  const [priceRanges, setPriceRanges] = useState<Array<{ name: string; value: number }>>([])
  // Location distribution based on town
  const [locationDistribution, setLocationDistribution] = useState<Array<{ name: string; value: number }>>([])
  // XP calculation
  const [xpStats, setXpStats] = useState<{ totalXp: number; revenueXp: number; listingXp: number }>({ totalXp: 0, revenueXp: 0, listingXp: 0 })
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Derived: Month-over-month user growth based on createdAt (registrationTrends)
  const userMoMGrowth = (() => {
    try {
      const series = Array.isArray(userAnalytics?.registrationTrends) ? userAnalytics.registrationTrends : []
      if (series.length < 2) return 0
      const last = Number(series[series.length - 1]?.users || 0)
      const prev = Number(series[series.length - 2]?.users || 0)
      if (prev > 0) return ((last - prev) / prev) * 100
      if (prev === 0 && last > 0) return 100
      return 0
    } catch {
      return 0
    }
  })()

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadAllData = async () => {
      setLoadingStats(true)
      setLoadingAnalytics(true)
      
      try {
        // Load all data in parallel
        const [statsData, userData, propertyData, revenueData, realTimeData] = await Promise.all([
          getAdminStatistics(),
          getUserAnalytics(),
          getPropertyAnalytics(),
          getRevenueAnalytics(),
          getRealTimeStats()
        ])

        setStats(statsData)
        setUserAnalytics(userData)
        setPropertyAnalytics(propertyData)
        setRevenueAnalytics(revenueData)
        setRealTimeStats(realTimeData)
        setError(null) // Clear any previous errors
      } catch (error) {
        console.error('Error loading admin data:', error)
        setError('Failed to load dashboard data. Please check your Firebase connection and refresh the page.')
      } finally {
        setLoadingStats(false)
        setLoadingAnalytics(false)
      }
    }

    // Initial load
    loadAllData()
    loadPropertyRequests()
    loadAvailability()
    loadPropertyGrowth()
    loadPriceRanges()
    loadLocationDistribution()
    loadActiveUsers()
    calculateXP()
    
    // Set up real-time listeners with error handling
    let unsubscribeStats: (() => void) | null = null
    let unsubscribeActiveSessions: (() => void) | null = null
    
    try {
      unsubscribeStats = subscribeToAdminStats((statsData) => {
        setStats(statsData)
      })
      
      unsubscribeActiveSessions = subscribeToActiveSessions((realTimeData) => {
        setRealTimeStats(realTimeData)
      })
    } catch (error) {
      console.error('Error setting up real-time listeners:', error)
      setError('Failed to connect to real-time data. Some features may not work properly.')
    }
    
    // Refresh analytics data every 5 minutes
    const refreshInterval = setInterval(() => {
      Promise.all([
        getUserAnalytics(),
        getPropertyAnalytics(),
        getRevenueAnalytics()
      ]).then(([userData, propertyData, revenueData]) => {
        setUserAnalytics(userData)
        setPropertyAnalytics(propertyData)
        setRevenueAnalytics(revenueData)
        loadAvailability()
        loadPropertyGrowth()
        loadPriceRanges()
        loadLocationDistribution()
        loadActiveUsers()
        calculateXP()
      }).catch(error => {
        console.error('Error refreshing analytics data:', error)
      })
    }, 5 * 60 * 1000)
    
    return () => {
      if (unsubscribeStats) unsubscribeStats()
      if (unsubscribeActiveSessions) unsubscribeActiveSessions()
      clearInterval(refreshInterval)
    }
  }, [])

  const loadAvailability = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const propsRef = ref(db, 'property')
      const snap = await get(propsRef)
      if (snap.exists()) {
        const values = Object.values(snap.val() as Record<string, any>)
        const available = values.reduce((n, p: any) => n + (p && p.available === true ? 1 : 0), 0)
        const total = values.length
        const full = total - available
        setAvailabilityStats({ available, full, total })
      } else {
        setAvailabilityStats({ available: 0, full: 0, total: 0 })
      }
    } catch (e) {
      console.error('Error loading availability stats:', e)
    }
  }

  const loadPropertyGrowth = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const propsRef = ref(db, 'property')
      const snap = await get(propsRef)
      const now = new Date()
      // Build last 12 months buckets
      const months: Array<{ key: string; month: string; properties: number }> = []
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        months.push({ key, month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), properties: 0 })
      }
      const keyToIdx = months.reduce((acc, m, idx) => { acc[m.key] = idx; return acc }, {} as Record<string, number>)
      if (snap.exists()) {
        const values = Object.values(snap.val() as Record<string, any>)
        values.forEach((p: any) => {
          const createdAt = p?.createdAt
          if (!createdAt) return
          const cd = new Date(createdAt)
          if (isNaN(cd.getTime())) return
          const key = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}`
          const idx = keyToIdx[key]
          if (idx !== undefined) months[idx].properties += 1
        })
      }
      setPropertyGrowth(months.map(m => ({ month: m.month, properties: m.properties })))
    } catch (e) {
      console.error('Error loading property growth:', e)
      setPropertyGrowth([])
    }
  }

  const loadPriceRanges = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const propsRef = ref(db, 'property')
      const snap = await get(propsRef)
      const buckets = {
        'Under 5K': 0,
        '5K - 10K': 0,
        '10K - 20K': 0,
        'Over 20K': 0,
      } as Record<string, number>
      if (snap.exists()) {
        const values = Object.values(snap.val() as Record<string, any>)
        values.forEach((p: any) => {
          // Convert rent to number, handling both string and number types
          let rent = 0
          if (typeof p?.rent === 'string') {
            // Remove any non-numeric characters except decimal point
            const cleanRent = p.rent.replace(/[^\d.]/g, '')
            rent = parseFloat(cleanRent) || 0
          } else if (typeof p?.rent === 'number') {
            rent = p.rent
          }
          
          if (rent < 5000) buckets['Under 5K']++
          else if (rent < 10000) buckets['5K - 10K']++
          else if (rent <= 20000) buckets['10K - 20K']++
          else buckets['Over 20K']++
        })
      }
      setPriceRanges(Object.entries(buckets).map(([name, value]) => ({ name, value })))
    } catch (e) {
      console.error('Error loading price ranges:', e)
      setPriceRanges([])
    }
  }

  const loadLocationDistribution = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const propsRef = ref(db, 'property')
      const snap = await get(propsRef)
      
      const locationCounts: Record<string, number> = {}
      
      if (snap.exists()) {
        const values = Object.values(snap.val() as Record<string, any>)
        values.forEach((p: any) => {
          const town = p?.town || p?.city || 'Unknown'
          locationCounts[town] = (locationCounts[town] || 0) + 1
        })
      }
      
      const distribution = Object.entries(locationCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) // Top 10 locations
      
      setLocationDistribution(distribution)
    } catch (e) {
      console.error('Error loading location distribution:', e)
      setLocationDistribution([])
    }
  }

  const loadActiveUsers = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const usersRef = ref(db, 'users')
      const snap = await get(usersRef)
      
      let activeUsers = 0
      if (snap.exists()) {
        const users = Object.values(snap.val() as Record<string, any>)
        // Consider users active if they have logged in within the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        activeUsers = users.filter((user: any) => {
          if (user.lastLoginAt) {
            const lastLogin = new Date(user.lastLoginAt)
            return lastLogin > thirtyDaysAgo
          }
          // If no lastLoginAt, consider them active if they were created recently
          if (user.createdAt) {
            const createdAt = new Date(user.createdAt)
            return createdAt > thirtyDaysAgo
          }
          return false
        }).length
      }
      
      // Update stats with active users
      setStats(prev => prev ? { ...prev, activeUsers } : null)
    } catch (e) {
      console.error('Error loading active users:', e)
    }
  }

  const calculateXP = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      
      // Get properties for listing XP
      const propsRef = ref(db, 'property')
      const propsSnap = await get(propsRef)
      
      let totalRent = 0
      let activeListings = 0
      
      if (propsSnap.exists()) {
        const properties = Object.values(propsSnap.val() as Record<string, any>)
        properties.forEach((p: any) => {
          // Convert rent to number
          let rent = 0
          if (typeof p?.rent === 'string') {
            const cleanRent = p.rent.replace(/[^\d.]/g, '')
            rent = parseFloat(cleanRent) || 0
          } else if (typeof p?.rent === 'number') {
            rent = p.rent
          }
          
          totalRent += rent
          if (p?.available === true || p?.status === 'available') {
            activeListings++
          }
        })
      }
      
      // Calculate XP based on revenue and active listings
      const revenueXp = Math.floor(totalRent / 1000) // 1 XP per 1000 KES
      const listingXp = activeListings * 10 // 10 XP per active listing
      const totalXp = revenueXp + listingXp
      
      setXpStats({ totalXp, revenueXp, listingXp })
      
      // Calculate average price
      const totalProperties = propsSnap.exists() ? Object.keys(propsSnap.val()).length : 0
      const averagePrice = totalProperties > 0 ? totalRent / totalProperties : 0
      
      // Update stats with average price
      setStats(prev => prev ? { ...prev, averagePrice } : null)
      
    } catch (e) {
      console.error('Error calculating XP:', e)
    }
  }

  const downloadReport = async (type: string) => {
    try {
      const data = await exportData(type as 'users' | 'properties' | 'transactions' | 'revenue')
      const csvContent = "data:text/csv;charset=utf-8," + convertToCSV(data)

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `houselook_${type}_report_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download report. Please try again.')
    }
  }

  const filteredMembers = userAnalytics?.topUsers?.filter(
    (member: any) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || []

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronze":
        return "from-amber-600 to-yellow-600"
      case "Silver":
        return "from-gray-400 to-gray-600"
      case "Gold":
        return "from-yellow-400 to-yellow-600"
      case "Diamond":
        return "from-blue-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Bronze":
        return Trophy
      case "Silver":
        return Award
      case "Gold":
        return Crown
      case "Diamond":
        return Rocket
      default:
        return Star
    }
  }

  // Achievements based on real data
  const getAchievements = () => {
    const achievements = []
    
    if (xpStats.totalXp >= 1000) {
      achievements.push({
        title: "XP Master",
        description: `Earned ${xpStats.totalXp.toLocaleString()} total XP`,
        icon: Star,
        color: "from-yellow-400 to-orange-500",
      })
    }
    
    if (stats?.activeUsers && stats.activeUsers >= 100) {
      achievements.push({
        title: "Active Community",
        description: `${stats.activeUsers}+ active users (30 days)`,
        icon: Users,
        color: "from-purple-500 to-indigo-600",
      })
    }
    
    if (availabilityStats.available >= 50) {
      achievements.push({
        title: "Property Empire",
        description: `${availabilityStats.available}+ active listings`,
        icon: Home,
        color: "from-green-400 to-cyan-500"
      })
    }
    
    if (stats?.averagePrice && stats.averagePrice >= 15000) {
      achievements.push({
        title: "Premium Market",
        description: `KES ${Math.round(stats.averagePrice).toLocaleString()} average price`,
        icon: DollarSign,
        color: "from-red-500 to-pink-500",
      })
    }
    
    return achievements
  }

  function convertToCSV(data: any[]) {
    if (data.length === 0) {
      return ""
    }
    const keys = Object.keys(data[0])
    const header = keys.join(",")
    const rows = data.map((row) => {
      return keys
        .map((key) => {
          let value = row[key]
          if (typeof value === "string" && value.includes(",")) {
            value = `"${value}"`
          }
          return value
        })
        .join(",")
    })
    return [header, ...rows].join("\n")
  }

  // Load transaction history and analytics
  const loadTransactionHistory = async (userId: string) => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const transactionsRef = ref(db, 'transactions')
      const snapshot = await get(transactionsRef)
      
      if (snapshot.exists()) {
        const allTransactions = Object.values(snapshot.val())
        const userTransactions = allTransactions.filter((t: any) => t.userId === userId)
        
        // setTransactions(userTransactions) // This state is not defined in the original file
        
        // Calculate analytics
        const completedTransactions = userTransactions.filter((t: any) => t.status === 'completed')
        const totalSpentAmount = completedTransactions.reduce((sum: number, t: any) => sum + t.amount, 0)
        const totalPoints = completedTransactions.reduce((sum: number, t: any) => sum + t.points, 0)
        
        // setTotalSpent(totalSpentAmount) // This state is not defined in the original file
        // setTotalPointsEarned(totalPoints) // This state is not defined in the original file
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  // Load property requests
  const loadPropertyRequests = async () => {
    try {
      const { getDatabase, ref, get } = await import('firebase/database')
      const db = getDatabase()
      const requestsRef = ref(db, 'propertyRequests')
      const snapshot = await get(requestsRef)
      
      if (snapshot.exists()) {
        const requests = Object.values(snapshot.val())
        setPropertyRequests(requests)
      } else {
        setPropertyRequests([])
      }
    } catch (error) {
      console.error('Error loading property requests:', error)
    } finally {
      setLoadingRequests(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-houselook-cyan/10 to-houselook-indigo/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-houselook-indigo/10 to-houselook-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-houselook-teal/5 to-houselook-cyan/5 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-houselook-cyan via-houselook-teal to-houselook-indigo text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-10 right-1/3 w-3 h-3 bg-white/25 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-lg opacity-90 font-light">
                    Welcome back! Here's what's happening with{" "}
                    <span className="font-semibold text-yellow-300">HouseLook</span> today.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-w-[200px]">
                <div className="text-center">
                  <p className="text-sm opacity-80 mb-1">Current Time</p>
                  <p className="text-2xl font-bold">{currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}</p>
                  <p className="text-sm opacity-80">{currentTime ? currentTime.toLocaleDateString() : '--/--/----'}</p>
                </div>
              </div>
              
              <button
                onClick={() => window.open('/dashboard', '_self')}
                className="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold shadow-xl"
                title="Go to My Personal Dashboard"
              >
                <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <span>Go to My Dashboard</span>
                <div className="bg-white/20 p-1 rounded-lg group-hover:animate-pulse">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-red-800 font-semibold">Connection Error</h4>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {(loadingStats || loadingAnalytics) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-houselook-cyan"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Loading Dashboard</h3>
                  <p className="text-gray-600">Connecting to Firebase...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 -mt-16 relative z-10">
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-houselook-cyan to-houselook-teal p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {userMoMGrowth.toFixed(1)}%
                </div>
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Total Users</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">
                {loadingStats ? '...' : stats?.totalUsers?.toLocaleString() ?? 0}
              </p>
              <p className="text-xs text-houselook-coolgray">↗ MoM growth (createdAt)</p>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-houselook-indigo to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +8.3%
                </div>
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Properties Listed</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">
                {loadingStats ? '...' : stats?.totalProperties?.toLocaleString() ?? 0}
              </p>
              <p className="text-xs text-houselook-coolgray">↗ New listings</p>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-green-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +18.7%
                </div>
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">
                KES {loadingStats ? '...' : (stats?.totalRevenue?.toLocaleString() ?? 0)}
              </p>
              <p className="text-xs text-houselook-coolgray">↗ Revenue growth</p>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-orange-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Live
                </div>
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Active Sessions</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">
                {realTimeStats?.activeSessions ?? 0}
              </p>
              <p className="text-xs text-houselook-coolgray">⚡ Real-time users</p>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  30 Days
                </div>
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Active Users</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">
                {stats?.activeUsers ?? 0}
              </p>
              <p className="text-xs text-houselook-coolgray">↗ Last 30 days</p>
            </div>
          </div>
        </div>

        {/* Availability Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-green-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Available Properties</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">{availabilityStats.available}</p>
              <p className="text-xs text-houselook-coolgray">Out of {availabilityStats.total} total</p>
            </div>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-red-50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-houselook-coolgray text-sm font-medium mb-1">Full / Occupied</p>
              <p className="text-4xl font-black text-houselook-darkgray mb-2">{availabilityStats.full}</p>
              <p className="text-xs text-houselook-coolgray">Out of {availabilityStats.total} total</p>
            </div>
          </div>
        </div>

        {/* XP System Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 shadow-2xl border border-purple-800 hover:shadow-3xl transition-all duration-300 mb-8 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-spin-slow"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">🎮 XP System</h3>
                    <p className="text-gray-300">Earn XP through revenue and active listings!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Revenue XP</p>
                    <p className="text-2xl font-bold text-white">{xpStats.revenueXp.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">1 XP per 1,000 KES revenue</p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Listing XP</p>
                    <p className="text-2xl font-bold text-white">{xpStats.listingXp.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">10 XP per active listing</p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total XP</p>
                    <p className="text-2xl font-bold text-white">{xpStats.totalXp.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">Combined XP score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getAchievements().map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-3xl p-6 shadow-2xl border border-gray-800 hover:shadow-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div
                    className={`bg-gradient-to-r ${achievement.color} p-3 rounded-2xl w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{achievement.title}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-semibold">UNLOCKED</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Registration Trends */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Registration Trends</h3>
                <p className="text-houselook-coolgray">User growth over time</p>
              </div>
              <button
                onClick={() => downloadReport("users")}
                className="group flex items-center gap-3 bg-gradient-to-r from-houselook-cyan to-houselook-teal text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-semibold">Download</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={userAnalytics?.registrationTrends?.length > 0 ? userAnalytics.registrationTrends : [
                { month: 'Jan', users: 0 },
                { month: 'Feb', users: 0 },
                { month: 'Mar', users: 0 },
                { month: 'Apr', users: 0 },
                { month: 'May', users: 0 },
                { month: 'Jun', users: 0 }
              ]}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={CHART_COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Property Growth Over Time */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Property Growth</h3>
                <p className="text-houselook-coolgray">New properties per month</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={propertyGrowth.length > 0 ? propertyGrowth : [
                { month: 'Jan', properties: 0 },
                { month: 'Feb', properties: 0 },
                { month: 'Mar', properties: 0 },
                { month: 'Apr', properties: 0 },
                { month: 'May', properties: 0 },
                { month: 'Jun', properties: 0 }
              ]}>
                <defs>
                  <linearGradient id="colorProps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="properties"
                  stroke={CHART_COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorProps)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Types Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">User Distribution</h3>
                <p className="text-houselook-coolgray">User types breakdown</p>
              </div>
              <div className="bg-gradient-to-r from-houselook-indigo to-purple-600 p-3 rounded-2xl">
                <PieIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={userAnalytics?.userTypes?.length > 0 ? userAnalytics.userTypes : [
                    { name: 'No Data', value: 1 }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => name === 'No Data' ? 'No Data Available' : `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(userAnalytics?.userTypes?.length > 0 ? userAnalytics.userTypes : [{ name: 'No Data', value: 1 }]).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'No Data' ? '#e5e7eb' : Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Property Types Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Property Types</h3>
                <p className="text-houselook-coolgray">Property type distribution</p>
              </div>
              <button
                onClick={() => downloadReport("properties")}
                className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-semibold">Download</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={propertyAnalytics?.propertyTypes || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(propertyAnalytics?.propertyTypes || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Property Price Ranges */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Price Ranges</h3>
                <p className="text-houselook-coolgray">Property price distribution (by rent)</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={priceRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Bar dataKey="value" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gamified Revenue Analytics */}
        <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800 hover:shadow-3xl transition-all duration-300 mb-8 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-lg animate-spin-slow"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">🎮 Revenue Quest</h3>
                    <p className="text-gray-400">Level up your business performance!</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => downloadReport("revenue")}
                className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-bold"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Download Quest Report</span>
              </button>
            </div>

            {/* Gamified Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(revenueAnalytics?.revenueLevels || []).map((item: any, index: number) => {
                const LevelIcon = getLevelIcon(item.level)
                return (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  >
                    {/* Level Badge */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`bg-gradient-to-r ${getLevelColor(item.level)} px-3 py-1 rounded-full flex items-center gap-2`}
                      >
                        <LevelIcon className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold">{item.level}</span>
                      </div>
                    </div>

                    {/* Streak Counter */}
                    <div className="flex items-center gap-2 mb-4">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-orange-500 font-bold text-sm">{item.streak || 0} Week Streak!</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-400 text-sm font-medium mb-1">{item.period}</p>
                      <p className="text-3xl font-black text-white mb-2">KES {item.amount?.toLocaleString() || 0}</p>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs">XP Progress</span>
                        <span className="text-cyan-400 text-xs font-bold">+{item.growth || 0}% XP</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min((item.growth || 0) * 3, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Achievement Points */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">Goal Achieved!</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-bold text-sm">{Math.floor((item.amount || 0) / 1000)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Dark Themed Revenue Chart */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Revenue Rocket 🚀</h4>
                    <p className="text-gray-400 text-sm">Your financial journey to the moon!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Total Score</p>
                  <p className="text-2xl font-bold text-cyan-400">{xpStats.totalXp.toLocaleString()} XP</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueAnalytics?.monthlyRevenue || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="darkRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                      <stop offset="30%" stopColor="#EC4899" stopOpacity={0.9} />
                      <stop offset="70%" stopColor="#06B6D4" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="darkRevenueHover" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C084FC" stopOpacity={1} />
                      <stop offset="30%" stopColor="#F472B6" stopOpacity={0.9} />
                      <stop offset="70%" stopColor="#22D3EE" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0.7} />
                    </linearGradient>
                    {/* Glow effect */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
                  <XAxis dataKey="month" stroke="#D1D5DB" fontSize={14} fontWeight="bold" tick={{ fill: "#D1D5DB" }} />
                  <YAxis
                    stroke="#D1D5DB"
                    fontSize={12}
                    tick={{ fill: "#D1D5DB" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "2px solid #6366F1",
                      borderRadius: "16px",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)",
                      backdropFilter: "blur(16px)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    formatter={(value) => [
                      <span key="revenue-value" style={{ color: "#22D3EE", fontSize: "16px", fontWeight: "bold" }}>
                        KES {value.toLocaleString()}
                      </span>,
                      "🚀 Revenue",
                    ]}
                    labelStyle={{ color: "#A855F7", fontWeight: "bold", marginBottom: "8px" }}
                    cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#darkRevenue)"
                    radius={[12, 12, 4, 4]}
                    stroke="#A855F7"
                    strokeWidth={2}
                    filter="url(#glow)"
                    className="hover:opacity-90 transition-all duration-300"
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Progress Indicators */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-green-400 font-bold text-sm">{xpStats.revenueXp.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Revenue XP</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-purple-400 font-bold text-sm">{xpStats.listingXp.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Listing XP</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-cyan-400 font-bold text-sm">{xpStats.totalXp.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Total XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Management */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Members Management</h3>
              <p className="text-houselook-coolgray">Manage and monitor user accounts</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-houselook-coolgray" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-houselook-cyan bg-white/50 backdrop-blur-sm transition-all duration-300 w-64"
                />
              </div>
              <button 
                onClick={() => downloadReport("users")}
                className="group flex items-center gap-3 bg-gradient-to-r from-houselook-cyan to-houselook-teal text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-semibold">Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-houselook-whitesmoke">
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Member</th>
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Points</th>
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Properties</th>
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Joined</th>
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-houselook-darkgray">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-houselook-whitesmoke hover:bg-gradient-to-r hover:from-houselook-aliceblue/30 hover:to-transparent transition-all duration-300 group"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-houselook-cyan to-houselook-indigo rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-houselook-darkgray group-hover:text-houselook-cyan transition-colors duration-300">
                            {member.name}
                          </p>
                          <p className="text-sm text-houselook-coolgray">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
                          <Coins className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-houselook-darkgray text-lg">{member.points}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-houselook-indigo to-purple-600 p-2 rounded-xl">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-houselook-darkgray text-lg">{member.properties}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-houselook-coolgray font-medium">
                      {new Date(member.joined).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        {member.status === "Premium" ? (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <Crown className="w-4 h-4" />
                            Premium
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <Star className="w-4 h-4" />
                            Active
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/dashboard?user=${member.id}`, '_blank')}
                          className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
                          title="View Member Dashboard"
                        >
                          <Eye className="w-4 h-4 group-hover:animate-pulse" />
                          View
                        </button>
                        <button
                          onClick={() => window.open(`/admin/edit-user/${member.id}`, '_blank')}
                          className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
                          title="Edit Member"
                        >
                          <Edit className="w-4 h-4 group-hover:animate-pulse" />
                          Edit
                        </button>
                        <button
                          onClick={() => window.open(`/houses?user=${member.id}`, '_blank')}
                          className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
                          title="View Member Properties"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:animate-pulse" />
                          Properties
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Property Management Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Property Management</h3>
              <p className="text-houselook-coolgray">Manage and monitor property listings</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <button 
                onClick={() => downloadReport("properties")}
                className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-semibold">Export Properties</span>
              </button>
              <button 
                onClick={() => window.open('/list-property', '_blank')}
                className="group flex items-center gap-3 bg-gradient-to-r from-houselook-cyan to-houselook-teal text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-semibold">Add Property</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-600 font-semibold">Total Properties</p>
                  <p className="text-2xl font-bold text-blue-800">{stats?.totalProperties || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-600 font-semibold">Active Listings</p>
                  <p className="text-2xl font-bold text-green-800">{availabilityStats.available}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-600 font-semibold">Avg Price</p>
                  <p className="text-2xl font-bold text-purple-800">KES {Math.round(stats?.averagePrice || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">Property Owners</p>
                  <p className="text-2xl font-bold text-orange-800">{userAnalytics?.userTypes?.find((type: any) => type.name === 'Property Owners')?.value || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Location Distribution */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">Location Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationDistribution.length > 0 ? locationDistribution : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Property Type Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">Property Types</h4>
              <div className="space-y-3">
                {(propertyAnalytics?.propertyTypes || []).map((type: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] }}></div>
                      <span className="font-medium text-slate-700">{type.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{type.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Property Requests Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-houselook-darkgray mb-2">Property Listing Requests</h3>
              <p className="text-houselook-coolgray">Manage incoming property listing requests</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-houselook-darkgray">{propertyRequests.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingRequests ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-houselook-cyan mx-auto mb-4"></div>
                <p className="text-houselook-coolgray">Loading property requests...</p>
              </div>
            ) : propertyRequests.length > 0 ? (
              <div className="space-y-4">
                {propertyRequests.map((request: any, index: number) => (
                  <div
                    key={request.id || index}
                    className="bg-gradient-to-r from-houselook-aliceblue/50 to-houselook-whitesmoke/50 rounded-2xl p-6 border border-houselook-coolGray/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-houselook-cyan to-houselook-indigo rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {request.fullName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h4 className="font-bold text-houselook-darkgray text-lg">{request.fullName}</h4>
                            <p className="text-sm text-houselook-coolgray">{request.contact}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-houselook-coolgray">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{request.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${request.contacted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className={request.contacted ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                              {request.contacted ? 'Contacted' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (request.contact.includes('@')) {
                              window.open(`mailto:${request.contact}?subject=HouseLook Property Listing Request`, '_blank')
                            } else {
                              window.open(`tel:${request.contact}`, '_blank')
                            }
                          }}
                          className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
                          title="Contact Property Owner"
                        >
                          {request.contact.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                          Contact
                        </button>
                        
                        <button
                          onClick={() => {
                            // Mark as contacted
                            const { getDatabase, ref, set } = require('firebase/database')
                            const db = getDatabase()
                            const requestRef = ref(db, `propertyRequests/${request.id}`)
                            set(requestRef, { ...request, contacted: true })
                            // Update local state
                            setPropertyRequests(prev => 
                              prev.map(r => r.id === request.id ? { ...r, contacted: true } : r)
                            )
                          }}
                          className={`group flex items-center gap-2 px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold ${
                            request.contacted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-500 text-white'
                          }`}
                          title={request.contacted ? 'Already Contacted' : 'Mark as Contacted'}
                        >
                          {request.contacted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {request.contacted ? 'Contacted' : 'Mark Contacted'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-houselook-coolGray/10 to-houselook-coolGray/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-houselook-coolGray" />
                </div>
                <h3 className="text-xl font-bold text-houselook-black mb-3">No Property Requests</h3>
                <p className="text-houselook-coolGray mb-6">No property listing requests have been submitted yet.</p>
                <div className="bg-gradient-to-r from-houselook-cyan/10 to-houselook-indigo/10 rounded-2xl p-4">
                  <p className="text-sm text-houselook-darkGray">
                    When users submit property listing requests through the form, they will appear here for you to review and contact.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
