// ============================================================
// Auth Context — Firebase Auth + Demo Mode fallback
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isDemoMode } from '@/services/firebase/config'
import type { User, UserRole } from '@/types/user.types'
import { DEMO_CREDENTIALS, DEMO_USERS } from '@/data/demoData'

interface AuthContextValue {
  currentUser: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      // Load demo user from localStorage
      const stored = localStorage.getItem('cogniva_demo_user')
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored))
        } catch {
          localStorage.removeItem('cogniva_demo_user')
        }
      }
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setCurrentUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              role: data.role,
              displayName: data.displayName || fbUser.displayName || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              lastLogin: new Date(),
              linkedProfiles: data.linkedProfiles || [],
            })
          }
        } catch (err) {
          console.error('Error fetching user profile:', err)
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      if (isDemoMode) {
        // Demo login
        const demoUser = DEMO_CREDENTIALS.find(
          (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
        )
        if (!demoUser) {
          throw new Error('Invalid demo credentials')
        }
        const user = DEMO_USERS.find((u) => u.role === demoUser.role)
        if (user) {
          setCurrentUser(user)
          localStorage.setItem('cogniva_demo_user', JSON.stringify(user))
        }
        return
      }
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('Invalid demo')) {
        setError('Invalid email or password. Please try again.')
      } else if (msg.includes('auth/user-not-found')) {
        setError('No account found with this email.')
      } else if (msg.includes('auth/too-many-requests')) {
        setError('Too many attempts. Please try again later.')
      } else {
        setError('Login failed. Please try again.')
      }
      throw err
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setError(null)
    try {
      if (isDemoMode) {
        // Demo registration
        const newUser: User = {
          uid: `demo-${role}-${Date.now()}`,
          email,
          role,
          displayName: name,
          createdAt: new Date(),
          lastLogin: new Date(),
          linkedProfiles: [],
        }
        setCurrentUser(newUser)
        localStorage.setItem('cogniva_demo_user', JSON.stringify(newUser))
        return
      }

      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(fbUser, { displayName: name })
      const userData: Omit<User, 'uid'> = {
        email,
        role,
        displayName: name,
        createdAt: new Date(),
        lastLogin: new Date(),
        linkedProfiles: [],
      }
      await setDoc(doc(db, 'users', fbUser.uid), {
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists.')
      } else if (msg.includes('auth/weak-password')) {
        setError('Password must be at least 6 characters.')
      } else {
        setError('Registration failed. Please try again.')
      }
      throw err
    }
  }

  const logout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('cogniva_demo_user')
      setCurrentUser(null)
      return
    }
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    setError(null)
    if (isDemoMode) {
      // Demo mode - just simulate success
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: unknown) {
      setError('Failed to send reset email. Please check the email address.')
      throw err
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
