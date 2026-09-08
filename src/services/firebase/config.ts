// ============================================================
// Firebase Configuration
// Uses environment variables - never expose keys in source
// Demo/mock fallback when Firebase is not configured
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cogniva-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cogniva-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
}

// Prevent duplicate initialization
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const firebaseApp = app

// Check if we are in demo mode
export const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY
