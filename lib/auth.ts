// lib/auth.ts
"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "./firebase"
import { getDatabase, ref, set, get } from "firebase/database"

export interface UserData {
  name: string
  email: string
  uid: string
  points: number
  createdAt: string
  isAdmin: boolean
  emailVerified: boolean
}

async function saveUserToDatabase(userData: UserData) {
  const db = getDatabase()
  await set(ref(db, `users/${userData.uid}`), userData)
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<UserData> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user

    await updateProfile(user, { displayName: name })
    
    // Send email verification
    await sendEmailVerification(user)

    const userData: UserData = {
      name,
      email: user.email || "",
      uid: user.uid,
      points: 100,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      emailVerified: user.emailVerified,
    }

    await saveUserToDatabase(userData)

    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
    window.dispatchEvent(new Event("authStateChanged"))

    return userData
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("An account with this email already exists.")
    } else {
      throw new Error("Failed to create an account. Please try again.")
    }
  }
}

export async function loginWithGoogle(): Promise<UserData> {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const db = getDatabase()
    const userRef = ref(db, `users/${user.uid}`)
    const snapshot = await get(userRef)

    let userData: UserData

    if (snapshot.exists()) {
      // User exists, use their data
      userData = snapshot.val()
    } else {
      // New user, create a new record
      userData = {
        name: user.displayName || "Google User",
        email: user.email || "",
        uid: user.uid,
        points: 100,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        emailVerified: user.emailVerified,
      }
      await saveUserToDatabase(userData)
    }

    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
    window.dispatchEvent(new Event("authStateChanged"))

    return userData
  } catch (error: any) {
    if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account with this email already exists. Please log in with your original method.")
    }
    throw new Error("Google Sign-In failed. Please try again.")
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  const result = await signInWithEmailAndPassword(auth, email, password)
  const user = result.user
  
  // Check if email is verified
  if (!user.emailVerified) {
    throw new Error("Please verify your email address before signing in. Check your inbox for a verification email.")
  }
  
  const db = getDatabase()
  const userRef = ref(db, `users/${user.uid}`)
  const snapshot = await get(userRef)

  if (snapshot.exists()) {
    const userData = snapshot.val()
    // Update email verification status
    userData.emailVerified = user.emailVerified
    await saveUserToDatabase(userData)
    
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
    window.dispatchEvent(new Event("authStateChanged"))
    return userData
  } else {
    // This case should ideally not happen in a login flow,
    // but as a fallback, we can create a record.
    const userData: UserData = {
      name: user.displayName || "User",
      email: user.email || "",
      uid: user.uid,
      points: 0, // Or some default, maybe not 300 for a login case
      createdAt: new Date().toISOString(),
      isAdmin: false,
      emailVerified: user.emailVerified,
    }
    await saveUserToDatabase(userData)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
    window.dispatchEvent(new Event("authStateChanged"))
    return userData
  }
}

export async function logout(): Promise<void> {
  await signOut(auth)
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userData")
  window.dispatchEvent(new Event("authStateChanged"))
}

export function getCurrentUser(): UserData | null {
  if (typeof window === "undefined") return null
  
  const userData = localStorage.getItem("userData")
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export async function resendEmailVerification(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in.")
  }
  
  if (auth.currentUser.emailVerified) {
    throw new Error("Email is already verified.")
  }
  
  await sendEmailVerification(auth.currentUser)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export function onAuthStateChange(callback: (user: UserData | null) => void) {
  if (typeof window === "undefined") return
  
  const handleAuthChange = () => {
    const user = getCurrentUser()
    callback(user)
  }
  
  window.addEventListener("authStateChanged", handleAuthChange)
  
  // Return cleanup function
  return () => {
    window.removeEventListener("authStateChanged", handleAuthChange)
  }
}
