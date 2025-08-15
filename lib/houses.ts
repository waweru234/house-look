import { getDatabase, ref, set, get, remove, update, query, orderByChild, limitToLast, startAt, endAt, onValue, off } from "firebase/database"
import { db, app } from "./firebase"

// Ensure Firebase is initialized
if (!app) {
  throw new Error('Firebase app not initialized')
}

const SAVED_PATH = (userId: string) => `users/${userId}/saved`
const TIMESAVED_PATH = (userId: string) => `users/${userId}/timesaved`
const EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 hours in ms

export async function saveHouse(userId: string, houseId: string): Promise<void> {
  const now = Date.now()
  await update(ref(db, `users/${userId}`), {
    [`saved/${houseId}`]: true,
    [`timesaved/${houseId}`]: now,
  })
}

export async function unsaveHouse(userId: string, houseId: string): Promise<void> {
  await update(ref(db, `users/${userId}`), {
    [`saved/${houseId}`]: null,
    [`timesaved/${houseId}`]: null,
  })
}

export async function getSavedHouses(userId: string): Promise<string[]> {
  const savedSnap = await get(ref(db, SAVED_PATH(userId)))
  const timeSnap = await get(ref(db, TIMESAVED_PATH(userId)))
  const now = Date.now()
  let validIds: string[] = []
  if (savedSnap.exists() && timeSnap.exists()) {
    const saved = savedSnap.val()
    const times = timeSnap.val()
    for (const id of Object.keys(saved)) {
      if (saved[id] && times[id] && now - times[id] < EXPIRATION_MS) {
        validIds.push(id)
      } else {
        // Clean up expired
        await unsaveHouse(userId, id)
      }
    }
  }
  return validIds
}

export async function getUserProperties(userId: string): Promise<any[]> {
  const snapshot = await get(ref(db, 'property'))
  if (!snapshot.exists()) return []
  const allProps = snapshot.val()
  return Object.entries(allProps)
    .filter(([_, prop]: any) => prop.UserID === userId)
    .map(([id, prop]: any) => ({ id, ...prop }))
}

export async function getUserPoints(userId: string): Promise<number> {
  const pointsSnap = await get(ref(db, `users/${userId}/points`))
  if (pointsSnap.exists()) {
    return Number(pointsSnap.val())
  }
  return 0
}

export async function setUserPoints(userId: string, points: number): Promise<void> {
  await set(ref(db, `users/${userId}/points`), points)
}

// Enhanced Admin Statistics Functions with Real-time Support
export async function getAdminStatistics() {
  try {
    // Get all data
    const [usersSnap, propertySnap, transactionsSnap, revenueSnap] = await Promise.all([
      get(ref(db, 'users')),
      get(ref(db, 'property')),
      get(ref(db, 'transactions')),
      get(ref(db, 'revenue'))
    ])

    // Calculate basic stats
    const totalUsers = usersSnap.exists() ? Object.keys(usersSnap.val()).length : 0
    const totalProperties = propertySnap.exists() ? Object.keys(propertySnap.val()).length : 0
    
    // Calculate revenue from transactions
    let totalRevenue = 0
    if (transactionsSnap.exists()) {
      const transactions = transactionsSnap.val()
      totalRevenue = Object.values(transactions).reduce((sum: number, transaction: any) => {
        return sum + (transaction.amount || 0)
      }, 0)
    } else if (revenueSnap.exists()) {
      totalRevenue = Number(revenueSnap.val())
    }

    return {
      totalUsers,
      totalProperties,
      totalRevenue,
    }
  } catch (error) {
    console.error('Error fetching admin statistics:', error)
    return {
      totalUsers: 0,
      totalProperties: 0,
      totalRevenue: 0,
    }
  }
}

// Real-time listener for admin statistics
export function subscribeToAdminStats(callback: (stats: any) => void) {
  const statsRef = ref(db, 'statistics')
  
  const unsubscribe = onValue(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val())
    } else {
      // If no statistics node exists, compute from other data
      getAdminStatistics().then(callback)
    }
  }, (error) => {
    console.error('Error listening to admin stats:', error)
    // Fallback to computed stats
    getAdminStatistics().then(callback)
  })
  
  return unsubscribe
}

// Get detailed user analytics
export async function getUserAnalytics() {
  try {
    const usersSnap = await get(ref(db, 'users'))
    
    if (!usersSnap.exists()) {
      return {
        userTypes: [],
        registrationTrends: [],
        topUsers: []
      }
    }

    const users = usersSnap.val()
    const userEntries = Object.entries(users)
    
    // User type distribution
    const userTypes = {
      'Property Owners': 0,
      'Tenants': 0,
      'Agents': 0,
      'Inactive': 0
    }

    // Registration trends (last 12 months)
    const now = new Date()
    const registrationTrends = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        users: 0,
        revenue: 0
      }
    }).reverse()

    // Top users by points
    const topUsers = userEntries
      .map(([id, user]: [string, any]) => ({
        id,
        name: user.name || user.email || 'Unknown User',
        email: user.email || '',
        points: user.points || 0,
        properties: 0, // Will be calculated separately
        joined: user.createdAt || user.joinedAt || 'Unknown',
        status: user.points > 300 ? 'Premium' : 'Active'
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)

    // Calculate user types and registration trends
    userEntries.forEach(([id, user]: [string, any]) => {
      const joinDate = user.createdAt || user.joinedAt
      if (joinDate) {
        const joinMonth = new Date(joinDate).getMonth()
        const currentMonth = now.getMonth()
        const monthIndex = currentMonth - joinMonth
        if (monthIndex >= 0 && monthIndex < 12) {
          registrationTrends[monthIndex].users++
        }
      }

      // Determine user type based on properties and activity
      if (user.role === 'agent' || user.userType === 'agent') {
        userTypes['Agents']++
      } else if (user.properties && Object.keys(user.properties).length > 0) {
        userTypes['Property Owners']++
      } else if (user.saved && Object.keys(user.saved).length > 0) {
        userTypes['Tenants']++
      } else {
        userTypes['Inactive']++
      }
    })

    return {
      userTypes: Object.entries(userTypes).map(([name, value]) => ({ name, value })),
      registrationTrends,
      topUsers
    }
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return {
      userTypes: [],
      registrationTrends: [],
      topUsers: []
    }
  }
}

// Get property analytics
export async function getPropertyAnalytics() {
  try {
    const propertySnap = await get(ref(db, 'property'))
    
    if (!propertySnap.exists()) {
      return {
        propertyTypes: [],
        locationDistribution: [],
        priceRanges: []
      }
    }

    const properties = propertySnap.val()
    const propertyEntries = Object.entries(properties)
    
    // Property type distribution
    const propertyTypes: { [key: string]: number } = {}
    const locationDistribution: { [key: string]: number } = {}
    const priceRanges = {
      'Under 50K': 0,
      '50K - 100K': 0,
      '100K - 200K': 0,
      '200K - 500K': 0,
      'Over 500K': 0
    }

    propertyEntries.forEach(([id, property]: [string, any]) => {
      // Property types
      const type = property.type || property.propertyType || 'Unknown'
      propertyTypes[type] = (propertyTypes[type] || 0) + 1

      // Location distribution
      const location = property.location || property.area || 'Unknown'
      locationDistribution[location] = (locationDistribution[location] || 0) + 1

      // Price ranges
      const price = Number(property.price) || 0
      if (price < 50000) priceRanges['Under 50K']++
      else if (price < 100000) priceRanges['50K - 100K']++
      else if (price < 200000) priceRanges['100K - 200K']++
      else if (price < 500000) priceRanges['200K - 500K']++
      else priceRanges['Over 500K']++
    })

    return {
      propertyTypes: Object.entries(propertyTypes).map(([name, value]) => ({ name, value })),
      locationDistribution: Object.entries(locationDistribution).map(([name, value]) => ({ name, value })),
      priceRanges: Object.entries(priceRanges).map(([name, value]) => ({ name, value }))
    }
  } catch (error) {
    console.error('Error fetching property analytics:', error)
    return {
      propertyTypes: [],
      locationDistribution: [],
      priceRanges: []
    }
  }
}

// Get revenue analytics
export async function getRevenueAnalytics() {
  try {
    const transactionsSnap = await get(ref(db, 'transactions'))
    
    if (!transactionsSnap.exists()) {
      return {
        monthlyRevenue: [],
        revenueLevels: [],
        transactionTypes: []
      }
    }

    const transactions = transactionsSnap.val()
    const transactionEntries = Object.entries(transactions)
    
    // Monthly revenue (last 12 months)
    const now = new Date()
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue: 0,
        transactions: 0
      }
    }).reverse()

    // Revenue levels for gamification
    const revenueLevels = [
      { period: "Last 30 Days", amount: 0, growth: 0, level: "Bronze", streak: 0 },
      { period: "Last 3 Months", amount: 0, growth: 0, level: "Silver", streak: 0 },
      { period: "Last 6 Months", amount: 0, growth: 0, level: "Gold", streak: 0 },
      { period: "Last Year", amount: 0, growth: 0, level: "Diamond", streak: 0 }
    ]

    // Transaction types
    const transactionTypes: { [key: string]: number } = {}

    transactionEntries.forEach(([id, transaction]: [string, any]) => {
      const amount = Number(transaction.amount) || 0
      const date = new Date(transaction.timestamp || transaction.date || Date.now())
      const monthIndex = now.getMonth() - date.getMonth()
      
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyRevenue[monthIndex].revenue += amount
        monthlyRevenue[monthIndex].transactions++
      }

      // Transaction type
      const type = transaction.type || transaction.paymentType || 'Unknown'
      transactionTypes[type] = (transactionTypes[type] || 0) + 1
    })

    // Calculate revenue levels
    const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0)
    const last30Days = monthlyRevenue.slice(-1)[0]?.revenue || 0
    const last3Months = monthlyRevenue.slice(-3).reduce((sum, month) => sum + month.revenue, 0)
    const last6Months = monthlyRevenue.slice(-6).reduce((sum, month) => sum + month.revenue, 0)
    const lastYear = totalRevenue

    revenueLevels[0].amount = last30Days
    revenueLevels[1].amount = last3Months
    revenueLevels[2].amount = last6Months
    revenueLevels[3].amount = lastYear

    // Calculate growth percentages (mock for now)
    revenueLevels[0].growth = 12.5
    revenueLevels[1].growth = 18.3
    revenueLevels[2].growth = 24.7
    revenueLevels[3].growth = 31.2

    return {
      monthlyRevenue,
      revenueLevels,
      transactionTypes: Object.entries(transactionTypes).map(([name, value]) => ({ name, value }))
    }
  } catch (error) {
    console.error('Error fetching revenue analytics:', error)
    return {
      monthlyRevenue: [],
      revenueLevels: [],
      transactionTypes: []
    }
  }
}

// Get real-time statistics
export async function getRealTimeStats() {
  try {
    // Get active sessions (users who have been active in the last 30 minutes)
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
    const activeUsersQuery = query(
      ref(db, 'users'),
      orderByChild('lastActive'),
      startAt(thirtyMinutesAgo)
    )
    
    const activeUsersSnap = await get(activeUsersQuery)
    const activeSessions = activeUsersSnap.exists() ? Object.keys(activeUsersSnap.val()).length : 0

    return {
      activeSessions,
      currentTime: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching real-time stats:', error)
    return {
      activeSessions: 0,
      currentTime: new Date().toISOString()
    }
  }
}

// Real-time listener for active sessions
export function subscribeToActiveSessions(callback: (stats: any) => void) {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
  const activeUsersQuery = query(
    ref(db, 'users'),
    orderByChild('lastActive'),
    startAt(thirtyMinutesAgo)
  )
  
  const unsubscribe = onValue(activeUsersQuery, (snapshot) => {
    const activeSessions = snapshot.exists() ? Object.keys(snapshot.val()).length : 0
    callback({
      activeSessions,
      currentTime: new Date().toISOString()
    })
  }, (error) => {
    console.error('Error listening to active sessions:', error)
    callback({
      activeSessions: 0,
      currentTime: new Date().toISOString()
    })
  })
  
  return unsubscribe
}

// Export data for reports
export async function exportData(type: 'users' | 'properties' | 'transactions' | 'revenue') {
  try {
    switch (type) {
      case 'users':
        const usersSnap = await get(ref(db, 'users'))
        return usersSnap.exists() ? Object.entries(usersSnap.val()) : []
      
      case 'properties':
        const propertiesSnap = await get(ref(db, 'property'))
        return propertiesSnap.exists() ? Object.entries(propertiesSnap.val()) : []
      
      case 'transactions':
        const transactionsSnap = await get(ref(db, 'transactions'))
        return transactionsSnap.exists() ? Object.entries(transactionsSnap.val()) : []
      
      case 'revenue':
        const revenueSnap = await get(ref(db, 'revenue'))
        return revenueSnap.exists() ? Object.entries(revenueSnap.val()) : []
      
      default:
        return []
    }
  } catch (error) {
    console.error(`Error exporting ${type} data:`, error)
    return []
  }
}

// Save transaction data for admin tracking
export async function saveTransaction(transactionData: {
  userId: string
  amount: number
  type: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  reference?: string
}): Promise<void> {
  const transactionId = `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await set(ref(db, `transactions/${transactionId}`), {
    ...transactionData,
    timestamp: Date.now(),
    date: new Date().toISOString(),
    id: transactionId
  })
}

// Update user's last active time
export async function updateUserActivity(userId: string): Promise<void> {
  await update(ref(db, `users/${userId}`), {
    lastActive: Date.now()
  })
}

// Get user's property count
export async function getUserPropertyCount(userId: string): Promise<number> {
  const properties = await getUserProperties(userId)
  return properties.length
} 